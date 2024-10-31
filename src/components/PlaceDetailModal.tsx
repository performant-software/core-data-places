import { Dialog, Transition } from '@headlessui/react';
import { CoreDataContextProvider, PlaceDetails } from '@performant-software/core-data';
import { Fragment } from 'react';
import config from '../../public/config.json';

interface Props {
  onClose(): void;
  open: boolean;
  placeId: string;
}

const PlaceDetailModal = (props: Props) => (
  <Transition
    appear
    as={Fragment}
    show={props.open}
  >
    <Dialog
      as='div'
      className='relative z-10'
      onClose={props.onClose}
    >
      <Transition.Child
        as={Fragment}
        enter='ease-out duration-300'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='ease-in duration-200'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        <div
          className='fixed inset-0 bg-black/25'
        />
      </Transition.Child>
      <div
        className='fixed inset-0 overflow-y-auto'
      >
        <div
          className='flex min-h-full items-center justify-center p-4 text-center'
        >
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <Dialog.Panel
              className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all'
            >
              <CoreDataContextProvider
                baseUrl={config.core_data.url}
                projectIds={config.core_data.project_ids}
              >
                <PlaceDetails
                  id={props.placeId}
                />
              </CoreDataContextProvider>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);

export default PlaceDetailModal;
