import { describe, expect, it } from 'vitest';
import { validateSearches } from '../scripts/build.search.mjs';

const descriptors = [
  { identifier: 'store-model', label: 'Store' },
  { identifier: 'store-url', label: 'URL', context: 'Store' },
  { identifier: 'closest-t-stop', label: 'Closest T Stop', context: 'Store' }
];

const typesense = { host: 'search.example.com', index_name: 'places' };

const buildConfig = (search: object) => ({
  core_data: { project_ids: ['44'] },
  search: [{ name: 'stores', route: '/places', ...search }]
});

describe('validateSearches', () => {
  describe('static builds', () => {
    it('accepts models from the configured projects', () => {
      expect(() => validateSearches(buildConfig({ static: { model_ids: ['store-model'] } }), descriptors, true))
        .not.toThrow();
    });

    it('rejects a Typesense search', () => {
      expect(() => validateSearches(buildConfig({ typesense }), descriptors, true))
        .toThrow(/"stores" can't use "typesense" when STATIC_BUILD is true/);
    });

    it('requires at least one model', () => {
      expect(() => validateSearches(buildConfig({ static: {} }), descriptors, true))
        .toThrow(/requires at least one "static.model_ids"/);
    });

    it('rejects a model from another project', () => {
      expect(() => validateSearches(buildConfig({ static: { model_ids: ['other-model'] } }), descriptors, true))
        .toThrow(/"other-model", which is not in any of the projects in "core_data.project_ids" \(44\)/);
    });

    it('rejects the identifier of a field or relationship', () => {
      expect(() => validateSearches(buildConfig({ static: { model_ids: ['closest-t-stop'] } }), descriptors, true))
        .toThrow(/"closest-t-stop"/);
    });
  });

  describe('other builds', () => {
    it('accepts a Typesense search', () => {
      expect(() => validateSearches(buildConfig({ typesense }), descriptors, false)).not.toThrow();
    });

    it('rejects a static search', () => {
      expect(() => validateSearches(buildConfig({ static: { model_ids: ['store-model'] } }), descriptors, false))
        .toThrow(/"stores" can't use "static" unless STATIC_BUILD is true/);
    });
  });

  it('reports every error at once', () => {
    const config = {
      core_data: { project_ids: ['44'] },
      search: [
        { name: 'stores', route: '/places', typesense },
        { name: 'events', route: '/events', static: { model_ids: ['other-model'] } }
      ]
    };

    expect(() => validateSearches(config, descriptors, true)).toThrow(/"stores"[\s\S]*"events"/);
  });
});
