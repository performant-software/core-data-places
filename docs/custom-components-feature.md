# Custom Components Feature: Design Document

## Overview

This document outlines approaches for importing project-specific UI components from the content repository into the Core Data Places Astro template. This feature would allow each project to define custom components without modifying the base template repository.

## Current Architecture

Core Data Places currently:
- Stores all project-specific content in a separate GitHub repository
- Clones the content repo at build time via `scripts/build.content.mjs`
- Copies the `/content` folder containing TinaCMS-managed content
- Uses environment variables to specify the content repository:
  - `GITHUB_OWNER` - GitHub user/org name
  - `GITHUB_REPO` - Repository name
  - `GITHUB_BRANCH` - Branch to clone

## Research Findings

### Astro Integration Capabilities

Astro integrations provide several mechanisms for extending functionality:

1. **`injectRoute()`** - Dynamically add routes/pages from external sources
2. **`addRenderer()`** - Register custom component renderers for framework support
3. **`updateConfig()`** - Modify Astro and Vite configuration
4. **Vite plugins** - Implement virtual modules and custom resolution logic
5. **Lifecycle hooks** - Access to build process at multiple stages:
   - `astro:config:setup` - Before config resolution (earliest)
   - `astro:build:start` - Before production build begins
   - `astro:server:setup` - When dev server initializes

### Content Repository Suitability

The existing content repository structure is well-suited for custom components:
- Already cloned during build process
- Has established access patterns and authentication
- Can be extended with new folders without affecting TinaCMS content

## Proposed Implementation Approaches

### Approach A: File System Copy (Recommended)

**Complexity:** Low
**Flexibility:** Medium
**Maintainability:** High

#### How It Works
1. Extend `scripts/build.content.mjs` to copy a `/components` folder from content repo
2. Create custom Astro integration that runs during `astro:config:setup`
3. Configure path aliases in `astro.config.mjs` for component resolution
4. Components are imported using standard import syntax

#### Content Repository Structure
```
content-repo/
├── content/              # Existing TinaCMS content
│   ├── branding/
│   ├── i18n/
│   ├── pages/
│   └── ...
├── components/           # NEW: Custom components
│   ├── cards/
│   │   └── CustomCard.tsx
│   ├── visualizations/
│   │   └── CustomChart.tsx
│   └── maps/
│       └── CustomMapLayer.astro
└── package.json          # Optional: component dependencies
```

#### Implementation Steps
1. **Modify Build Script** (`scripts/build.content.mjs`)
   ```javascript
   // Copy components folder if it exists
   if (fs.existsSync(`${TEMP_DIR}/components`)) {
     fs.cpSync(`${TEMP_DIR}/components`, './src/components/custom', {
       recursive: true
     });
   }
   ```

2. **Create Integration** (`integrations/custom-components.js`)
   ```javascript
   export default () => ({
     name: 'custom-components',
     hooks: {
       'astro:config:setup': ({ updateConfig }) => {
         updateConfig({
           vite: {
             resolve: {
               alias: {
                 '@custom': './src/components/custom'
               }
             }
           }
         });
       }
     }
   });
   ```

3. **Update Astro Config**
   ```javascript
   import customComponents from './integrations/custom-components.js';

   export default defineConfig({
     integrations: [
       mdx(),
       sitemap(),
       react(),
       auth(),
       tinaDirective(),
       customComponents() // NEW
     ],
     // ...
   });
   ```

4. **Usage in Pages/Components**
   ```astro
   ---
   import CustomCard from '@custom/cards/CustomCard.tsx';
   ---
   <CustomCard title="My Custom Card" />
   ```

#### Pros
- Simple to implement and understand
- Fits existing build pipeline
- No complex virtual module system needed
- Standard import patterns
- Easy to debug

#### Cons
- Components must exist at build time
- No dynamic component loading
- Requires rebuild when components change
- Path aliases need TypeScript configuration

---

