import TranslationContext from '@contexts/TranslationContext';
import { Button, Icon } from '@performant-software/core-data';
import { useContext } from 'react';

interface Props {
  created: string;
  name: string;
  onDelete(id: string): void;
  onShare(id: string): void;
  searchName: string;
  url: string;
}

const SearchListItem = (props: Props) => {
  const { t } = useContext(TranslationContext);

  return (
    <li
      className='flex items-center justify-between gap-x-6 py-5'
    >
      <div className='min-w-0'>
        <div className='flex items-start gap-x-3'>
          <p className='text-sm/6 font-semibold text-gray-900'>
            { props.name }
          </p>
        </div>
        <div className='mt-1 flex items-center text-xs/5 text-gray-500'>
          <p className="truncate">
            { props.searchName }
          </p>
          <Icon
            name='bullet'
          />
          <p className='whitespace-nowrap'>
            { t('createdOn', { date: props.created }) }
          </p>
        </div>
      </div>
      <div className='flex flex-none items-center gap-x-4'>
        <a
          href={props.url}
          className='rounded-md bg-white py-2 px-4 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:block'
        >
          { t('view') }
        </a>
        <Button
          className='border-transparent px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:block'
          onClick={props.onDelete}
          rounded
        >
          { t('remove') }
        </Button>
        <Button
          className='border-transparent px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:block'
          onClick={props.onShare}
          rounded
        >
          { t('share') }
        </Button>
      </div>
    </li>
  );
};

export default SearchListItem;