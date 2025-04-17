import { hasContentCollection } from '@root/src/content.config';
import { getCollection, getEntry } from 'astro:content';
import config from '@config';
import _ from 'underscore';

const REQUEST_PARAMS = {
  per_page: 0
};

/**
 * Base class for all Core Data services. This class is responsible for fetching data from either the Astro
 * content layer or directly from Core Data.
 */
class Base {
  name: string;
  param: string;
  service: any;

  /**
   * Constructs a new service.
   *
   * @param name
   * @param param
   * @param Service
   */
  constructor(name, param, Service) {
    this.name = name;
    this.param = param;
    this.service = new Service(config.core_data.url, config.core_data.project_ids);
  }

  /**
   * Returns all the records.
   */
  async getAll() {
    let records;

    if (this.useCache()) {
      const entries = await getCollection(this.name);
      records = _.map(entries, (entry) => entry.data);
    } else {
      const response = await this.service.fetchAll(REQUEST_PARAMS);
      records = response[this.name];
    }

    return {
      [this.name]: records
    };
  }

  /**
   * Returns the full record for the passed ID. The returned object will include a `relatedRecords` attribute.
   *
   * @param id
   */
  async getFull(id: string) {
    let record;

    if (this.useCache()) {
      const entry = await getEntry(this.name, id);
      record = entry?.data;
    } else {
      const response = await this.service.fetchOne(id);
      record = response[this.param];

      const { events } = await this.getRelatedEvents(id);
      const { instances } = await this.getRelatedInstances(id);
      const { items } = await this.getRelatedItems(id);
      const { organizations } = await this.getRelatedOrganizations(id);
      const { people } = await this.getRelatedPeople(id);
      const { places } = await this.getRelatedPlaces(id);
      const { taxonomies } = await this.getRelatedTaxonomies(id);
      const { works } = await this.getRelatedWorks(id);

      const manifests = await this.getRelatedManifests(id);

      _.extend(record, {
        relatedRecords: {
          events,
          instances,
          items,
          manifests,
          organizations,
          people,
          places,
          taxonomies,
          works
        }
      });
    }

    return {
      [this.param]: record
    };
  }

  /**
   * Returns the record for the passed ID.
   *
   * @param id
   */
  async getOne(id: string) {
    let record;

    if (this.useCache()) {
      const entry = await getEntry(this.name, id);
      record = _.omit(entry?.data, 'relatedRecords');
    } else {
      const response = await this.service.fetchOne(id);
      record = response[this.param];
    }

    return {
      [this.param]: record
    };
  }

  /**
   * Returns the related events for the record with the passed ID.
   *
   * @param id
   */
  async getRelatedEvents(id: string) {
    let events;

    if (this.useCache()) {
      events = await this.getRelatedRecords(id, 'events');
    } else {
      const response = await this.service.fetchRelatedEvents(id, REQUEST_PARAMS);
      events = response.events;
    }

    return { events };
  }

  /**
   * Returns the related instances for the record with the passed ID.
   *
   * @param id
   */
  async getRelatedInstances(id: string) {
    let instances;

    if (this.useCache()) {
      instances = await this.getRelatedRecords(id, 'instances');
    } else {
      const response = await this.service.fetchRelatedInstances(id, REQUEST_PARAMS);
      instances = response.instances;
    }

    return { instances };
  }

  /**
   * Returns the related items for the record with the passed ID.
   *
   * @param id
   */
  async getRelatedItems(id: string) {
    let items;

    if (this.useCache()) {
      items = await this.getRelatedRecords(id, 'items');
    } else {
      const response = await this.service.fetchRelatedItems(id, REQUEST_PARAMS);
      items = response.items;
    }

    return { items };
  }

  /**
   * Returns the related media contents for the record with the passed ID.
   *
   * @param id
   */
    async getRelatedMedia(id: string) {
      let mediaContents;
  
      if (this.useCache()) {
        mediaContents = await this.getRelatedRecords(id, 'media_contents');
      } else {
        const response = await this.service.fetchRelatedMedia(id, REQUEST_PARAMS);
        mediaContents = response.media_contents;
      }
  
      return { mediaContents };
    }

  /**
   * Returns the related manifests for the record with the passed ID.
   *
   * @param id
   */
  async getRelatedManifests(id: string) {
    let manifests;

    if (this.useCache()) {
      manifests = await this.getRelatedRecords(id, 'manifests');
    } else {
      const response = await this.service.fetchRelatedManifests(id, REQUEST_PARAMS);
      manifests = response;
    }

    return manifests;
  }

  /**
   * Returns the related organizations for the record with the passed ID.
   *
   * @param id
   */
  async getRelatedOrganizations(id: string) {
    let organizations;

    if (this.useCache()) {
      organizations = await this.getRelatedRecords(id, 'organizations');
    } else {
      const response = await this.service.fetchRelatedOrganizations(id, REQUEST_PARAMS);
      organizations = response.organizations;
    }

    return { organizations };
  }

  /**
   * Returns the related people for the record with the passed ID.
   *
   * @param id
   */
  async getRelatedPeople(id: string) {
    let people;

    if (this.useCache()) {
      people = await this.getRelatedRecords(id, 'people');
    } else {
      const response = await this.service.fetchRelatedPeople(id, REQUEST_PARAMS);
      people = response.people;
    }

    return { people };
  }

  /**
   * Returns the related places for the record with the passed ID.
   *
   * @param id
   */
  async getRelatedPlaces(id: string) {
    let places;

    if (this.useCache()) {
      places = await this.getRelatedRecords(id, 'places');
    } else {
      const response = await this.service.fetchRelatedPlaces(id, REQUEST_PARAMS);
      places = response.places;
    }

    return { places };
  }

  /**
   * Returns the related taxonomies for the record with the passed ID.
   *
   * @param id
   */
  async getRelatedTaxonomies(id: string) {
    let taxonomies;

    if (this.useCache()) {
      taxonomies = await this.getRelatedRecords(id, 'taxonomies');
    } else {
      const response = await this.service.fetchRelatedTaxonomies(id, REQUEST_PARAMS);
      taxonomies = response.taxonomies;
    }

    return { taxonomies };
  }

  /**
   * Returns the related works for the record with the passed ID.
   *
   * @param id
   */
  async getRelatedWorks(id: string) {
    let works;

    if (this.useCache()) {
      works = await this.getRelatedRecords(id, 'works');
    } else {
      const response = await this.service.fetchRelatedWorks(id, REQUEST_PARAMS);
      works = response.works;
    }

    return { works };
  }

  // private

  /**
   * Returns the related records cache for the record with the passed ID.
   *
   * @param id
   * @param key
   */
  async getRelatedRecords(id: string, key: string) {
    let records;

    const { data } = await getEntry(this.name, id);

    if (data && data.relatedRecords) {
      records = data.relatedRecords[key];
    }

    return records;
  }

  /**
   * Returns true if the data should be fetched from the Astro content layer.
   */
  useCache() {
    return hasContentCollection(this.name);
  }
}

export default Base;