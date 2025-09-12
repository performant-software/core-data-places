import EventsService from '@services/coreData/events';
import InstancesService from '@services/coreData/instances';
import ItemsService from '@services/coreData/items';
import MediaContentsService from '@services/coreData/mediaContents';
import OrganizationsService from '@services/coreData/organizations';
import PeopleService from '@services/coreData/people';
import PlacesService from '@services/coreData/places';
import WorksService from '@services/coreData/works';
import _ from 'underscore';

export const ModelNames = {
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
 * Returns the name of the models for which a service exists. We'll exclude media_contents since we do not
 * want to build static paths for media.
 */
const getModels = () => _.without(_.values(ModelNames), ModelNames.mediaContents);

/**
 * Returns the service for the passed name.
 *
 * @param name
 */
const getService = (name: string) => {
  let service;

  switch (name) {
    case ModelNames.events:
      service = EventsService;
      break;

    case ModelNames.instances:
      service = InstancesService;
      break;

    case ModelNames.items:
      service = ItemsService;
      break;

    case ModelNames.mediaContents:
      service = MediaContentsService;
      break;

    case ModelNames.organizations:
      service = OrganizationsService;
      break;

    case ModelNames.people:
      service = PeopleService;
      break;

    case ModelNames.places:
      service = PlacesService;
      break;

    case ModelNames.works:
      service = WorksService;
      break;
  }

  return service;
};

export default {
  getModels,
  getService
};