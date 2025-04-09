import Base from '@backend/api/coreData/base';

/**
 * Class responsible for calling the Astro instances API.
 */
class Instances extends Base {
  constructor() {
    super('instances');
  }
}

export default new Instances();