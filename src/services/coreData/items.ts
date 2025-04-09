import { ItemsService } from '@performant-software/core-data/ssr';
import Base from '@services/coreData/base';

/**
 * Class responsible for fetching items data.
 */
class Items extends Base {
  constructor() {
    super('items', 'item', ItemsService);
  }
};

export default new Items();