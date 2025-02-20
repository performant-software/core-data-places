import { useTranslations } from '@i18n/client';
import {
  Button,
  ButtonGroup,
  Icon,
  Input,
  useSearchBox
} from '@performant-software/core-data';
import clsx from 'clsx';

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
  const { query, refine } = useSearchBox();
  const { t } = useTranslations();

  return (
    <div
      className={clsx('bg-neutral-100 flex items-center justify-between px-6 py-5 shadow', props.className)}
    >
      <div
        className='flex items-center gap-x-10 w-3/4'
      >
        <div
          className='flex items-center'
        >
          <Button
            icon
            onClick={() => props.onFiltersChange(!props.filters)}
            primary={props.filters}
          >
            <Icon
              name='filters'
            />
          </Button>
          <h2
            className='text-xl font-semibold text-nowrap px-2'
          >
            { t('root') }
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
            primary={props.view === Views.list}
            onClick={() => props.onViewChange(Views.list)}
          >
            <Icon
              name='list'
            />
            { t('list') }
          </Button>
          <Button
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
      {/* Commenting out this functionality for now, as we do not have details on the export functionality. */}
      {/*<Button*/}
      {/*  primary*/}
      {/*  rounded*/}
      {/*>*/}
      {/*  <Icon*/}
      {/*    name='export'*/}
      {/*  />*/}
      {/*  Export*/}
      {/*</Button>*/}
    </div>
  );
};

export default Header;

export {
  Views
};