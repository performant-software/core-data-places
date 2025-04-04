import { MediaContentsService } from '@performant-software/core-data/ssr';
import Base from '@services/coreData/base';

/**
 * Class responsible for fetching media_contents data. Currently, there is no media contents data used
 * directly within the site, only within TinaCMS to select a media record.
 *
 * As a result, only the `getAll` method will be available.
 */
class MediaContents extends Base {
  constructor() {
    super('mediaContents', 'mediaContent', MediaContentsService);
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