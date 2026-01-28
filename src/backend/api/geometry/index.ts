export const fetchGeometries = async () => {
  return fetch('/api/geometry/index.json').then((response) => response.json());
};

export const fetchGeometry = async (id: string) => {
  return fetch(`/api/geometry/${id}.json`).then((response) => response.json());
};