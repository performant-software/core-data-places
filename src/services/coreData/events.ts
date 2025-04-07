import { EventsService } from '@performant-software/core-data/ssr';
import Base from '@services/coreData/base';

/**
 * Class responsible for fetching events data.
 */
class Events extends Base {
  constructor() {
    super('events', 'event', EventsService);
  }
};

export default new Events();