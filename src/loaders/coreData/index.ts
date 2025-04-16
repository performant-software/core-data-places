import eventsLoader from '@loaders/coreData/events';
import instancesLoader from '@loaders/coreData/instances';
import itemsLoader from '@loaders/coreData/items';
import organizationsLoader from '@loaders/coreData/organizations';
import peopleLoader from '@loaders/coreData/people';
import placesLoader from '@loaders/coreData/places';
import worksLoader from '@loaders/coreData/works';

export default {
  ...eventsLoader,
  ...instancesLoader,
  ...itemsLoader,
  ...organizationsLoader,
  ...peopleLoader,
  ...placesLoader,
  ...worksLoader
};