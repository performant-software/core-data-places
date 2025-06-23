import SearchListItem from '@apps/session/SearchListItem';
import { deleteSessionItem, deleteSession, fetchSession } from '@backend/api/session';
import TranslationContext from '@contexts/TranslationContext';
import { Button } from '@performant-software/core-data';
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
   * Loads the list of items whem the component is mounted.
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
          className='bg-red-400 text-white font-bold'
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
            searchName={t(`index_${item.searchName}`)}
            url={`/${lang}/sessions/search/${item.id}`}
          />
        ))}
      </ul>
    </>

  );
};

export default SearchList;