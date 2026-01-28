import { getAll } from '@services/geometry';
import { buildResponse } from '@utils/api';
import { APIRoute } from 'astro';
import _ from 'underscore';

export const GET: APIRoute = async () => {
  const records = await getAll();

  const data = _.map(records, ({ data: { uuid } }) => ({
    id: uuid,
    url: `/api/geometry/${uuid}.json`
  }));

  return buildResponse(data);
};