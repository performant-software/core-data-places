import { hasContentCollection } from '@root/src/content.config';
import { getEntry } from 'astro:content';
import { getManifest, getStaticManifestUrl } from '@utils/galleries';

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

/**
 * Gets the URL for the passed manifest ID.
 * Will return a local API route if CDP is running statically.
 * @param manifestId
 */
export const getManifestUrl = (manifestId: string) => {
  if (hasContentCollection('galleries')) {
    return getStaticManifestUrl(manifestId);
  }

  return manifestId;
};
