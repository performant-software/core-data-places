import config from '@config' with { type: 'json' };

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
 * Generates a URL from a manifest ID with search params removed.
 * @param manifestId
 */
export const truncateManifestId = (manifestId: string) => {
  const url = new URL(manifestId);
  url.search = ''
  return url.href;
};

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

export const getManifestLabel = (item: any, locale: string) => {
  const hasMatchingLabel = item.label[locale] && item.label[locale].length > 0;
  if (hasMatchingLabel) {
    return item.label[locale][0];
  }

  const hasEnglishLabel = item.label['en'] && item.label['en'].length > 0;
  if (hasEnglishLabel) {
    return item.label['en'][0];
  }

  return item.id;
};

/**
 * Generates the URL for a manifest when running in static mode.
 * @param manifestId
 */
export const getStaticManifestUrl = (manifestId: string) => (
  `${BASE_URL}/api/gallery/${encodeURIComponent(truncateManifestId(manifestId))}.json`
);

