const projectIds = import.meta.env.PUBLIC_CORE_DATA_PROJECT_ID.split(',');

export const projectIdsApiSuffix = projectIds.map((id) => (`project_ids[]=${id}`)).join('&');