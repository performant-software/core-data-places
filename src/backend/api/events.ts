import Base from '@backend/api/base';

/**
 * Class responsible for calling the Astro events API.
 */
class Events extends Base {
  constructor() {
    super('events');
  }
}

export default new Events();