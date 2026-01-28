export const fetchGeometries = async () => {
  return fetch(`/api/geometry/index.json`).then((response) => response.json());
};