import { hasContentCollection } from '@root/src/content.config';
import { getCollection, getEntry } from 'astro:content';
import { fetchJson, getManifest, getManifests, truncateManifestId } from '@utils/galleries';
import config from '@config';

const BASE_URL = import.meta.env.PUBLIC_BASE_URL;

/**
 * Returns all manifests.
 */
export const getAll = async () => {
  let data;

  if (hasContentCollection('galleries')) {
    data = await getCollection('galleries');
  } else {
    data = await getManifests();
  }

  return data;
};

/**
 * Returns the i18n data for the passed locale.
 *
 * @param key
 */
export const getOne = async (key: string) => {
  let data;

  if (hasContentCollection('galleries')) {
    data = await getEntry('galleries', key);
  } else {
    data = await getManifest(key);
  }

  return data;
};

export const getItemLabel = (item: any, locale: string) => {
  const hasMatchingLabel = item.label[locale] && item.label[locale].length > 0;
  if (hasMatchingLabel) {
    return item.label[locale][0];
  }

  const hasEnglishLabel = item.label['en'] && item.label['en'].length > 0;
  if (hasEnglishLabel) {
    return item.label['en'][0];
  }

  return item.id;
}

export const getManifestUrl = (manifestId: string) => {
  if (hasContentCollection('galleries')) {
    return `${BASE_URL}/api/gallery/${encodeURIComponent(truncateManifestId(manifestId))}.json`;
  }

  return manifestId;
}

export const getManifestMetadata = async (locale: string): Promise<string[]> => {
  const topLevel = await fetchJson(config.gallery);

  return topLevel.items.map((item) => ({
    id: getManifestUrl(item.id),
    thumbnail: item.thumbnail[0]?.id,
    label: getItemLabel(item, locale)
  }));
};
