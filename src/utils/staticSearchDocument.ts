import { centroid } from '@turf/turf';
import { getNameView } from '@utils/people';
import type { Collection } from '@utils/staticSearchOptions';
import _ from 'underscore';

/**
 * Converts the FairData records stored by the content loaders into documents shaped like the ones FairData indexes in
 * Typesense, so the same facet, result card, and map configuration works for both kinds of search.
 */

type CoreDataRecord = { [key: string]: any };

/**
 * Returns the full record for the passed collection and UUID, or `undefined` if it was not loaded.
 */
export type RecordLookup = (collection: Collection, uuid: string) => CoreDataRecord | undefined;

/**
 * Related record keys that the loader stores as references, mapped to the collection holding the full record.
 */
const REFERENCED_COLLECTIONS: { [key: string]: Collection } = {
  events: 'events',
  instances: 'instances',
  items: 'items',
  organizations: 'organizations',
  people: 'people',
  places: 'places',
  works: 'works'
};

/**
 * Related record keys that the loader stores in full.
 */
const EMBEDDED_KEYS = ['mediaContents', 'taxonomies'];

const toTimestamp = (date: string) => Date.parse(date) / 1000;

/**
 * Converts a fuzzy date to its range as Unix timestamps, e.g. [1722470400, 1722470400].
 */
const toTimestamps = (date?: { start_date?: string, end_date?: string }) => (
  date?.start_date && date?.end_date
    ? [toTimestamp(date.start_date), toTimestamp(date.end_date)]
    : []
);

const toYear = (timestamp: number) => new Date(timestamp * 1000).getUTCFullYear();

const getName = (collection: string, record: CoreDataRecord) => (
  collection === 'people' ? getNameView(record) : record.name
);

/**
 * Returns all the names for the models that have more than one, or `undefined` for the others.
 */
const getNames = (collection: string, record: CoreDataRecord): string[] | undefined => {
  switch (collection) {
    case 'organizations':
      return _.pluck(record.organization_names || [], 'name');

    case 'people':
      return _.map(record.person_names || [], getNameView);

    case 'places':
      return _.pluck(record.place_names || [], 'name');

    // Instances, items, and works
    default:
      return record.source_names ? _.pluck(record.source_names, 'name') : undefined;
  }
};

const getUserDefined = (userDefined: CoreDataRecord = {}) => {
  const fields: CoreDataRecord = {};

  for (const [uuid, { value }] of Object.entries(userDefined)) {
    if (value === null || value === undefined || value === '') {
      continue;
    }

    fields[uuid] = value;
  }

  return fields;
};

/**
 * Returns [latitude, longitude] for the center of the passed geometry.
 */
const getCoordinates = (geometry: any) => {
  const [longitude, latitude] = centroid(geometry).geometry.coordinates;
  return [latitude, longitude];
};

/**
 * Returns the fields shared by a document and the related records nested in it.
 */
const getFields = (collection: string, record: CoreDataRecord) => {
  const name = getName(collection, record);
  const names = getNames(collection, record);
  const geometry = record.place_geometry?.geometry_json;

  return {
    id: record.uuid,
    uuid: record.uuid,
    name,
    ...(names ? { names } : {}),
    ...(record.biography ? { biography: record.biography } : {}),
    ...(record.description ? { description: record.description } : {}),
    ...(geometry ? { geometry, coordinates: getCoordinates(geometry) } : {}),
    ...getUserDefined(record.user_defined)
  };
};

const getDates = (event: CoreDataRecord) => {
  const startDate = toTimestamps(event.start_date);
  const endDate = toTimestamps(event.end_date);

  return {
    start_date: startDate,
    end_date: endDate
  };
};

/**
 * Returns the years of an event's dates, which only the top-level event documents include.
 */
const getYears = (event: CoreDataRecord) => {
  return {
    start_year: _.map(toTimestamps(event.start_date), toYear),
    end_year: _.map(toTimestamps(event.end_date), toYear)
  };
};

