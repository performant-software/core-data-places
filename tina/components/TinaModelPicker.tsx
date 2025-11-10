import Loader from '@components/Loader';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions
} from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import {
  ReactNode,
  useCallback,
  useEffect,
  useState
} from 'react';
import _ from 'underscore';

interface Item {
  name: string;
  uuid: string;
}

interface TinaModelPickerProps {
  children: ReactNode;
  message?: string;
  onLoad: (params: any) => Promise<any>;
  onChange: (item: Item) => void;
  value: Item;
}

const TinaModelPicker = (props: TinaModelPickerProps) => {
  const [items, setItems] = useState<Array<Item>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const onLoad = useCallback(() => {
    setLoading(true);

    props
      .onLoad({ search, per_page: 25 })
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, [search]);

  useEffect(() => onLoad(), []);

  useEffect(() => {
    const delayed = setTimeout(onLoad, 1000);
    return () => clearTimeout(delayed);
  }, [search]);

  return (
    <div>
      <Combobox
        by='uuid'
        immediate
        onChange={props.onChange}
        value={props.value}
      >
        <div
          className='z-[9999] relative'
        >
          <div
            className='relative mt-2'
          >

            <ComboboxInput
              className='w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              displayValue={(item: Item) => item?.name}
              onChange={(event) => setSearch(event.target.value)}
              placeholder='Type to Search'
            />
            <div
              className='absolute inset-y-0 right-0 flex items-center'
            >
              <Loader
                active={loading}
              />
              <ComboboxButton
                className='rounded-r-md px-2 focus:outline-none'
              >
                <ChevronUpDownIcon
                  aria-hidden='true'
                  className='h-5 w-5 text-gray-400'
                />
              </ComboboxButton>
              { !_.isEmpty(props.value) && (
                <button
                  className='rounded-r-md px-2 focus:outline-none'
                  onClick={() => props.onChange(null)}
                  type='button'
                >
                  <XMarkIcon
                    aria-hidden='true'
                    className='h-5 w-5 text-gray-400'
                  />
                </button>
              )}
            </div>
            { !_.isEmpty(items) && (
              <ComboboxOptions
                className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'
              >
                { _.map(items, (item) => (
                  <ComboboxOption
                    className={({ focus }) =>
                      clsx(
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                        { 'bg-indigo-600 text-white': focus },
                        { 'text-gray-900': !focus }
                      )
                    }
                    key={item.uuid}
                    value={item}
                  >
                    {({ focus, selected }) => (
                      <>
                        <span
                          className={clsx(
                            'block truncate',
                            { 'font-semibold': selected }
                          )}
                        >
                          { item.name }
                        </span>
                        { selected && (
                          <span
                            className={clsx(
                              'absolute inset-y-0 right-0 flex items-center pr-4',
                              { 'text-white': focus },
                              { 'text-indigo-600': !focus }
                            )}
                          >
                            <CheckIcon
                              aria-hidden='true'
                              className='h-5 w-5'
                            />
                          </span>
                        )}
                      </>
                    )}
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            )}
          </div>
        </div>
      </Combobox>
      { props.message && (
        <p
          className='h-4 w-full text-red-600'
        >
          { props.message }
        </p>
      )}
      { props.children }
    </div>
  );
};

export default TinaModelPicker;
