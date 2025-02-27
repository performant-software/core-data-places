import Base from '@backend/api/base';

/**
 * Class responsible for calling the Astro works API.
 */
class Works extends Base {
  constructor() {
    super('works');
  }
}

export default new Works();