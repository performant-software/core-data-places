import { useSearchBox } from '@performant-software/core-data';
import { Search, X } from 'lucide-react';
import { type FormEvent, useCallback, useRef } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config.mjs';

const SearchBox = () => {
  const { query, refine } = useSearchBox();

  // const { theme } = resolveConfig(tailwindConfig);
  // const color = theme.colors.gray['1000'];
  const color = '#505A6A';

  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Prevents the page from being refreshed if the user presses enter.
   */
  const onSubmit = useCallback((evt: FormEvent) => evt.preventDefault(), []);

  /**
   * Clears the current query and focuses on the input element.
   */
  const onClear = useCallback(() => {
    refine('');

    const instance = inputRef.current;
    if (instance) {
      instance.focus();
    }
  }, []);

  return (
    <form
      className='flex-grow'
      onSubmit={onSubmit}
    >
      <div
        className='relative rounded-full bg-gray-100 flex justify-between items-center p-3'
      >
        <Search
          className='w-4'
          color={color}
        />
        <input
          className='text-sm bg-transparent flex-grow mx-2 text-gray-1000 outline-none border-0 focus:ring-0'
          onChange={(e) => refine(e.target.value)}
          placeholder='Search'
          ref={inputRef}
          spellCheck={false}
          value={query}
        />
        <X
          className='w-4 cursor-pointer'
          color={color}
          onClick={onClear}
        />
      </div>
    </form>
  );
};

export default SearchBox;