### Approach B: Virtual Module with Dynamic Registry

**Complexity:** Medium-High
**Flexibility:** High
**Maintainability:** Medium

#### How It Works
1. Create Vite plugin that exposes `virtual:project-components` module
2. Plugin scans components folder and generates a registry
3. Components imported from virtual module namespace
4. Supports dynamic discovery and type generation

#### Content Repository Structure
```
content-repo/
├── content/
├── components/
│   ├── cards/
│   │   └── CustomCard.tsx
│   └── index.ts          # Optional: manual exports
└── components.config.json # Optional: metadata
```

#### Implementation Steps
1. **Create Vite Plugin** (`integrations/vite-plugin-custom-components.js`)
   ```javascript
   import fs from 'fs';
   import path from 'path';

   const VIRTUAL_MODULE_ID = 'virtual:project-components';
   const RESOLVED_ID = '\0' + VIRTUAL_MODULE_ID;

   export function customComponentsPlugin() {
     return {
       name: 'vite-plugin-custom-components',
       resolveId(id) {
         if (id === VIRTUAL_MODULE_ID) {
           return RESOLVED_ID;
         }
       },
       load(id) {
         if (id === RESOLVED_ID) {
           // Scan components directory
           const componentsPath = './src/components/custom';
           if (!fs.existsSync(componentsPath)) {
             return 'export default {};';
           }

           // Generate exports dynamically
           const files = fs.readdirSync(componentsPath, { recursive: true });
           const exports = files
             .filter(f => /\.(tsx|astro|jsx)$/.test(f))
             .map(f => {
               const name = path.basename(f, path.extname(f));
               const importPath = path.join(componentsPath, f);
               return `export { default as ${name} } from '${importPath}';`;
             })
             .join('\n');

           return exports;
         }
       }
     };
   }
   ```

2. **Add Plugin to Config**
   ```javascript
   import { customComponentsPlugin } from './integrations/vite-plugin-custom-components.js';

   export default defineConfig({
     vite: {
       plugins: [
         tailwindcss(),
         customComponentsPlugin() // NEW
       ]
     }
   });
   ```

3. **Usage**
   ```astro
   ---
   import { CustomCard, CustomChart } from 'virtual:project-components';
   ---
   <CustomCard />
   <CustomChart />
   ```

4. **TypeScript Support** (`src/env.d.ts`)
   ```typescript
   declare module 'virtual:project-components' {
     export const CustomCard: any;
     export const CustomChart: any;
     // Could be auto-generated
   }
   ```

#### Pros
- Dynamic component discovery
- Single import source
- Can generate TypeScript types
- Flexible metadata system
- Hot module replacement support

#### Cons
- More complex implementation
- Virtual module concept may be unfamiliar
- Requires Vite plugin knowledge
- TypeScript types need maintenance or generation
- Debugging can be harder

---

### Approach C: NPM Package Pattern

**Complexity:** Medium
**Flexibility:** High
**Maintainability:** High
**Scalability:** Excellent

#### How It Works
1. Content repository becomes a proper npm package
2. Add `package.json` with component exports
3. Install as dependency (via git URL or npm registry)
4. Import components using package name
5. Can use standard npm tooling and versioning

#### Content Repository Structure
```
content-repo/
├── content/              # TinaCMS content
├── components/           # Exported components
│   ├── cards/
│   │   └── CustomCard.tsx
│   └── index.ts
├── package.json          # Package definition
└── tsconfig.json         # TypeScript config
```

#### package.json Example
```json
{
  "name": "@my-org/project-content",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    "./components/*": "./components/*",
    "./components": "./components/index.ts"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "astro": "^5.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.48",
    "typescript": "^5.0.0"
  }
}
```

#### Implementation Steps
1. **Set Up Content Repo as Package**
   - Add `package.json` with exports
   - Add `tsconfig.json` for TypeScript
   - Create `components/index.ts` for barrel exports

