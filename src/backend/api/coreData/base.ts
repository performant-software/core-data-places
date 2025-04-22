import _ from 'underscore';

/**
 * Base class for all Astro API endpoints for Core Data models.
 */
class Base {
  name: string;

  /**
   * Constructs a new Base class record.
   *
   * @param name
   */
  constructor(name) {
    this.name = name;
  }

  /**
   * Calls the `/api/:name/index.json` endpoint.
   *
   * @param params
   */
  fetchAll(params?: { [key: string]: any }) {
    return this.sendRequest(`/api/${this.name}/index.json`, params);
  }

  /**
   * Calls the `/api/:name/:id/index.json` endpoint.
   *
   * @param id
   */
  fetchOne(id: string) {
    return this.sendRequest(`/api/${this.name}/${id}/index.json`);
  }

  /**
   * Calls the `/api/:name/:id/events.json` endpoint.
   *
   * @param id
   * @param params
   */
  async fetchRelatedEvents(id: string, params: { [key: string]: any }) {
    return this.sendRequest(`/api/${this.name}/${id}/events.json`, params);
  }

  /**
   * Calls the `/api/:name/:id/instances.json` endpoint.
   *
   * @param id
   * @param params
   */
  async fetchRelatedInstances(id: string, params: { [key: string]: any }) {
    return this.sendRequest(`/api/${this.name}/${id}/instances.json`, params);
  }

  /**
   * Calls the `/api/:name/:id/items.json` endpoint.
   *
   * @param id
   * @param params
   */
  async fetchRelatedItems(id: string, params: { [key: string]: any }) {
    return this.sendRequest(`/api/${this.name}/${id}/items.json`, params);
  }

  /**
   * Calls the `/api/:name/:id/organizations.json` endpoint.
   *
   * @param id
   * @param params
   */
  async fetchRelatedOrganizations(id: string, params: { [key: string]: any }) {
    return this.sendRequest(`/api/${this.name}/${id}/organizations.json`, params);
  }

  /**
   * Calls the `/api/:name/:id/media_contents.json` endpoint.
   *
   * @param id
   * @param params
   */
    async fetchRelatedMedia(id: string, params: { [key: string]: any }) {
      return this.sendRequest(`/api/${this.name}/${id}/media_contents.json`, params);
    }

  /**
   * Calls the `/api/:name/:id/manifests.json` endpoint.
   *
   * @param id
   * @param params
   */
  async fetchRelatedManifests(id: string, params: { [key: string]: any }) {
    return this.sendRequest(`/api/${this.name}/${id}/manifests.json`, params);
  }

  /**
   * Calls the `/api/:name/:id/people.json` endpoint.
   *
   * @param id
   * @param params
   */
  async fetchRelatedPeople(id: string, params: { [key: string]: any }) {
    return this.sendRequest(`/api/${this.name}/${id}/people.json`, params);
  }

  /**
   * Calls the `/api/:name/:id/places.json` endpoint.
   *
   * @param id
   * @param params
   */
  async fetchRelatedPlaces(id: string, params: { [key: string]: any }) {
    return this.sendRequest(`/api/${this.name}/${id}/places.json`, params);
  }

  /**
   * Calls the `/api/:name/:id/taxonomies.json` endpoint.
   *
   * @param id
   * @param params
   */
  async fetchRelatedTaxonomies(id: string, params: { [key: string]: any }) {
    return this.sendRequest(`/api/${this.name}/${id}/taxonomies.json`, params);
  }

  /**
   * Calls the `/api/:name/:id/works.json` endpoint.
   *
   * @param id
   * @param params
   */
  async fetchRelatedWorks(id: string, params: { [key: string]: any }) {
    return this.sendRequest(`/api/${this.name}/${id}/works.json`, params);
  }

  // private

  /**
   * Uses the passed base URL and parameters to construct a request and fetch the data.
   *
   * @param baseUrl
   * @param params
   */
  async sendRequest(baseUrl: string, params: { [key: string]: any } = null) {
    const url = [baseUrl];

    // Append the params if not empty
    if (!_.isEmpty(params)) {
      const searchParams = new URLSearchParams(params);

      url.push('?');
      url.push(searchParams.toString());
    }

    const response = await fetch(url.join(''));
    const json = await response.json();

    return json;
  }
}

export default Base;
