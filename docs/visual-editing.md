# TinaCMS Visual Editing Support

This implementation adds visual editing support to the Astro project using TinaCMS, following the official TinaCMS documentation.

## Features Added

### 1. Visual Editing Mode Detection
- Added JavaScript to `Layout.astro` that detects when the page is accessed in visual editing mode
- Checks for URL parameters like `__tina_edit=true` or `tina_edit`
- Automatically adds CSS classes and styles for visual editing

### 2. TinaCMS Configuration Enhancement
- Updated `tina/config.ts` to include a `cmsCallback` function
- Enables visual editing features when in edit mode
- Sets appropriate flags for visual editing mode

### 3. Visual Editing Utilities
- Created `src/utils/visual-editing.ts` with utilities for:
  - Detecting visual editing mode
  - Initializing visual editing features
  - Adding appropriate CSS styles

### 4. Visual Editing Wrapper Component
- Created `src/components/VisualEditingWrapper.tsx` for React components
- Provides a reusable wrapper that enables visual editing for any content section
- Uses the `useTina` hook for seamless TinaCMS integration

### 5. Enhanced Content Components
- Added `data-tina-field` attributes to page sections
- Updated `FreeText.astro` to support visual editing attributes
- Modified page rendering to include visual editing markers

## How It Works

### For Editors
1. Access the TinaCMS admin interface at `/admin`
2. When editing content, the visual editing mode will be automatically detected
3. Editable content sections will be highlighted with visual indicators
4. Real-time editing capabilities are enabled for supported content types

### For Developers
1. Add `data-tina-field` attributes to components that should be editable
2. Use the `VisualEditingWrapper` component for React-based content
3. Visual editing mode is automatically detected and applied

## Usage Examples

### Basic Component with Visual Editing
```astro
<FreeText
  content={section.body}
  data-tina-field="body"
/>
```

### React Component with Visual Editing
```tsx
import { VisualEditingWrapper } from '@components/VisualEditingWrapper';

<VisualEditingWrapper
  data={pageData}
  query={pageQuery}
  variables={{ relativePath: slug }}
>
  {({ data }) => (
    <YourComponent data={data} />
  )}
</VisualEditingWrapper>
```

## Testing

Run the tests to verify the implementation:
```bash
npm run test-config                    # Test configuration
npm run test test/visual-editing.test.ts  # Test visual editing features
```

## Requirements

- TinaCMS 2.7.x or later
- Astro with React integration
- TinaCMS configured with appropriate collections

## Browser Support

Visual editing features work in all modern browsers that support:
- ES6 modules
- URLSearchParams API
- CSS custom properties