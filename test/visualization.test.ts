import { describe, expect, it } from 'vitest';
import { buildMapData, buildTimelineData } from '../src/utils/visualization';

describe('buildTimelineData', () => {
  const eventsSearchConfig = {
    name: 'events',
    timeline: { date_range_facet: 'start_year_facet' }
  } as any;

  it('returns empty events when the export has only features (reproduces #645)', () => {
    const data = {
      features: [
        {
          type: 'Feature',
          properties: { uuid: 'abc', title: 'Anaya Hato Enclave', name: 'Anaya Hato Enclave' },
          geometry: { type: 'Point', coordinates: [-77.13, 17.91] }
        }
      ]
    };

    const result = buildTimelineData(eventsSearchConfig, data);

    expect(result.name).toBe('events');
    expect(result.events).toHaveLength(0);
  });

  it('populates events from hits when the export includes hits (fix verification)', () => {
    const data = {
      features: [
        {
          type: 'Feature',
          properties: { uuid: 'abc', name: 'Battle of Chuao' },
          geometry: { type: 'Point', coordinates: [-67.5, 10.7] }
        }
      ],
      hits: [
        { name: 'Battle of Chuao', start_date: [-5500000000], end_date: [-5400000000] },
        { name: 'Settlement Founded', start_date: [-5000000000], end_date: [-4900000000] }
      ]
    };

    const result = buildTimelineData(eventsSearchConfig, data);

    expect(result.events).toHaveLength(2);
    expect(result.events[0]).toMatchObject({ name: 'Battle of Chuao' });
    expect(result.events[1]).toMatchObject({ name: 'Settlement Founded' });
  });
});

describe('buildMapData', () => {
  const placesSearchConfig = { name: 'places' } as any;

  it('strips Algolia decoration fields from hits so the saved JSON round-trips through MDX attributes', () => {
    const data = {
      features: [
        {
          type: 'Feature',
          properties: { uuid: 'abc', name: 'Cockpit Country' },
          geometry: { type: 'Point', coordinates: [-77.5, 18.3] }
        }
      ],
      hits: [
        {
          id: '1',
          uuid: 'abc',
          name: 'Cockpit Country',
          _highlightResult: {
            description: { value: 'enslaved &quot;recent arrivals&quot;', matchLevel: 'none', matchedWords: [] }
          },
          _snippetResult: {
            description: { value: 'enslaved &quot;recent arrivals&quot;', matchLevel: 'none' }
          },
          _rankingInfo: { nbTypos: 0 }
        }
      ]
    };

    const result = buildMapData(placesSearchConfig, data);

    expect(result.data.hits).toHaveLength(1);
    expect(result.data.hits[0]).not.toHaveProperty('_highlightResult');
    expect(result.data.hits[0]).not.toHaveProperty('_snippetResult');
    expect(result.data.hits[0]).not.toHaveProperty('_rankingInfo');
    expect(result.data.hits[0]).toMatchObject({ id: '1', uuid: 'abc', name: 'Cockpit Country' });

    // No HTML-entity-like sequences remain in the serialized form, so MDX
    // attribute serialization will round-trip cleanly.
    const serialized = JSON.stringify(result);
    expect(serialized).not.toMatch(/&[a-zA-Z0-9#]+;/);
  });

  it('preserves features unchanged', () => {
    const features = [
      {
        type: 'Feature',
        properties: { uuid: 'abc' },
        geometry: { type: 'Point', coordinates: [0, 0] }
      }
    ];

    const result = buildMapData(placesSearchConfig, { features, hits: [] });

    expect(result.data.features).toEqual(features);
    expect(result.name).toBe('places');
  });
});
