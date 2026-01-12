import Hits from '@apps/search/list/Hits';
import { SearchBox } from 'react-instantsearch';
import Facets from '@apps/search/Facets';
import { useSearchConfig } from '@apps/search/SearchConfigContext';
import Pagination from '@apps/search/list/Pagination';
import { useContext } from 'react';
import TranslationContext from '@contexts/TranslationContext';
import SortBy from '@apps/search/list/SortBy';
import Stats from '@apps/search/list/Stats';

interface Props {
  lang: string;
}

const ListLayout = (props: Props) => {
  const config = useSearchConfig();

  const { t } = useContext(TranslationContext);

  return (
    <>
      <div className='w-full p-4 uppercase flex justify-between items-center flex-wrap'>
        <h1 className='uppercase first-letter:text-4xl text-2xl'>{t(config.name)}</h1>
        <SearchBox
          placeholder={t('search')}
          classNames={{
            root: 'p-4 w-full max-w-[720px]',
            form: 'relative',
            input: 'rounded-lg border border-gray-300 bg-white py-2 pl-12 pr-10 text-md w-full placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
            submit: 'absolute inset-y-4 left-4 flex items-center',
            submitIcon: 'w-4 h-4',
            reset: 'absolute inset-y-0 right-4 flex items-center',
            resetIcon: 'w-3 h-3',
            loadingIndicator: 'absolute inset-y-7 left-3 flex items-center',
            loadingIcon: 'w-4 h-4'
          }}
        />
      </div>
      <div className='flex'>
        <div className='w-[300px]'>
          <Facets
            className='px-6 py-0'
            config={config}
            open
          />
        </div>
        <div className='flex-1 p-6'>
          <div className='flex justify-between items-center mb-4'>
            <Stats />
            <SortBy />
          </div>
          <Hits lang={props.lang} />
          <Pagination />
        </div>
      </div>
    </>
  );
};

export default ListLayout;