2. **Install in Core Data Places**
   ```bash
   npm install git+https://${GITHUB_TOKEN}@github.com/${OWNER}/${REPO}.git#${BRANCH}
   ```

   Or in `package.json`:
   ```json
   {
     "dependencies": {
       "@my-org/project-content": "github:my-org/content-repo#main"
     }
   }
   ```

3. **Update Build Process**
   - Remove component copying from `build.content.mjs`
   - Keep content folder copying for TinaCMS
   - Use npm/git for component management

4. **Usage**
   ```astro
   ---
   import { CustomCard } from '@my-org/project-content/components';
   // or
   import CustomCard from '@my-org/project-content/components/cards/CustomCard';
   ---
   <CustomCard />
   ```

5. **Integration Hook** (optional, for config)
   ```javascript
   export default () => ({
     name: 'project-components',
     hooks: {
       'astro:config:setup': ({ updateConfig }) => {
         // Could configure component-specific settings
         updateConfig({
           vite: {
             optimizeDeps: {
               include: ['@my-org/project-content']
             }
           }
         });
       }
     }
   });
   ```

#### Pros
- Standard npm package patterns
- Proper versioning and dependency management
- Can publish to npm registry (public or private)
- TypeScript support out of the box
- Can share components across multiple projects
- IDE autocomplete and type checking
- Can use standard build tools (tsup, rollup, etc.)
- Clear separation of concerns

#### Cons
- Requires package.json maintenance
- Need authentication for private repos
- Version updates require npm install
- More setup complexity initially
- May need build step for components

---

## Comparison Matrix

| Feature | Approach A (File Copy) | Approach B (Virtual Module) | Approach C (NPM Package) |
|---------|------------------------|----------------------------|--------------------------|
| **Complexity** | Low | Medium-High | Medium |
| **Setup Time** | Quick | Moderate | Moderate |
| **TypeScript** | Manual | Generated | Native |
| **Versioning** | Git commits | Git commits | npm/git tags |
| **Sharing** | Per-project | Per-project | Multi-project |
| **Hot Reload** | Yes | Yes | Yes* |
| **IDE Support** | Good | Good | Excellent |
| **Debugging** | Easy | Medium | Easy |
| **Scalability** | Medium | High | Excellent |

*With proper npm link or file: protocol in development

## Recommendation

**Start with Approach A (File System Copy)** for the following reasons:

1. **Minimal disruption** - Extends existing build pipeline
2. **Quick implementation** - Can be done in 1-2 hours
3. **Easy to understand** - Team familiarity with pattern
4. **Upgrade path** - Can migrate to B or C later if needed
5. **Sufficient for most use cases** - Custom cards, visualizations, layouts

**Consider migrating to Approach C (NPM Package)** when:
- Multiple projects need to share components
- Component versioning becomes important
- Team wants better TypeScript/IDE support
- Component library grows significantly (>20 components)

**Approach B (Virtual Module)** is best suited for:
- Need for dynamic component discovery
- Automatic type generation is valuable
- Building a plugin/extension system
- Advanced use cases with metadata

## Next Steps

1. Validate approach with team
2. Create proof-of-concept with Approach A
3. Test with sample custom components
4. Document usage for project teams
5. Consider migration to Approach C for v2

## Open Questions

1. Should custom components have access to Core Data utilities/contexts?
2. Do we need a component validation/testing step?
3. Should there be a component naming convention?
4. How do we handle component dependencies (npm packages)?
5. Do custom components need their own build step (e.g., Tailwind, CSS modules)?

## References

- [Astro Integration API](https://docs.astro.build/en/reference/integrations-reference/)
- [Astro Configuration](https://docs.astro.build/en/reference/configuration-reference/)
- [Vite Plugin API](https://vitejs.dev/guide/api-plugin.html)
- [Vite Virtual Modules](https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention)
- Current implementation: `scripts/build.content.mjs:18`
