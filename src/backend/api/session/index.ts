import { buildUrl } from '@utils/url';
import { v4 as uuid } from 'uuid';

/**
 * Deletes the session for the passed key.
 *
 * @param key
 */
export const deleteSession = async (key: string) => {
  const options = {
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
  const response = await fetch(buildUrl(`/api/session/${key}`, params));
  return response.json();
};

/**
 * Returns the session item for the passed ID.
 *
 * @param key
 * @param id
 */
export const fetchSessionItem = async (key: string, id: string, sessionId: string = null) => {
  const response = await fetch(buildUrl(`/api/session/${key}/${id}`, { sessionId }));
  return response.json();
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
    method: 'POST',
    body: JSON.stringify(payload)
  };

  const response = await fetch(`/api/session/${key}`, options);
  return response.json();
};