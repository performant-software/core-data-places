import { buildResponse } from '@utils/api';
import { APIRoute } from 'astro';
import { getPosts } from '@services/posts';
import { convertToNumber } from '@utils/url';
import config from '@config';

export const GET: APIRoute = async (req) => {
  const params = req.url.searchParams.keys().reduce((acc, key) => ({
    ...acc,
    [key]: convertToNumber(req.url.searchParams.get(key))
  }), {});

  // Only filter on `published` when the site opts in via posts_config.drafts;
  // otherwise existing posts (which don't carry the frontmatter field) disappear.
  // See #635 — regression introduced when `publish` was renamed to `published`.
  let filter: Record<string, unknown> = {};

  if (config.content?.posts_config?.drafts) {
    filter['published'] = { eq: true };
  }

  if (params?.category) {
    filter['category'] = { eq: params.category };
  }

  const data = await getPosts({...params, filter});

  return buildResponse(data);
};
