import ServiceFactory from '@services/coreData/factory';

type Models = 'events' | 'instances' | 'items' | 'mediaContents' | 'organizations' | 'people' | 'places' | 'works';

export const getDetailPagePaths = (async (config: any, model: Models) => {
  let routes = [];

  if (!config.detail_pages || !config.detail_pages.includes(model)) {
    return routes;
  }

  const service = ServiceFactory.getService(model);
  const records = await service.getAll();

  for (const lang of config.i18n.locales) {
    for (const record of records[model]) {
      routes.push({ params: { lang, uuid: record.id } });
    }
  }

  return routes;
});