import ExportButton from '@apps/search/ExportButton';
import SaveButton from '@apps/search/SaveButton';
import SearchContext, { useSearchConfig } from '@apps/search/SearchContext';
import { useTranslations } from '@i18n/useTranslations';
import {
  Button,
  ButtonGroup,
  Icon,
  Input,
  useSearchBox
} from '@performant-software/core-data';
import clsx from 'clsx';
import { useContext, useMemo } from 'react';
import { useCurrentRefinements } from 'react-instantsearch';
import _ from 'underscore';
import { useSearching } from '@performant-software/core-data';

interface Props {
  className?: string;
  filters?: boolean;
  onFiltersChange: (filters: boolean) => void;
  onTimelineChange: (timeline: boolean) => void;
  onViewChange: (view: string) => void;
  timeline?: boolean;
  view?: string;
  tableView?: boolean;
}

const Views = {
  list: 'list',
  table: 'table'
};

const Header = (props: Props) => {
  const { tableView = true } = props;
  const { allowSave } = useContext(SearchContext);
  const config = useSearchConfig();
  const { items } = useCurrentRefinements();
  const { query, refine } = useSearchBox();
  const { t } = useTranslations();

  const isSearching = useSearching();

  /**
   * Disables the search input and facet button while the search is loading.
   */
  const allowSearchChange = useMemo(() => !isSearching || query, [isSearching, query]);

  /**
   * Memo-izes the number of values applied.
   */
  const facetCount = useMemo(() => _.reduce(items, (memo, item) => memo + item.refinements.length, 0), [items]);

  return (
    <div
      className={clsx('bg-neutral-100 flex items-center justify-between px-6 shadow-sm', props.className)}
    >
      <h2
        className='text-2xl font-bold text-nowrap'
      >
        { t(`index_${config.name}`) || t('root') }
      </h2>
      <div
        className='flex items-center gap-x-4 w-3/6'
      >
        <Input
          className='bg-white grow'
          clearable
          disabled={!allowSearchChange}
          icon='search'
          onChange={(value) => refine(value)}
          placeholder={t('search')}
          value={query}
        />
        <Button
          className='relative'
          disabled={!allowSearchChange}
          icon
          onClick={() => props.onFiltersChange(!props.filters)}
          primary={props.filters}
        >
          <Icon
            name='filters'
            size={24}
          />
          { facetCount > 0 && (
            <div
              className={`
                  absolute
                  flex
                  items-center
                  justify-center
                  -top-1
                  -right-2
                  w-[20px]
                  h-[20px]
                  bg-red-600
                  text-white
                  text-xs
                  rounded-full
                `}
            >
              { facetCount }
            </div>
          )}
        </Button>
        { allowSave && (
          <SaveButton />
        )}
      </div>
      <div
        className='flex items-stretch'
      >
        { tableView && (
          <ButtonGroup
            className='text-sm'
            icon
          >
            <Button
              onClick={() => props.onViewChange(Views.list)}
              primary={props.view === Views.list}
            >
              <Icon
                name='list'
              />
              { t('list') }
            </Button>
            <Button
              disabled={props.timeline}
              onClick={() => props.onViewChange(Views.table)}
              primary={props.view === Views.table}
            >
              <Icon
                name='table'
              />
              { t('table') }
            </Button>
          </ButtonGroup>
        )}
        <div
          className='w-[1px] bg-neutral-300 mx-4'
        />
        { config.timeline?.date_range_facet && (
          <Button
            className='text-sm px-3'
            disabled={props.view === Views.table}
            icon
            onClick={() => props.onTimelineChange(!props.timeline)}
            primary={props.timeline}
          >
            <Icon
              name='timeline'
            />
            { t('timeline') }
          </Button>
        )}
      </div>
      <ExportButton />
    </div>
  );
};

export default Header;

export {
  Views
};