import { hasContentCollection } from '@root/src/content.config';
import { getCollection } from 'astro:content';
import _ from 'underscore';

interface Record {
  data: {
    geometry: any;
  };
}

const DEFAULT_PAGE = 1;
export const PER_PAGE = 20;

/**
 * Returns the geometry records for the passed page.
 *
 * @param page
 */
export const getAll = async (page = DEFAULT_PAGE) => {
  let records: Record[];

  if (hasContentCollection('geometry')) {
    records = await getCollection('geometry');
  }

  if (records) {
    const startIndex = (page - 1) * PER_PAGE;
    const endIndex = startIndex + PER_PAGE;

    records = records.slice(startIndex, endIndex);
  }

  return _.map(records, parseRecord);
};

/**
 * Returns the count of all geometry records.
 */
export const getCount = async () => {
  let count = 0;

  if (hasContentCollection('geometry')) {
    const records = await getCollection('geometry');
    count = records?.length;
  }

  return count;
};

/**
 * Returns the passed record with the geometry data parsed into JSON.
 *
 * @param record
 */
const parseRecord = (record: any) => ({
  ...record.data,
  geometry: JSON.parse(record.data?.geometry)
});