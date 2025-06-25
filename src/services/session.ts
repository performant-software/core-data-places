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

  const options = {
    path: '/',
    httpOnly: true
  };

  /**
   * If a session ID is provided on the request, load the session and store the current user's session ID in the
   * "cdp-session" cookie.
   */
  if (!_.isEmpty(sessionId)) {
    // Store the current user's session
    const { value: currentSessionId = '' } = cookies.get('astro-session') || {};

    const cookie = {
      sessionId: currentSessionId,
      shared: true
    };

    cookies.set('cdp-session', JSON.stringify(cookie), options);

    // Load the shared session
    await session.load(sessionId);

    return;
  }

  /**
   * If a session ID is not provided on the request, check the "cdp-session" cookie to see if the currently loaded
   * session is for another user. If so, restore the current user's session from the ID stored in the "cdp-session"
   * cookie. Then clear the "cdp-session" cookie.
   */
  const userSession = cookies.get('cdp-session')?.json() || {};

  if (userSession.shared) {
    if (!_.isEmpty(userSession.sessionId)) {
      await session.load(userSession.sessionId);
    } else {
      cookies.set('astro-session', '', options);
    }

    cookies.set('cdp-session', {}, options);
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