import TranslationContext from '@contexts/TranslationContext';
import { Listbox, Transition } from '@headlessui/react';
import { Button, Icon, useCachedHits } from '@performant-software/core-data';
import { exportAsJSON } from '@utils/search';
import { Fragment, useCallback, useContext } from 'react';
import { useSearchConfig } from "@apps/search/SearchConfigContext";

const Options = {
  json: 'json'
};

const ExportButton = () => {
  const { name } = useSearchConfig();
  const hits = useCachedHits();
  const { t } = useContext(TranslationContext);

  /**
   * Exports the current search results in the passed format.
   */
  const onSelection = useCallback((option) => {
    if (option === Options.json) {
      exportAsJSON({ name, data: hits });
    }
  }, [hits, name]);

  return (
    <Listbox
      onChange={onSelection}
    >
      <div
        className='relative'
      >
        <Listbox.Button
          as={Button}
          className='relative w-full rounded-lg text-left text-sm'
          secondary
        >
          <Icon
            name='export'
          />
          { t('export') }
          <Icon
            name='down'
          />
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <Listbox.Options
            className={`
              absolute 
              mt-1 
              max-h-60 
              w-full 
              overflow-auto 
              rounded-md 
              bg-white 
              py-1 
              text-base 
              shadow-lg 
              ring-1 
              ring-black/5 
              focus:outline-hidden 
              sm:text-sm 
              z-10 
              text-black
            `}
          >
            <Listbox.Option
              className='relative cursor-pointer select-none py-2 px-4 data-active:bg-gray-100'
              value={Options.json}
            >
              { t('json') }
            </Listbox.Option>
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default ExportButton;