import { describe, expect, it } from 'vitest';
import { buildTimelineData } from '../src/utils/visualization';

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
