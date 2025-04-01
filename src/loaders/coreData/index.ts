import eventsLoader, { eventLoader } from '@loaders/coreData/events';
import instancesLoader, { instanceLoader } from '@loaders/coreData/instances';
import itemsLoader, { itemLoader } from '@loaders/coreData/items';
import manifestsLoader from './manifests';
import organizationsLoader, { organizationLoader } from '@loaders/coreData/organizations';
import peopleLoader, { personLoader } from '@loaders/coreData/people';
import placesLoader, { placeLoader } from '@loaders/coreData/places';
import worksLoader, { workLoader } from '@loaders/coreData/works';

const loaderDict = {
  events: { fetchAll: eventsLoader, fetchOne: eventLoader },
  instances: { fetchAll: instancesLoader, fetchOne: instanceLoader },
  items: { fetchAll: itemsLoader, fetchOne: itemLoader },
  manifests: { fetchAll: manifestsLoader },
  organizations: { fetchAll: organizationsLoader, fetchOne: organizationLoader },
  people: { fetchAll: peopleLoader, fetchOne: personLoader },
  places: { fetchAll: placesLoader, fetchOne: placeLoader },
  works: { fetchAll: worksLoader, fetchOne: workLoader }
};

export {
  eventsLoader,
  instancesLoader,
  itemsLoader,
  loaderDict,
  manifestsLoader,
  organizationsLoader,
  peopleLoader,
  placesLoader,
  worksLoader,
};
