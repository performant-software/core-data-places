import ServiceFactory from '@services/coreData/factory';
import { CoreData as CoreDataUtils } from '@performant-software/core-data/ssr';

type Models = 'events' | 'instances' | 'items' | 'mediaContents' | 'organizations' | 'people' | 'places' | 'works';

export const getDetailPagePaths = (async (config: any, model: string) => {
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

export const getCoverImage = (mediaContents?: any[]) => {
  if (mediaContents && mediaContents.length > 0) {
    return mediaContents[0].content_iiif_url
  }

  return null
}

export const getRelatedGeometry = (places?: any[]) => {
  if (places && places.length > 0) {
    return CoreDataUtils.toFeatureCollection(places)
  }

  return null
}

const INVERSE_SUFFIX = '_inverse';

/**
 * Groups a set of related records (e.g. related people) by relationship UUID.
 * @param relatedRecords
 * @param excludes
 */
export const groupRelationships = (relatedRecords: any[], excludes: string[]) => {
  const relations = {}

  relatedRecords.forEach(rel => {
    if (excludes.includes(rel.project_model_relationship_uuid)) {
      return
    }

    const key = rel.project_model_relationship_inverse
        ? rel.project_model_relationship_uuid + INVERSE_SUFFIX
        : rel.project_model_relationship_uuid;

    if (relations[key]) {
      relations[key].push(rel);
    } else {
      relations[key] = [rel];
    }
  })

  return relations
}