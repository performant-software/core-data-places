import { MediaContentsService } from '@performant-software/core-data/ssr';
import Base from '@services/coreData/base';

/**
 * Class responsible for fetching media_contents data. Currently, media contents are not directly
 * displayed on the site, only within TinaCMS to select a media record and in the search panels to
 * display the cover image.
 *
 * As a result, only the `getAll` method will be available.
 */
class MediaContents extends Base {
  constructor() {
    super('media_contents', 'media_content', MediaContentsService);
  }

  async getOne(id: string) {
    // Not implemented
    return Promise.reject();
  }

  async getFull(id: string) {
    // Not implemented
    return Promise.reject();
  }

  async getRelatedEvents(id: string) {
    // Not implemented
    return Promise.reject();
  }

  async getRelatedInstances(id: string) {
    // Not implemented
    return Promise.reject();
  }

  async getRelatedItems(id: string) {
    // Not implemented
    return Promise.reject();
  }

  async getRelatedManifests(id: string) {
    // Not implemented
    return Promise.reject();
  }

  async getRelatedOrganizations(id: string) {
    // Not implemented
    return Promise.reject();
  }

  async getRelatedPeople(id: string) {
    // Not implemented
    return Promise.reject();
  }

  async getRelatedPlaces(id: string) {
    // Not implemented
    return Promise.reject();
  }

  async getRelatedTaxonomies(id: string) {
    // Not implemented
    return Promise.reject();
  }

  async getRelatedWorks(id: string) {
    // Not implemented
    return Promise.reject();
  }
};

export default new MediaContents();