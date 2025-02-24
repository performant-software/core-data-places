import eventsLoader, { eventLoader } from "./events";
import instancesLoader, { instanceLoader } from "./instances";
import itemsLoader, { itemLoader } from "./items";
import organizationsLoader, { organizationLoader } from "./organizations";
import peopleLoader, { personLoader } from "./people";
import placesLoader, { placeLoader } from "./places";
import worksLoader, { workLoader } from "./works";

const loaderDict = {
  events: { fetchAll: eventsLoader, fetchOne: eventLoader },
  instances: { fetchAll: instancesLoader, fetchOne: instanceLoader },
  items: { fetchAll: itemsLoader, fetchOne: itemLoader },
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
  organizationsLoader,
  peopleLoader,
  placesLoader,
  worksLoader,
};
