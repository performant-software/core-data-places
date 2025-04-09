import { PlacesService } from '@performant-software/core-data/ssr';
import Base from '@services/coreData/base';

/**
 * Class responsible for fetching places data.
 */
class Places extends Base {
  constructor() {
    super('places', 'place', PlacesService);
  }
};

export default new Places();