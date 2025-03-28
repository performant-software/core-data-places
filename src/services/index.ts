import { loaderDict } from '@loaders/api';
import { getRelation, singularForms } from '@loaders/api/helpers';
import { hasContentCollection } from '@root/src/content.config';
import { getEntry } from 'astro:content';
import { Models } from '../utils/types';

export const getRecord = async (model: Models, uuid: string) => {
  const singular = singularForms[model];

  if (hasContentCollection(model)) {
    const entry: any = await getEntry(model, uuid);
    let detail: any = {};

    Object.keys(entry.data)
      .filter((key) => key !== 'relatedRecords')
      .forEach((key) => {
        detail[key] = entry?.data[key];
      });

    return {
      [singular]: detail
    }
  } else {
    const data = await loaderDict[model].fetchOne(uuid, false);

    return data
  }
}

export const getRelatedRecords = async (
  model: Models,
  uuid: string,
  relatedModel: Models
) => {
  if (hasContentCollection(model)) {
    const entry = await getEntry(model, uuid);
    return {
      [relatedModel]: entry.data.relatedRecords[relatedModel]
    }
  } else {
    const data = await getRelation(model, uuid, relatedModel);
    return data
  }
}

export const getFullRecord = async (model: Models, uuid: string) => {
  if (hasContentCollection(model)) {
    const entry: any = await getEntry(model, uuid);
    return entry?.data;
  } else {
    const data = await loaderDict[model].fetchOne(uuid);
    return data;
  }
}
