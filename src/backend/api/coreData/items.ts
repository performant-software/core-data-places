import Base from '@backend/api/coreData/base';

/**
 * Class responsible for calling the Astro items API.
 */
class Items extends Base {
  constructor() {
    super('items');
  }
}

export default new Items();