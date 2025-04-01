import ExportButton from '@apps/search/ExportButton';
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
  onViewChange: (view: string) => void;
  view?: string;
}

const Views = {
  list: 'list',
  table: 'table'
};

const Header = (props: Props) => {
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
      className={clsx('bg-neutral-100 flex items-center justify-between px-6 py-5 shadow', props.className)}
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
          <h2
            className='text-xl font-bold text-nowrap px-3'
          >
            { t(`index_${config.name}`) || t('root') }
          </h2>
        </div>
        <div
          className='flex-grow'
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
        <ButtonGroup
          rounded
        >
          <Button
            className='text-smd'
            primary={props.view === Views.list}
            onClick={() => props.onViewChange(Views.list)}
          >
            <Icon
              name='list'
            />
            { t('list') }
          </Button>
          <Button
            className='text-smd'
            primary={props.view === Views.table}
            onClick={() => props.onViewChange(Views.table)}
          >
            <Icon
              name='table'
            />
            { t('table') }
          </Button>
        </ButtonGroup>
      {/* Commenting out this functionality for now, as we do not have a timeline component. */}
      {/*  <div*/}
      {/*    className='flex items-center gap-x-2'*/}
      {/*  >*/}
      {/*    <Button*/}
      {/*      icon*/}
      {/*    >*/}
      {/*      <Icon*/}
      {/*        name='location'*/}
      {/*      />*/}
      {/*    </Button>*/}
      {/*    <Button*/}
      {/*      icon*/}
      {/*    >*/}
      {/*      <Icon*/}
      {/*        name='timeline'*/}
      {/*      />*/}
      {/*    </Button>*/}
      {/*  </div>*/}
      </div>
      <ExportButton />
    </div>
  );
};

export default Header;

export {
  Views
};