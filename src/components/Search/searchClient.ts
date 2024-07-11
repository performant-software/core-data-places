import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";

const searchAdapter = new TypesenseInstantsearchAdapter({
  server: {
    apiKey: import.meta.env.PUBLIC_TYPESENSE_SEARCH_KEY,
    nodes: [
      {
        host: import.meta.env.PUBLIC_TYPESENSE_HOST,
        port: import.meta.env.PUBLIC_TYPESENSE_PORT,
        protocol: import.meta.env.PUBLIC_TYPESENSE_PROTOCOL,
      },
    ],
  },
  additionalSearchParameters: {
    query_by: "name",
  },
});

const searchClient = searchAdapter.searchClient;

export default searchClient;
