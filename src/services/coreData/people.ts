import { PeopleService } from '@performant-software/core-data/ssr';
import Base from '@services/coreData/base';

/**
 * Class responsible for fetching people data.
 */
class People extends Base {
  constructor() {
    super('people', 'person', PeopleService);
  }
};

export default new People();