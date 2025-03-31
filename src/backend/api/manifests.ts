import Base from '@backend/api/base';

/**
 * Class responsible for calling the Astro manifests API.
 */
class Manifests extends Base {
  constructor() {
    super('manifests');
  }
}

export default new Manifests();