import { getAll, getOne } from '@services/geometry';
import { buildResponse } from '@utils/api';
import { APIRoute } from 'astro';
import { feature } from '@turf/turf';
import _ from 'underscore';

export const GET: APIRoute = async ({ params }) => {
  const { uuid } = params;

  const { data: { geometry, recordId, name } } = await getOne(uuid);

  const properties = {
    id: recordId,
    ccode: [],
    title: name,
    uuid: uuid,
    record_id: recordId,
    name
  };

  const data = feature(JSON.parse(geometry), properties, { id: recordId });

  return buildResponse(data);
};

export const getStaticPaths = async () => {
  const records = await getAll();
  return _.map(records, ({ data: { uuid } }) => ({ params: { uuid } }));
};