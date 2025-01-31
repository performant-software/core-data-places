import eventsLoader from "./events";
import instancesLoader from "./instances";
import itemsLoader from "./items";
import organizationsLoader from "./organizations";
import peopleLoader from "./people";
import placesLoader from "./places";
import worksLoader from "./works";

const loaderDict = {
  events: eventsLoader,
  instances: instancesLoader,
  items: itemsLoader,
  organizations: organizationsLoader,
  people: peopleLoader,
  places: placesLoader,
  works: worksLoader,
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
