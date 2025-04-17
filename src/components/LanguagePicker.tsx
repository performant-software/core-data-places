import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Fragment, useMemo } from 'react';

interface Props {
  locales: string[];
  currentLocale: string;
  currentUrl: string;
}

const LanguagePicker = (props: Props) => {
  const { locales, currentLocale } = props;

  const value = useMemo(() => `/${currentLocale}/`, [currentLocale]);

  if (locales.length <= 1) {
    return null;
  }

  return (
    <Listbox
      value={value}
    >
      <div
        className='relative -mb-2'
      >
        <Listbox.Button
          className='relative w-full cursor-default rounded-lg pr-7 text-left sm:text-sm'
        >
          <span
            className='block truncate border border-gray-400 py-2 px-3 mr-2'
          >
            { currentLocale.toUpperCase() }
          </span>
          <span
            className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'
          >
            <ChevronDownIcon
              className='h-5 w-5 text-gray-400'
              aria-hidden='true'
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <Listbox.Options
            className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm z-10 text-black'
          >
            { locales.map((locale, idx) => (
              <Listbox.Option
                key={idx}
                className={(({ active } ) => clsx(
                  'relative',
                  'cursor-pointer',
                  'select-none',
                  'py-2',
                  'px-4',
                  { 'bg-gray-100': active }
                ))}
                value={locale}
              >
                <a
                  href={locale}
                >
                  <span className='block truncate'>
                    { locale.replaceAll('/','').toUpperCase() }
                  </span>
                </a>
            </Listbox.Option>
          ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default LanguagePicker;
