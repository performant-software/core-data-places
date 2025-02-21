import Base from '@backend/api/base';

/**
 * Class responsible for calling the Astro people API.
 */
class People extends Base {
  constructor() {
    super('people');
  }
}

export default new People();