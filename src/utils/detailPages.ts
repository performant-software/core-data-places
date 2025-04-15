import ServiceFactory from '@services/coreData/factory';
import { CoreData as CoreDataUtils } from '@performant-software/core-data/ssr';

type Models = 'events' | 'instances' | 'items' | 'mediaContents' | 'organizations' | 'people' | 'places' | 'works';

export const getDetailPagePaths = (async (config: any, model: Models) => {
  let routes = [];

  if (!config.detail_pages || !config.detail_pages.includes(model)) {
    return routes;
  }

  const service = ServiceFactory.getService(model);
  const records = await service.getAll();

  for (const lang of config.i18n.locales) {
    for (const { uuid } of records[model]) {
      routes.push({ params: { lang, uuid } });
    }
  }

  return routes;
});

export const getCoverImage = (record: any) => {
  if (record?.relatedRecords?.mediaContents && record.relatedRecords.mediaContents.length > 0) {
    return record.relatedRecords.mediaContents[0].content_iiif_url
  }

  return null
}

export const getRelatedGeometry = (record: any) => {
  if (record?.relatedRecords?.places && record.relatedRecords.places.length > 0) {
    return CoreDataUtils.toFeatureCollection(record.relatedRecords.places)
  }

  return null
}
