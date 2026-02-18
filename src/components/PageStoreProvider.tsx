import PagesStore from '@store/pages';
import { useEffect } from 'react';

const PageStoreProvider = ({ title }) => {
  /**
   * Sets the passed title into the page store.
   */
  useEffect(() => {
    if (title) {
      PagesStore.set({ title });
    }
  }, []);

  return null;
};

export default PageStoreProvider;