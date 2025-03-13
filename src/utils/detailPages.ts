import { getCollection } from "astro:content";
import { Models } from "./types";

export const getDetailPagePaths = (async (config: any, model: Models) => {
  let routes = [];

  if (!config.detail_pages || !config.detail_pages.includes(model)) {
    return routes;
  }

  const pages = await getCollection(model);
  if (pages && pages.length) {
    for (const lang of config.i18n.locales) {
      const locPages = pages.map((page) => ({
        params: {
          lang: lang,
          uuid: page.id
        },
      }));
      routes = [...routes, ...locPages];
    }
  }

  return routes;
});
