/**
 * Returns the current record ID for the passed route.
 *
 * @param route
 */
export const getCurrentId = (route: string) => {
  const [, uuid] = route.split('/').filter(Boolean);
  return uuid;
};