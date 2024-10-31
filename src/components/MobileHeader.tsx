import { Disclosure, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import _ from 'underscore';
import { useTranslations } from '../i18n/client';
import LanguagePicker from './LanguagePicker';

interface Props {
  currentLocale: string;
  currentUrl: string;
  locales: string[];
  tabs: {
    [key: string]: {
      key: string,
      url: string
    }
  };
}

const MobileHeader = (props: Props) => {
  const { t } = useTranslations();

  return (
    <Disclosure 
      as='div' 
      className='md:hidden w-full bg-white shadow-md z-10'
    >
      {({ open }) => (
        <>
          <div
            className='flex flex-row justify-between items-center px-6 mx-0 sm:px-0 sm:mx-12 md:mx-16 lg:mx-32 2xl:mx-auto max-w-screen-xl py-4 z-10 top-0'
          >
            <a
              href='/'
            >
              { t('home') }
            </a>
            <LanguagePicker
              locales={props.locales}
              currentLocale={props.currentLocale}
              currentUrl={props.currentUrl}
            />
            <Disclosure.Button
              className=' md:hidden relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-primary'
            >
              <span
                className='absolute -inset-0.5'
              />
              <span
                className='sr-only'
              >
                { t('openMainMenu') }
              </span>
              { open && (
                <XMarkIcon
                  aria-hidden='true'
                  className='block h-6 w-6'
                />
              )}
              { !open && (
                <Bars3Icon
                  aria-hidden='true'
                  className='block h-6 w-6'
                />
              )}
            </Disclosure.Button>
          </div>
          <Transition
            enter='transition duration-100 ease-out'
            enterFrom='transform scale-95 opacity-0'
            enterTo='transform scale-100 opacity-100'
            leave='transition duration-75 ease-out'
            leaveFrom='transform scale-100 opacity-100'
            leaveTo='transform scale-95 opacity-0'
          >
            <Disclosure.Panel
              className='md:hidden bg-white'
            >
              <div
                className='space-y-1 pb-3 pt-2'
              >
                { _.map(_.keys(props.tabs), (key) => (
                  <Disclosure.Button
                    as='a'
                    className='block bg-white hover:bg-orange-primary/10 py-4 text-base text-center font-bold'
                    href={props.tabs[key].url}
                    key={key}
                  >
                    { t(key) }
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default MobileHeader;
