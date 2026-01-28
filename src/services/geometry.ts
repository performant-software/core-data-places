import { hasContentCollection } from '@root/src/content.config';
import { getCollection, getEntry } from 'astro:content';

interface Record {
  data: {
    uuid: string;
    geometry: any;
    name?: string;
    recordId?: number;
  };
}

/**
 * Returns the geometry records for the passed page.
 *
 * @param page
 */
export const getAll = async () => {
  let records: Record[];

  if (hasContentCollection('geometry')) {
    records = await getCollection('geometry');
  }

  return records;
};

export const getOne = async (id: string) => {
  let record: Record;

  if (hasContentCollection('geometry')) {
    record = await getEntry('geometry', id);
  }

  return record;
};