import { Icon } from '@performant-software/core-data/ssr';

interface SearchBarProps {
  button_text?: string;
  placeholder?: string;
  url: string;
}

const SearchBar = (props: SearchBarProps) => {
  const { button_text, placeholder, url } = props;
  return (
    <div className='not-prose w-[840px] border rounded-md border-black text-sm'>
      <form
        id='search-bar'
        data-url={url}
        className='relative flex flex-row items-center'
      >
        <input
          className='py-4 pe-4 ps-13 w-[720px] h-full rounded-l-md'
          type='text'
          name='query'
          placeholder={placeholder}
        />
        <Icon name='search' size={20} className='absolute left-4' />
        <button
          type='submit'
          name='submit'
          className='w-30 h-full bg-black rounded-r-md py-4 px-6 flex justify-center items-center font-semibold text-white'
        >
          {button_text}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
