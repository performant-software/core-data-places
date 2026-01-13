import { fetchPosts } from '@backend/tina';

/**
 * Returns the list of posts for the passed params.
 *
 * @param params
 */
export const getPosts = async (params: any = {}) => {
  const data = await fetchPosts(params);

  return {
    ...data,
    posts: data.posts.map((item) => ({
      ...item,
      body: null
    })),
  };
};
