import Base from '@backend/api/base';

/**
 * Class responsible for calling the Astro places API.
 */
class Places extends Base {
  constructor() {
    super('places');
  }
}

export default new Places();