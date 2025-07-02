import SearchListItem from '@apps/session/SearchListItem';
import {
  deleteSessionItem,
  deleteSession,
  fetchSession,
  getSessionId
} from '@backend/api/session';
import TranslationContext from '@contexts/TranslationContext';
import { Button } from '@performant-software/core-data';
import NotificationsStore from '@store/notifications';
import {
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import _ from 'underscore';

const SearchList = () => {
  const [items, setItems] = useState();

  const { lang, t } = useContext(TranslationContext);

  /**
   * Returns the URL for the passed session item ID.
   */
  const getUrl = useCallback((id: string) => `/${lang}/sessions/search/${id}`, [lang]);

  /**
   * Loads the list of "search" session items.
   */
  const onLoad = useCallback(() => {
    fetchSession('search', { exclude: 'data' })
      .then((data) => setItems(data?.reverse()));
  }, []);

  /**
   * Deletes the session item with the passed ID.
   */
  const onDelete = useCallback((id: string) => {
    deleteSessionItem('search', id)
      .then(onLoad);
  }, [onLoad]);

  /**
   * Deletes all of the search session items.
   */
  const onDeleteAll = useCallback(() => {
    deleteSession('search')
      .then(onLoad);
  }, []);

  /**
   * Copies the URL for the passed session item to the user's clipboard.
   */
  const onShare = useCallback((id: string) => {
    const url = getUrl(id);
    const params = new URLSearchParams({ sessionId: getSessionId() });

    // Copy the text to the clipboard
    const text = `${window.location.origin}${url}?${params.toString()}`;
    navigator.clipboard.writeText(text);

    // Display the notification
    NotificationsStore.set({
      content: t('clipboardCopyContent'),
      header: t('clipboardCopyHeader'),
      open: true
    });
  }, [getUrl, t]);

  /**
   * Loads the list of items when the component is mounted.
   */
  useEffect(() => onLoad(), []);

  return (
    <>
      <div
        className='flex justify-between w-full'
      >
        <h1
          className='text-2xl font-bold m-0'
        >
          { t('savedSearches') }
        </h1>
        <Button
          className='bg-red-700 text-white font-bold'
          onClick={onDeleteAll}
          rounded
        >
          { t('clearAll') }
        </Button>
      </div>
      <ul
        className='divide-y divide-gray-100'
        role='list'
      >
        { _.map(items, (item) => (
          <SearchListItem
            created={item.created}
            key={item.id}
            name={item.name}
            onDelete={() => onDelete(item.id)}
            onShare={() => onShare(item.id)}
            searchName={t(`index_${item.searchName}`)}
            url={getUrl(item.id)}
          />
        ))}
      </ul>
    </>
  );
};

export default SearchList;