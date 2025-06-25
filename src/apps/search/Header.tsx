import ExportButton from '@apps/search/ExportButton';
import SaveButton from '@apps/search/SaveButton';
import { useSearchConfig } from '@apps/search/SearchContext';
import { useTranslations } from '@i18n/useTranslations';
import {
  Button,
  ButtonGroup,
  Icon,
  Input,
  useSearchBox
} from '@performant-software/core-data';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useCurrentRefinements } from 'react-instantsearch';
import _ from 'underscore';

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
  const config = useSearchConfig();
  const { items } = useCurrentRefinements();
  const { query, refine } = useSearchBox();
  const { t } = useTranslations();

  /**
   * Memo-izes the number of value values applied.
   */
  const facetCount = useMemo(() => _.reduce(items, (memo, item) => memo + item.refinements.length, 0), [items]);

  return (
    <div
      className={clsx('bg-neutral-100 flex items-center justify-between px-6 py-5 shadow-sm', props.className)}
    >
      <div
        className='flex items-center gap-x-12 w-3/4'
      >
        <div
          className='flex items-center'
        >
          <Button
            className='relative'
            icon
            onClick={() => props.onFiltersChange(!props.filters)}
            secondary={props.filters}
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
          <h2
            className='text-xl font-bold text-nowrap px-3'
          >
            { t(`index_${config.name}`) || t('root') }
          </h2>
        </div>
        <div
          className='grow'
        >
          <Input
            className='bg-white'
            clearable
            icon='search'
            onChange={(value) => refine(value)}
            placeholder={'Search'}
            value={query}
          />
        </div>
        { tableView && (
          <ButtonGroup
            rounded
          >
            <Button
              onClick={() => props.onViewChange(Views.list)}
              secondary={props.view === Views.list}
            >
              <Icon
                name='list'
              />
              { t('list') }
            </Button>
            <Button
              disabled={props.timeline}
              onClick={() => props.onViewChange(Views.table)}
              secondary={props.view === Views.table}
            >
              <Icon
                name='table'
              />
              { t('table') }
            </Button>
          </ButtonGroup>
        )}
        { config.timeline?.date_range_facet && (
          <div
            className='flex items-center gap-x-2'
          >
            <Button
              className='px-3 py-3'
              disabled={props.view === Views.table}
              icon
              onClick={() => props.onTimelineChange(!props.timeline)}
              secondary={props.timeline}
            >
              <Icon
                name='timeline'
              />
            </Button>
          </div>
        )}
      </div>
      <div
        className='flex gap-x-2'
      >
        <ExportButton />
        <SaveButton />
      </div>
    </div>
  );
};

export default Header;

export {
  Views
};