/**
 * Returns the first and last years of the passed events, e.g. [2024, 2025].
 */
const getEventRange = (events: CoreDataRecord[]) => {
  const years = _.chain(events)
    .map((event) => [...toTimestamps(event.start_date), ...toTimestamps(event.end_date)])
    .flatten()
    .map(toYear)
    .value();

  return _.isEmpty(years) ? [] : [_.min(years), _.max(years)];
};

/**
 * Returns the range of the events related to the passed record, resolving the events from the passed lookup.
 */
const getRelatedEventRange = (record: CoreDataRecord, lookup: RecordLookup) => getEventRange(_.compact(_.map(
  record.relatedRecords?.events || [],
  ({ uuid }) => lookup('events', uuid)
)));

/**
 * Converts the passed record from the passed collection into a search document.
 */
export const buildDocument = (collection: Collection, record: CoreDataRecord, lookup: RecordLookup) => {
  const document: CoreDataRecord = getFields(collection, record);
  const relatedEvents: CoreDataRecord[] = [];

  for (const [key, related] of Object.entries(record.relatedRecords || {})) {
    const relatedCollection = REFERENCED_COLLECTIONS[key];

    if (!relatedCollection && !EMBEDDED_KEYS.includes(key)) {
      continue;
    }

    for (const reference of related as CoreDataRecord[]) {
      const relatedRecord = relatedCollection ? lookup(relatedCollection, reference.uuid) : reference;
      const relationshipId = reference.project_model_relationship_uuid;

      let entry: CoreDataRecord = { id: reference.uuid, uuid: reference.uuid };

      if (relatedRecord) {
        entry = getFields(relatedCollection || key, relatedRecord);

        if (relatedCollection === 'events') {
          Object.assign(entry, getDates(relatedRecord));
          relatedEvents.push(relatedRecord);
        } else if (relatedCollection) {
          const eventRange = getRelatedEventRange(relatedRecord, lookup);

          if (!_.isEmpty(eventRange)) {
            entry.event_range = eventRange;
          }
        }
      }

      entry.inverse = !!reference.project_model_relationship_inverse;

      document[relationshipId] = [...(document[relationshipId] || []), entry];
    }
  }

  if (collection === 'events') {
    Object.assign(document, getDates(record), getYears(record));
  }

  const eventRange = getEventRange(collection === 'events' ? [record] : relatedEvents);

  if (!_.isEmpty(eventRange)) {
    document.event_range = eventRange;
  }

  return document;
};

interface StaticSearch {
  name: string;
  route: string;
  static?: { model_ids?: string[] };
}

/**
 * Returns the records from the passed collection that belong to the search's models. Throws if the records don't say
 * which model they belong to, or if a model's records are in a different collection than the search's route.
 */
export const getSearchRecords = (
  search: StaticSearch,
  collection: Collection,
  loaded: Map<Collection, Map<string, CoreDataRecord>>
) => {
  const modelIds = search.static?.model_ids || [];
  const records = [...(loaded.get(collection)?.values() || [])];

  if (_.some(records, (record) => !record.project_model_uuid)) {
    throw new Error(
      `Static search "${search.name}" can't filter the "${collection}" records by model, because they don't include`
      + ' "project_model_uuid". Check that the FairData API returns it.'
    );
  }

  for (const [name, otherRecords] of loaded) {
    const record = name !== collection
      && _.find([...otherRecords.values()], ({ project_model_uuid: modelId }) => modelIds.includes(modelId));

    if (record) {
      throw new Error(
        `Static search "${search.name}" includes model "${record.project_model_uuid}", whose records are in the`
        + ` "${name}" collection rather than "${collection}" (from its route "${search.route}").`
      );
    }
  }

  return _.filter(records, (record) => modelIds.includes(record.project_model_uuid));
};
