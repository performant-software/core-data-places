import { getLanguageFromUrl } from '@i18n/utils';
import { Icon } from '@performant-software/core-data/ssr';
import { useCallback, useMemo, useState } from 'react';

interface SearchBarProps {
  buttonText?: string;
  placeholder?: string;
  searchName: string;
}

const SearchBar = (props: SearchBarProps) => {
  const { buttonText, placeholder, searchName } = props;
  const [query, setQuery] = useState('');

 const language = useMemo(() => getLanguageFromUrl(window.location.pathname), [window.location.pathname]);

  const onSubmit = useCallback((e: any) => {
    e.preventDefault();
    if (query) {
      window.location.href = `/${language}/search/${searchName}?q=${query}`;
    }
  }, [searchName, query, language]);

  return (
    <div className='not-prose w-full lg:w-[840px] border rounded-md border-black text-sm mb-4'>
      <form
        id='search-bar'
        className='relative flex flex-row items-center'
        onSubmit={onSubmit}
      >
        <input
          className='py-4 pe-4 ps-13 w-full lg:w-[720px] h-full rounded-l-md bg-white text-black'
          type='text'
          name='query'
          placeholder={placeholder}
          value={query}
          onChange={(e: any) => { setQuery(e.target.value); }}
        />
        <Icon name='search' size={20} className='absolute left-4 text-gray-400' />
        <button
          type='submit'
          name='submit'
          className='w-30 h-full bg-secondary rounded-r-md py-4 px-6 flex justify-center items-center font-semibold text-inherit hover:bg-[linear-gradient(rgba(0,0,0,0.15),rgba(0,0,0,0.15))] transition duration-300'
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
