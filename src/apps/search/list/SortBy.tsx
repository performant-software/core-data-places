import { useContext, useMemo } from 'react';
import TranslationContext from '@contexts/TranslationContext';
import { useSortBy } from 'react-instantsearch';
import { useSearchConfig } from '@apps/search/SearchConfigContext';
import { useStaticSearch } from '@apps/search/StaticSearchContext';
import type { SearchConfig } from '@types';
import { getSortings } from '@utils/staticSearch';
import { DropdownMenu } from 'radix-ui';
import { Icon } from '@performant-software/core-data';

const SortBy = () => {
  const { t } = useContext(TranslationContext);
  const config = useSearchConfig();
  const staticSearch = useStaticSearch();

  const sortFields = useMemo(() => {
    // A static search sorts via the ItemsJS `sortings` keys rather than Typesense replicas.
    if (config.static) {
      return [{
        label: t('relevance'),
        value: config.name
      }, ...getSortings(staticSearch?.options, t)];
    }

    const typesense = config.typesense as SearchConfig['typesense'] & object;

    const base = [{
      label: t('A-Z'),
      value: `${typesense.index_name}/sort/name:asc`
    }, {
      label: t('Z-A'),
      value: `${typesense.index_name}/sort/name:desc`
    }]

    // only enable relevance sort if no default sort is set
    if (!typesense.default_sort) {
      base.unshift({
        label: t('relevance'),
        value: typesense.index_name
      });
    }

    return base;
  }, [config, staticSearch, t]);

  const { currentRefinement, refine } = useSortBy({ items: sortFields });

  const currentSort = useMemo(() => {
    let result: { label: any; value: string; };

    // When the sort_by option is passed to the Typesense adapter, the InstantSearch UI
    // state doesn't know about it and will assume that we're sorting by relevance on page
    // load. This `if` clause handles that situation by treating the relevance sort UI state
    // as the default sort.
    const { typesense } = config;

    if (typesense?.default_sort && currentRefinement === typesense.index_name) {
      result = sortFields.find((field) => field.value === `${typesense.index_name}/sort/${typesense.default_sort}:asc`);
    } else {
      result = sortFields.find((field) => field.value === currentRefinement);
    }

    return result;
  }, [config, currentRefinement, sortFields]);

  return (
    <div className='flex w-full items-center justify-center md:justify-end gap-4 pr-4'>
      <span className='font-bold'>
        { t('sortBy') }
      </span>
      <DropdownMenu.Root
        modal={false}
      >
        <DropdownMenu.Trigger
          asChild
        >
          <div
            className='flex items-center gap-x-2 cursor-pointer outline-hidden hover:bg-transparent'
          >
            {currentSort?.label}
            <Icon
              name='down'
            />
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className='flex flex-col bg-white rounded-md shadow-lg pt-1 w-[150px]'
          >
            {sortFields.map((field) => (
              <DropdownMenu.Item
                className='hover:cursor-pointer hover:bg-neutral-200 px-2 py-1 outline-hidden'
                onClick={() => refine(field.value)}
                key={field.value}
              >
                { field.label }
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

export default SortBy;
