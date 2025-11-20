import { Configuration } from '@types';
import _config from '@config' with { type: 'json' };
import { describe, expect, test } from 'vitest';
import fs from 'node:fs';

const config = _config as Configuration;

const icons = [
  'bullet',
  'checkbox',
  'checkbox_filled',
  'close',
  'date',
  'export',
  'filters',
  'gender',
  'info',
  'left_arrow',
  'left',
  'list',
  'location',
  'magnifying_glass_minus',
  'magnifying_glass_plus',
  'occupation',
  'participants',
  'person',
  'reset',
  'right',
  'search',
  'table',
  'timeline',
  'zoom_in',
  'zoom_out'
];

const validSearchTypes = [
  'map',
  'list',
  'grid'
];

describe('content', () => {
  const collections = [
    'paths',
    'posts'
  ];

  test('collections matches allowed values', () => {
    expect(config.content?.collections).toBeArrayOfValues(collections);
  });

  test('localize_pages matches allowed values', () => {
    expect(config.content?.localize_pages).toBeBoolean();
  });
});

describe('core_data', () => {
  test('is not empty', () => {
    expect(config.core_data).toBeObject();
  });

  test('url is present', () => {
    expect(config.core_data?.url).toBeString();
  });

  test('project_ids are present', () => {
    expect(config.core_data?.project_ids).toBeArrayOf(String);
  });
});

describe('custom_components', () => {
  test.skipIf(!fs.existsSync('./content/components/Hit.tsx'))('Hit component has correct props', async () => {
    await expect('Hit.tsx').toExtendProps();
  });
})

describe('detail_pages', () => {
  const names = [
    'events',
    'instances',
    'items',
    'organizations',
    'people',
    'places',
    'works'
  ];

  test('matches allowed values', () => {
    expect(config.detail_pages).toBeArrayOfValues(names);
  });
});

describe('i18n', () => {
  test('is not empty', () => {
    expect(config.i18n).toBeObject();
  });

  test('default locale is not empty', () => {
    expect(config.i18n?.default_locale).toBeString();
  });

  test('locales is not empty', () => {
    expect(config.i18n?.locales).toBeArrayOf(String, { allowEmpty: false });
  });

  test('default locale is contained within the list of locales', () => {
    expect(config.i18n?.locales).toContain(config.i18n.default_locale);
  });
});

describe('layers', () => {
  test('is not empty', () => {
    expect(config.layers).toBeArray();
  });

  describe.each(config.layers)('checking layers', (layer) => {

    test('name is not empty', () => {
      expect(layer.name).toBeString();
    });

    test('layer type matches allowed values', () => {
      const layerTypes = [
        'geojson',
        'georeference',
        'raster',
        'vector'
      ];

      expect(layer.layer_type).toBeOneOf(layerTypes);
    });

    test('url is not empty', () => {
      expect(layer.url).toBeString();
    });

    test('overlay matches allowed values', () => {
      expect(layer.overlay).toBeBoolean();
    });
  });
});

describe('result_filtering', () => {
  describe('events', () => {
    test('exclude matches allowed values', () => {
      expect(config.result_filtering?.events?.exclude).toBeArrayOf(String);
    });
  });

  describe('instances', () => {
    test('exclude matches allowed values', () => {
      expect(config.result_filtering?.instances?.exclude).toBeArrayOf(String);
    });
  });

  describe('items', () => {
    test('exclude matches allowed values', () => {
      expect(config.result_filtering?.items?.exclude).toBeArrayOf(String);
    });
  });

  describe('organizations', () => {
    test('exclude matches allowed values', () => {
      expect(config.result_filtering?.organizations?.exclude).toBeArrayOf(String);
    });
  });

  describe('people', () => {
    test('exclude matches allowed values', () => {
      expect(config.result_filtering?.people?.exclude).toBeArrayOf(String);
    });
  });

  describe('places', () => {
    test('exclude matches allowed values', () => {
      expect(config.result_filtering?.places?.exclude).toBeArrayOf(String);
    });
  });

  describe('works', () => {
    test('exclude matches allowed values', () => {
      expect(config.result_filtering?.works?.exclude).toBeArrayOf(String);
    });
  });
});

