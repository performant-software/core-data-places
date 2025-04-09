import { InstancesService } from '@performant-software/core-data/ssr';
import Base from '@services/coreData/base';

/**
 * Class responsible for fetching instances data.
 */
class Instances extends Base {
  constructor() {
    super('instances', 'instance', InstancesService);
  }
};

export default new Instances();