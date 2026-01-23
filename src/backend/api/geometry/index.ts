export const fetchGeometry = async (page: number) => {
  return fetch(`/api/geometry/${page}.json`).then((response) => response.json());
};

export const fetchGeometryCount = async () => {
  return fetch('/api/geometry/count.json').then((response) => response.json());
};