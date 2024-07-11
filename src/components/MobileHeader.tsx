import { Disclosure, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface MobileHeaderProps {
  sections: string[]
}

const MobileHeader = (props: MobileHeaderProps) => {
  return (
    <Disclosure as="div" className="md:hidden w-full bg-white shadow-md z-10">
      {({ open }) => (
        <>
          <div className='flex flex-row justify-between px-6 mx-0 sm:px-0 sm:mx-12 md:mx-16 lg:mx-32 2xl:mx-auto max-w-screen-xl py-8 z-10 top-0'>
            <a href='/'>Home</a>
            <Disclosure.Button className=" md:hidden relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-primary">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              {open ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </Disclosure.Button>
          </div>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="md:hidden bg-white">
              <div className="space-y-1 pb-3 pt-2">
                {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
                {props.sections.map((sect, idx) => (
                  <Disclosure.Button
                    key={idx}
                    as="a"
                    href={`/${sect.toLowerCase()}`}
                    className="block bg-white hover:bg-orange-primary/10 py-4 text-base text-center font-bold"
                  >
                    {sect}
                  </Disclosure.Button>
                )
                )}
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  )
};

export default MobileHeader;
