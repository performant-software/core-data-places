import { WorksService } from '@performant-software/core-data/ssr';
import Base from '@services/coreData/base';

/**
 * Class responsible for fetching works data.
 */
class Works extends Base {
  constructor() {
    super('works', 'work', WorksService);
  }
};

export default new Works();