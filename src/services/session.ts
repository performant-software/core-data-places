import { AstroSession } from 'astro';
import _ from 'underscore';

/**
 * Adds the passed data as a new item to the session for the passed key.
 *
 * @param session
 * @param key
 * @param data
 */
export const addToSession = async (session: AstroSession, key: string, data: any) => {
  const items = await session.get(key) || [];

  session.set(key, [...items, data]);
};

/**
 * Deletes the session with the passed key.
 *
 * @param session
 * @param key
 */
export const deleteSession = async (session: AstroSession, key: string) => {
  await session.get(key);
  session.set(key, []);
};

/**
 * Deletes the item with the passed ID from the session with the passed key.
 *
 * @param session
 * @param key
 * @param id
 */
export const deleteSessionItem = async (session: AstroSession, key: string, id: string) => {
  const items = await session.get(key);

  const newItems = _.filter(items, (item) => item.id !== id);

  session.set(key, newItems);

  await session.get(key);
};

/**
 * Returns the session with the passed key. If any properties are provided in the "exclude" parameter, those
 * properties will be omitted from the payload.
 *
 * @param session
 * @param key
 * @param exclude
 */
export const getSession = async (session: AstroSession, key: string, exclude: Array<string> = []) => {
  const items = await session.get(key);
  return _.map(items, (item) => _.omit(item, ...exclude));
};

/**
 * Returns the item with the passed ID from the session with the passed key.
 *
 * @param session
 * @param key
 * @param id
 */
export const getSessionItem = async (session: AstroSession, key: string, id: string) => {
  const items = await session.get(key);
  return _.findWhere(items, { id });
};