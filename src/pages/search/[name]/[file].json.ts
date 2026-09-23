import config from '@config' with { type: 'json' };
import { hasContentCollection } from '@root/src/content.config';
import type { SearchConfig } from '@types';
import { buildResponse } from '@utils/api';
import { buildDocument } from '@utils/staticSearchDocument';
import { buildOptions, COLLECTIONS, getCollectionName, type Collection } from '@utils/staticSearchOptions';
import type { APIRoute } from 'astro';
import { STATIC_BUILD } from 'astro:env/client';
import { getCollection } from 'astro:content';
import _ from 'underscore';

/**
 * Generates the ItemsJS data and options for each static search from the FairData content collections, which are
 * only loaded for static builds.
 */

export const prerender = true;

const DATA = 'data';
const OPTIONS = 'options';

const records = new Map<Collection, Promise<Map<string, any>>>();
const documents = new Map<string, Promise<Array<any>>>();

const loadCollection = (collection: Collection) => {
  if (!records.has(collection)) {
    records.set(collection, getCollection(collection).then((entries) => (
      new Map(_.map(entries, (entry) => [entry.id, entry.data]))
    )));
  }

  return records.get(collection);
};

const buildDocuments = async (search: SearchConfig) => {
  const collection = getCollectionName(search);

  if (!collection || !hasContentCollection(collection)) {
    throw new Error(
      `Static search "${search.name}" requires the "${search.route}" FairData content collection. Static searches `
      + 'are only available when STATIC_BUILD is true and USE_CONTENT_CACHE is false.'
    );
  }

  const loaded = new Map(await Promise.all(_.map(
    _.filter(COLLECTIONS, hasContentCollection),
    async (name: Collection) => [name, await loadCollection(name)] as const
  )));

  const lookup = (name: Collection, uuid: string) => loaded.get(name)?.get(uuid);

  return _.map([...loaded.get(collection).values()], (record) => buildDocument(collection, record, lookup));
};

const getDocuments = (search: SearchConfig) => {
  if (!documents.has(search.name)) {
    documents.set(search.name, buildDocuments(search));
  }

  return documents.get(search.name);
};

export const GET: APIRoute = async ({ params, props }) => {
  const { search } = props as { search: SearchConfig };
  const data = await getDocuments(search);

  return buildResponse(params.file === OPTIONS ? buildOptions(search, data) : data);
};

export const getStaticPaths = () => {
  if (!STATIC_BUILD) {
    return [];
  }

  const searches = _.filter(config.search as Array<SearchConfig>, (search) => !!search.static);

  return _.flatten(_.map(searches, (search) => _.map([DATA, OPTIONS], (file) => ({
    params: { name: search.name, file },
    props: { search }
  }))));
};
