import { client } from '@tina/databaseClient';

export const fetchAbout = async () => {
  const response = await client.queries.about({ relativePath: 'about.mdx' });
  return response.data.about;
};

export const fetchPath = async (slug: string) => {
  const response = await client.queries.path({ relativePath: `${slug}.mdx`});
  return response.data.path;
}

export const fetchPaths = async () => {
  const response = await client.queries.pathConnection();
  return response.data.pathConnection.edges?.map((item) => item?.node);
};

export const fetchPost = async (slug: string) => {
  const response = await client.queries.post({ relativePath: `${slug}.mdx`});
  return response.data.post;
};

export const fetchPosts = async () => {
  const response = await client.queries.postConnection();
  return response.data.postConnection.edges?.map((item) => item?.node);
};