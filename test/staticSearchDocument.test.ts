import { describe, expect, it } from 'vitest';
import _ from 'underscore';
import { buildDocument } from '../src/utils/staticSearchDocument';
import { buildOptions, getCollectionName } from '../src/utils/staticSearchOptions';
import records from './fixtures/staticSearch/records.json';

/**
 * The document FairData indexed in Typesense for the first place in `records.json`, without the fields the public API
 * doesn't return (`record_id`, `import_id`, `owner_project` and `all_projects`).
 */
import expected from './fixtures/staticSearch/document.json';

const lookup = (collection: string, uuid: string) => _.findWhere(records[collection] || [], { uuid });

/**
 * Related records aren't guaranteed to come back in the same order as they were indexed in.
 */
const sortRelated = (document: any) => _.mapObject(document, (value) => (
  _.isArray(value) && _.isObject(value[0]) ? _.sortBy(value, 'uuid') : value
));

describe('buildDocument', () => {
  const [place] = records.places;
  const document = buildDocument('places', place, lookup as any);

  it('matches the document indexed in Typesense', () => {
    expect(sortRelated(document)).toMatchObject(sortRelated(expected));
  });

  it('adds a facet copy of Select fields only', () => {
    expect(document['6b38e52b-e3d4-4135-be7a-3c5cbd34ad89_facet']).toEqual('Multi-level');
    expect(document).not.toHaveProperty('6915e33c-a864-41e2-a1c3-7d54e4deb984_facet');
  });

  it('keeps the reference to a related record that was not loaded', () => {
    const missing = buildDocument('places', {
      ...place,
      relatedRecords: {
        people: [{
          uuid: 'missing',
          project_model_relationship_uuid: 'relationship',
          project_model_relationship_inverse: true
        }]
      }
    }, lookup as any);

    expect(missing.relationship).toEqual([{ id: 'missing', uuid: 'missing', inverse: true }]);
  });

  it('uses the full name for people', () => {
    const person = buildDocument('people', {
      uuid: 'person',
      first_name: 'Terry',
      middle_name: null,
      last_name: 'Pratchett',
      person_names: [{ first_name: 'Terry', last_name: 'Pratchett' }, { first_name: 'Sir Terry', last_name: 'Pratchett' }],
      user_defined: {}
    }, lookup as any);

    expect(person.name).toEqual('Terry Pratchett');
    expect(person.names_facet).toEqual(['Terry Pratchett', 'Sir Terry Pratchett']);
  });

  it('uses its own dates for events', () => {
    const event = lookup('events', '41d6ee01-314c-4884-90f9-f9bc64c3db4b');
    const eventDocument = buildDocument('events', event, lookup as any);

    expect(eventDocument.start_date_facet).toEqual([1722470400, 1722470400]);
    expect(eventDocument.event_range_facet).toEqual([2024, 2024]);
  });
});

describe('buildOptions', () => {
  const search = {
    route: '/places',
    facets: [{ name: 'names_facet' }, { name: '6b38e52b-e3d4-4135-be7a-3c5cbd34ad89_facet' }],
    timeline: { date_range_facet: 'event_range_facet' }
  };

  const options = buildOptions(search, [buildDocument('places', records.places[0], lookup as any)]);

  it('adds an aggregation for each facet and a range for the timeline', () => {
    expect(options.aggregations).toEqual({
      names_facet: { size: 20, conjunction: false },
      '6b38e52b-e3d4-4135-be7a-3c5cbd34ad89_facet': { size: 20, conjunction: false },
      event_range_facet: { show_facet_stats: true }
    });
  });

  it('searches the top-level text fields', () => {
    expect(_.sortBy(options.searchableFields)).toEqual(_.sortBy([
      '38fdfecb-5f8f-4085-8bfa-6640c410fa36',
      '6915e33c-a864-41e2-a1c3-7d54e4deb984',
      '6b38e52b-e3d4-4135-be7a-3c5cbd34ad89',
      'name',
      'names'
    ]));
  });
});

describe('getCollectionName', () => {
  it('returns the collection for a Core Data route', () => {
    expect(getCollectionName({ route: '/places' })).toEqual('places');
  });

  it('returns undefined for other routes', () => {
    expect(getCollectionName({ route: '/posts' })).toBeUndefined();
  });
});
