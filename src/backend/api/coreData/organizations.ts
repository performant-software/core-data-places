import Base from '@backend/api/coreData/base';

/**
 * Class responsible for calling the Astro organizations API.
 */
class Organizations extends Base {
  constructor() {
    super('organizations');
  }
}

export default new Organizations();