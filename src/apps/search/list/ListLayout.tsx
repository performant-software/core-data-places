import Hits from '@apps/search/list/Hits';
import { SearchBox } from 'react-instantsearch';
import Facets from '@apps/search/Facets';
import { useSearchConfig } from '@apps/search/SearchConfigContext';
import Pagination from '@apps/search/list/Pagination';
import { useContext, useEffect, useState } from 'react';
import TranslationContext from '@contexts/TranslationContext';
import SortBy from '@apps/search/list/SortBy';
import Stats from '@apps/search/list/Stats';
import FilterButton from '@apps/search/map/FilterButton';

interface Props {
  lang: string;
}

const MEDIUM_SCREEN_SIZE = 768;

const ListLayout = (props: Props) => {
  const [filters, setFilters] = useState<boolean>(true)
  const config = useSearchConfig();

  const { t } = useContext(TranslationContext);

  useEffect(() => {
    if (window.innerWidth < MEDIUM_SCREEN_SIZE) {
      setFilters(false);
    } else {
      setFilters(true);
    }
  }, [window.innerWidth]);

  return (
    <div className='px-6 md:px-8 lg:px-12'>
      <div className='w-full py-4 gap-4 flex justify-between items-center flex-wrap border-b border-neutral-200'>
        <h2>{t(`index_${config.name}`)}</h2>
        <div className='flex justify-between gap-4'>
          <SearchBox
            placeholder={t('search')}
            classNames={{
              root: 'w-full max-w-[720px]',
              form: 'relative',
              input: 'rounded-[5px] border border-neutral-200 bg-white py-2 pl-12 pr-10 text-md w-full placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
              submit: 'absolute inset-y-4 left-4 flex items-center',
              submitIcon: 'w-4 h-4',
              reset: 'absolute inset-y-0 right-4 flex items-center',
              resetIcon: 'w-3 h-3',
              loadingIndicator: 'absolute inset-y-7 left-3 flex items-center',
              loadingIcon: 'w-4 h-4'
            }}
          />
          <FilterButton
            allowSearchChange={true}
            classNames='md:hidden'
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
      </div>
      <div className='flex gap-x-8 lg:gap-x-12'>
        <div className='absolute left-0 md:relative h-full w-full md:w-[200px] xl:w-[300px]'>
          <Facets
            className='py-0 px-6 md:px-0 bg-neutral-100 md:bg-none h-full'
            config={config}
            open={filters}
          />
        </div>
        <div className='flex-1 pb-6'>
          <div className='flex flex-col md:flex-row gap-y-4 justify-between items-center py-5'>
            <Stats />
            <SortBy />
          </div>
          <Hits lang={props.lang} />
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default ListLayout;
