import PagesStore from '@store/pages';
import { useEffect } from 'react';

const PageStoreProvider = ({ title, transparent }) => {
  /**
   * Sets the passed title into the page store.
   */
  useEffect(() => {
    PagesStore.set({ title, transparent });
  }, []);

  return null;
};

export default PageStoreProvider;