import {
  EventsService,
  InstancesService,
  ItemsService,
  MediaContentsService,
  OrganizationsService,
  PeopleService,
  PlacesService,
  WorksService
} from '@performant-software/core-data/ssr';

const ModelNames = {
  events: 'events',
  instances: 'instances',
  items: 'items',
  mediaContents: 'media_contents',
  organizations: 'organizations',
  people: 'people',
  places: 'places',
  works: 'works'
};

/**
 * Returns an initialized service for the passed named entity.
 *
 * @param name
 * @param baseUrl
 * @param projectIds
 */
export const getService = (name: string, baseUrl: string, projectIds: string[]) => {
  let service: any;

  switch (name) {
    case ModelNames.events:
      service = new EventsService(baseUrl, projectIds);
      break;

    case ModelNames.instances:
      service = new InstancesService(baseUrl, projectIds);
      break;

    case ModelNames.items:
      service = new ItemsService(baseUrl, projectIds);
      break;

    case ModelNames.mediaContents:
      service = new MediaContentsService(baseUrl, projectIds);
      break;

    case ModelNames.organizations:
      service = new OrganizationsService(baseUrl, projectIds);
      break;

    case ModelNames.people:
      service = new PeopleService(baseUrl, projectIds);
      break;

    case ModelNames.places:
      service = new PlacesService(baseUrl, projectIds);
      break;

    case ModelNames.works:
      service = new WorksService(baseUrl, projectIds);
      break;
  }

  return service;
};