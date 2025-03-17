import eventsLoader, { eventLoader } from '@loaders/api/events';
import instancesLoader, { instanceLoader } from '@loaders/api/instances';
import itemsLoader, { itemLoader } from '@loaders/api/items';
import mediaContentsLoader from './mediaContents';
import organizationsLoader, { organizationLoader } from '@loaders/api/organizations';
import peopleLoader, { personLoader } from '@loaders/api/people';
import placesLoader, { placeLoader } from '@loaders/api/places';
import worksLoader, { workLoader } from '@loaders/api/works';

const loaderDict = {
  events: { fetchAll: eventsLoader, fetchOne: eventLoader },
  instances: { fetchAll: instancesLoader, fetchOne: instanceLoader },
  items: { fetchAll: itemsLoader, fetchOne: itemLoader },
  media_contents: { fetchAll: mediaContentsLoader },
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
  mediaContentsLoader,
  organizationsLoader,
  peopleLoader,
  placesLoader,
  worksLoader,
};
