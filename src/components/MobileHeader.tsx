import { Disclosure, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslations } from '@i18n/useTranslations';
import { ReactNode } from 'react';
import _ from 'underscore';

interface NavItem {
  label: string;
  href?: string;
  options?: Array<{
    href: string;
    label: string;
  }>
}

interface Props {
  children?: ReactNode;
  items: NavItem[];
  title: string;
}

const MobileHeader = (props: Props) => {
  const { t } = useTranslations();

  return (
    <Disclosure 
      as='div' 
      className='block lg:hidden w-full bg-primary shadow-md z-10'
    >
      {({ open }) => (
        <>
          <div
            className='flex flex-row justify-between items-center px-6 mx-0 sm:px-0 sm:mx-12 md:mx-16 lg:mx-32 2xl:mx-auto max-w-(--breakpoint-xl) py-4 z-10 top-0'
          >
            <a
              href='/'
            >
              { props.title }
            </a>
            { props.children }
            <Disclosure.Button
              className='lg:hidden relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-orange-primary'
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
              className='lg:hidden bg-primary'
            >
              <div
                className='flex flex-col items-center space-y-1 pb-3 pt-2'
              >
                { _.map(props.items, (item) => (
                  <>
                    { item.options && (
                      <Disclosure.Button
                        className='block bg-primary hover:bg-white hover:text-black py-4 text-base text-center font-thin'
                      >
                        { item.label }
                        <div
                          className='flex flex-col gap-y-4 py-3'
                        >
                          { _.map(item.options, (option) => (
                            <a
                              className='font-bold'
                              href={option.href}
                            >
                              { option.label }
                            </a>
                          ))}
                        </div>
                      </Disclosure.Button>
                    )}
                    { item.href && (
                      <Disclosure.Button
                        as='a'
                        className='block bg-primary hover:bg-white hover:text-black py-4 text-base text-center font-bold'
                        href={item.href}
                      >
                        { item.label }
                      </Disclosure.Button>
                    )}
                  </>
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