describe('search', () => {
  test('is not empty', () => {
    expect(config.search).toBeArray();
  });

  describe.each(config.search)('checking searches', (search) => {

    describe.each(search.facets || [])('facets', (facet) => {
      test('icon matches allowed type', () => {
        expect(facet.icon).toBeOneOf([undefined, ...icons]);
      });

      test('name is not empty', () => {
        expect(facet.name).toBeString();
      });

      test('type matches allowed values', () => {
        const types = [
          'list',
          'select'
        ];

        expect(facet.type).toBeOneOf(types);
      });
    });

    test('geosearch matches allowed values', () => {
      expect(search.geosearch).toBeBoolean();
    });

    test.skipIf(!search.type)('type matches allowed values', () => {
      expect(search.type).toBeOneOf(validSearchTypes);
    });

    describe.skipIf(search.type && search.type !== 'map')('map', () => {
      test('is not empty', () => {
        expect(search.map).toBeObject();
      });

      test('cluster_radius is numeric', () => {
        expect(search.map?.cluster_radius).toBeOneOf([undefined, expect.any(Number)]);
      });

      test('geometry is not empty', () => {
        expect(search.map?.geometry).toBeString();
      });

      test('max_zoom is numeric', () => {
        expect(search.map?.max_zoom).toBeOneOf([undefined, expect.any(Number)]);
      });

      test('zoom_to_place matches allowed values', () => {
        expect(search.map?.zoom_to_place).toBeBoolean();
      });
    });

    test('name is not empty', () => {
      expect(search.name).toBeString();
    });

    describe('result_card', () => {
      test('is not empty', () => {
        expect(search.result_card).toBeObject();
      });

      test('title is not empty', () => {
        expect(search.result_card?.title).toBeString();
      });

      describe.each(search.result_card?.attributes || [])('attributes', (attribute) => {
        test('name is not empty', () => {
          expect(attribute.name).toBeString();
        });

        test('icon matches expect values', () => {
          expect(attribute.icon).toBeOneOf([undefined, ...icons]);
        });
      });

      describe.each(search.result_card?.tags || [])('tags', (tag) => {
        test('name is not empty', () => {
          expect(tag.name).toBeString();
        });
      });
    });

    test('route matches allowed values', () => {
      const routes = [
        '/events',
        '/instances',
        '/items',
        '/media',
        '/organizations',
        '/people',
        '/places',
        '/works'
      ];

      expect(search.route).toBeOneOf(routes);
    });

    test('table matches allowed values', () => {
      expect(search.table).toBeBoolean();
    });

    describe('timeline', () => {
      test('date_range_facet is undefined or not empty', () => {
        expect(search.timeline?.date_range_facet).toBeOneOf([undefined, expect.any(String)]);
      });

      test('event_path is undefined or not empty', () => {
        expect(search.timeline?.event_path).toBeOneOf([undefined, expect.any(String)]);
      });
    });

    describe('typesense', () => {
      test('is not empty', () => {
        expect(search.typesense).toBeObject();
      });

      test('host is not empty', () => {
        expect(search.typesense?.host).toBeString();
      });

      test('port is numeric', () => {
        expect(search.typesense?.port).toEqual(expect.any(Number));
      });

      test('protocol is not empty', () => {
        expect(search.typesense?.protocol).toBeString();
      });

      test('api_key is not empty', () => {
        expect(search.typesense?.api_key).toBeString();
      });

      test('index_name is not empty', () => {
        expect(search.typesense?.index_name).toBeString();
      });

      test('query_by is not empty', () => {
        expect(search.typesense?.query_by).toBeString();
      });

      test('default_sort matches allowed values', () => {
        expect(search.typesense?.default_sort).toBeOneOf([undefined, expect.any(String)]);
      });

      test('exclude_fields matches allowed values', () => {
        expect(search.typesense?.exclude_fields).toBeOneOf([undefined, expect.any(String)]);
      });

      describe('facets', () => {
        test('exclude matches allowed values', () => {
          expect(search.typesense?.facets?.exclude).toBeArrayOf(String);
        });

        test('include matches allowed values', () => {
          expect(search.typesense?.facets?.include).toBeArrayOf(String);
        });
      });

      test('overrides matches allowed values', () => {
        expect(search.typesense?.overrides).toBeOneOf([undefined, expect.any(Object)]);
      });
    });
  });
});