import { centroid } from '@turf/turf';
import { FACET_SUFFIX, type Collection } from '@utils/staticSearchOptions';
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
 * User-defined field types that also get a "<uuid>_facet" copy. Free text fields do not.
 */
const FACET_TYPES = ['Boolean', 'Select'];

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

const getPersonName = (person: CoreDataRecord) => _.compact([
  person.first_name,
  person.middle_name,
  person.last_name
]).join(' ');

const getName = (collection: string, record: CoreDataRecord) => (
  collection === 'people' ? getPersonName(record) : record.name
);

/**
 * Returns all the names for the models that have more than one, or `undefined` for the others.
 */
const getNames = (collection: string, record: CoreDataRecord): string[] | undefined => {
  switch (collection) {
    case 'organizations':
      return _.pluck(record.organization_names || [], 'name');

    case 'people':
      return _.map(record.person_names || [], getPersonName);

    case 'places':
      return _.pluck(record.place_names || [], 'name');

    // Instances, items, and works
    default:
      return record.source_names ? _.pluck(record.source_names, 'name') : undefined;
  }
};

const getUserDefined = (userDefined: CoreDataRecord = {}) => {
  const fields: CoreDataRecord = {};

  for (const [uuid, { type, value }] of Object.entries(userDefined)) {
    if (value === null || value === undefined || value === '') {
      continue;
    }

    fields[uuid] = value;

    if (FACET_TYPES.includes(type)) {
      fields[`${uuid}${FACET_SUFFIX}`] = value;
    }
  }

  return fields;
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
    ...(names ? { names, names_facet: names } : { name_facet: name }),
    ...(record.biography ? { biography: record.biography } : {}),
    ...(record.description ? { description: record.description } : {}),
    ...(geometry ? { geometry } : {}),
    ...getUserDefined(record.user_defined)
  };
};

const getDates = (event: CoreDataRecord) => {
  const startDate = toTimestamps(event.start_date);
  const endDate = toTimestamps(event.end_date);

  return {
    start_date: startDate,
    start_date_facet: startDate,
    end_date: endDate,
    end_date_facet: endDate
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
 * Returns [latitude, longitude] for the center of the passed geometry.
 */
const getCoordinates = (geometry: any) => {
  const [longitude, latitude] = centroid(geometry).geometry.coordinates;
  return [latitude, longitude];
};

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
            entry.event_range_facet = eventRange;
          }
        }
      }

      entry.inverse = !!reference.project_model_relationship_inverse;

      document[relationshipId] = [...(document[relationshipId] || []), entry];
    }
  }

  if (collection === 'events') {
    Object.assign(document, getDates(record));
  }

  const eventRange = getEventRange(collection === 'events' ? [record] : relatedEvents);

  if (!_.isEmpty(eventRange)) {
    document.event_range_facet = eventRange;
  }

  if (document.geometry) {
    document.coordinates = getCoordinates(document.geometry);
  }

  return document;
};
