import { OrganizationsService } from '@performant-software/core-data/ssr';
import Base from '@services/coreData/base';

/**
 * Class responsible for fetching organizations data.
 */
class Organizations extends Base {
  constructor() {
    super('organizations', 'organization', OrganizationsService);
  }
};

export default new Organizations();