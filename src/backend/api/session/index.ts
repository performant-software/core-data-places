import { buildUrl } from '@utils/url';
import { v4 as uuid } from 'uuid';
import _ from 'underscore';

const SESSION_HEADER = 'x-session-id';
const SESSION_KEY = 'cdp-session';

/**
 * Deletes the session for the passed key.
 *
 * @param key
 */
export const deleteSession = async (key: string) => {
  const options = {
    headers: getRequestHeaders(),
    method: 'DELETE'
  };

  const response = await fetch(`/api/session/${key}`, options);
  return response.json();
};

/**
 * Deletes the session item for the passed ID.
 *
 * @param key
 * @param id
 */
export const deleteSessionItem = async (key: string, id: string) => {
  const options = {
    headers: getRequestHeaders(),
    method: 'DELETE'
  };

  const response = await fetch(`/api/session/${key}/${id}`, options);
  return response.json();
};

/**
 * Returns the session for the passed key.
 *
 * @param key
 */
export const fetchSession = async (key: string, params: { [key: string] : string } = {}) => {
  const options = {
    headers: getRequestHeaders(),
    method: 'GET'
  };

  const response = await fetch(buildUrl(`/api/session/${key}`, params), options);
  return response.json();
};

/**
 * Returns the session item for the passed ID.
 *
 * @param key
 * @param id
 */
export const fetchSessionItem = async (key: string, id: string, sessionId: string = null) => {
  const options = {
    headers: getRequestHeaders(),
    method: 'GET'
  };

  /**
   * If a session ID is provided, use that instead of the session ID in local storage.
   */
  if (sessionId) {
    _.extend(options, {
      headers: {
        [SESSION_HEADER]: sessionId
      }
    });
  }

  const response = await fetch(`/api/session/${key}/${id}`, options);
  return response.json();
};

/**
 * Returns the session ID stored in local storage. If a session ID does not exist, one is created.
 */
export const getSessionId = () => {
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = uuid();
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
};

/**
 * Saves the data to the session with the passed key.
 *
 * @param key
 * @param data
 */
export const saveSession = async (key: string, data: any) => {
  const payload = {
    ...data,
    created: new Date().toLocaleString(),
    id: uuid()
  };

  const options = {
    body: JSON.stringify(payload),
    headers: getRequestHeaders(),
    method: 'POST'
  };

  const response = await fetch(`/api/session/${key}`, options);
  return response.json();
};

// Local functions

/**
 * Returns the request headers for the fetch request.
 */
const getRequestHeaders = () => ({
  [SESSION_HEADER]: getSessionId()
});
