import { useContext, useMemo } from 'react';
import TranslationContext from '@contexts/TranslationContext';
import { useSortBy } from 'react-instantsearch';
import { useSearchConfig } from '@apps/search/SearchConfigContext';
import { DropdownMenu } from 'radix-ui';
import { Icon } from '@performant-software/core-data';

const SortBy = () => {
  const { t } = useContext(TranslationContext);
  const config = useSearchConfig();

  const sortFields = useMemo(() => {
    const base = [{
      label: t('A-Z'),
      value: `${config.typesense.index_name}/sort/name:asc`
    }, {
      label: t('Z-A'),
      value: `${config.typesense.index_name}/sort/name:desc`
    }]

    // only enable relevance sort if no default sort is set
    if (!config.typesense.default_sort) {
      base.unshift({
        label: t('relevance'),
        value: config.typesense.index_name
      });
    }

    return base;
  }, [t]);

  const { currentRefinement, refine } = useSortBy({ items: sortFields });

  const currentSort = useMemo(() => {
    let result: { label: any; value: string; };

    // When the sort_by option is passed to the Typesense adapter, the InstantSearch UI
    // state doesn't know about it and will assume that we're sorting by relevance on page
    // load. This `if` clause handles that situation by treating the relevance sort UI state
    // as the default sort.
    if (config.typesense.default_sort && currentRefinement === config.typesense.index_name) {
      result = sortFields.find((field) => field.value === `${config.typesense.index_name}/sort/${config.typesense.default_sort}:asc`);
    } else {
      result = sortFields.find((field) => field.value === currentRefinement);
    }

    return result;
  }, [currentRefinement, sortFields]);

  return (
    <div className='flex w-full items-center justify-end gap-4 pr-4'>
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
