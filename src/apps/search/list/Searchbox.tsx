import { SearchBox } from 'react-instantsearch';
import { useContext } from 'react';
import TranslationContext from '@contexts/TranslationContext';

const Searchbox = () => {
  const { t } = useContext(TranslationContext);

  return (
    <SearchBox
      placeholder={t('search')}
      classNames={{
        root: 'p-4',
        form: 'relative',
        input: 'block w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
        submit: 'absolute inset-y-0 right-0 flex items-center pr-3',
        reset: 'absolute inset-y-0 right-8 flex items-center',
        loadingIndicator: 'absolute inset-y-0 right-16 flex items-center'
      }}
    />
  );
}

export default Searchbox;
