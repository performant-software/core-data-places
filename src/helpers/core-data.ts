import config from '../../public/config.json';

const projectIds = config.core_data.project_ids;
export const projectIdsApiSuffix = projectIds.map((id) => (`project_ids[]=${id}`)).join('&');