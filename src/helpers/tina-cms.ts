import { client } from '../../tina/__generated__/databaseClient';

export const fetchAbout = async () => {
  const response = await client.queries.about({ relativePath: 'about.mdx' });
  return response.data.about;
};