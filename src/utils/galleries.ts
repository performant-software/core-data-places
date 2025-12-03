import config from '@config';
import { hasContentCollection } from '@root/src/content.config';

const BASE_URL = import.meta.env.PUBLIC_BASE_URL;

/**
 * Fetches data from a URL and parses it as JSON.
 * @param url
 */
export const fetchJson = async (url: string) => {
  const response = await fetch(url);
  return await response.json();
};

/**
 * The project_ids param disappears from the manifest ID when accessed directly from Core Data,
 * so we need to truncate it to match the ID in the content collection.
 * @param manifestId
 */
export const truncateManifestId = (manifestId: string) => manifestId.split('?project_ids')[0];


/**
 * Gets the list of manifests for the gallery.
 */
export const getManifests = async () => {
  const data = [];

  const json = await fetchJson(config.gallery);
  const items = json.items || []

  for (const item of items) {
    const manifest = await fetchJson(item.id);
    data.push(manifest);
  }

  return data
};

/**
 * Gets one manifest by its ID.
 */
export const getManifest = async (url: string) => {
  return await fetchJson(url);
};

/**
 * Generates the URL for a manifest when running in static mode.
 * @param manifestId
 */
export const getStaticManifestUrl = (manifestId: string) => (
  `${BASE_URL}/api/gallery/${encodeURIComponent(truncateManifestId(manifestId))}.json`
);

