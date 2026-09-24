import {
  denormalizeResponse,
  getIndexOptions,
  getIndexUrls,
  normalizeQueries,
  type WorkerRequest,
  type WorkerResponse
} from '@utils/staticSearch';
import { createIndex, performSearch } from 'instantsearch-itemsjs-adapter';

const worker = self as unknown as Worker;

let index: any;

const post = (message: WorkerResponse) => worker.postMessage(message);

const load = async (indexName: string) => {
  const urls = getIndexUrls(indexName);

  const [data, options] = await Promise.all([
    fetch(urls.data).then((response) => response.json()),
    fetch(urls.options).then((response) => response.json())
  ]);

  // ItemsJS requires a `query` key, but InstantSearch supplies the actual query per-request.
  index = createIndex(data, { ...getIndexOptions(options), query: '' });

  return options;
};

worker.addEventListener('message', async ({ data }: MessageEvent<WorkerRequest>) => {
  if (data.type === 'load') {
    try {
      post({ type: 'loaded', options: await load(data.indexName) });
    } catch (error) {
      post({ type: 'loadFailed', message: String(error) });
    }
  } else if (data.type === 'search') {
    try {
      const response = await performSearch(normalizeQueries(data.queries), index);
      post({ type: 'results', id: data.id, response: denormalizeResponse(data.queries, response) });
    } catch (error) {
      post({ type: 'searchFailed', id: data.id, message: String(error) });
    }
  }
});
