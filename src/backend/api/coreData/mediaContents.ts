import Base from '@backend/api/coreData/base';

/**
 * Class responsible for calling the Astro media_contents API.
 */
class MediaContents extends Base {
  constructor() {
    super('media_contents');
  }
}

export default new MediaContents();