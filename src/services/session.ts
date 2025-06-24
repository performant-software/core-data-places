import { parseSearchParams } from '@utils/url';
import { AstroCookies, AstroSession } from 'astro';
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
 * Checks the request for a session ID and checks the currently loaded session against the
 * user's original session. Reloads the session if necessary.
 *
 * @param session
 * @param cookies
 * @param request
 */
export const checkSession = async (session: AstroSession, cookies: AstroCookies, request: Request) => {
  const { sessionId } = parseSearchParams(request.url);

  if (!_.isEmpty(sessionId)) {
    // Store the current user's session
    const { value: currentSessionId } = cookies.get('astro-session') || {};
    cookies.set('cdp-session', currentSessionId, { path: '/', httpOnly: true });

    // Load the shared session
    await session.load(sessionId);
    return;
  }

  /**
   * If we're loaded another session and it doesn't match the user's original session cached in "cdp-session",
   * reload the original session.
   */
  const { value: userSessionId } = cookies.get('cdp-session') || {};
  const { value: loadedSessionId } = cookies.get('astro-session') || {};

  if (!_.isEmpty(userSessionId) && loadedSessionId !== userSessionId) {
    await session.load(userSessionId);
  }
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
 * @param sessionId
 */
export const getSessionItem = async (session: AstroSession, key: string, id: string) => {
  const items = await session.get(key);
  return _.findWhere(items, { id });
};