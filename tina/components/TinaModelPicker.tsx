import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { ReactNode, useEffect, useState } from 'react'

interface TinaModelPickerProps {
  field: any,
  input: any,
  meta: any,
  getValue: (_item: any) => any,
  children: ReactNode,
  onLoad: () => Promise<any>,
  onSelectItem?: (_item: any) => void,
  message?: string
}
const TinaModelPicker = (props: TinaModelPickerProps) => {
  const [items, setItems] = useState<any>();
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<any>();
  const [selectedItem, setSelectedItem] = useState<any>();
  const [loading, setLoading] = useState(false);

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const onUpdateItem = (e: any) => {
    const newData = {
      ...props.input.value,
      ...e
    };
    props.input.onChange(newData);
  };

  useEffect(() => {
    setLoading(true);

    props
      .onLoad()
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setSelectedItem(props.input.value)
    props.onSelectItem(props.input.value);
  }, [props.input.value]);

  useEffect(() => {
    items && setFilteredItems(query === '' ? items : items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())));
  }, [items, query]);

  return loading ? <p>Loading content...</p> : (
    <div>
      <Combobox
        onChange={onUpdateItem}
        value={props.input.value}
      >
        <div
          className='z-[9999] relative'
        >
          <div
            className='relative mt-2'
          >
            <Combobox.Input
              className='w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              displayValue={(item: { title: string, uuid: string}) => item?.title}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='Type to Search'
            />
            <Combobox.Button
              className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'
            >
              <ChevronUpDownIcon
                className='h-5 w-5 text-gray-400'
                aria-hidden='true'
              />
            </Combobox.Button>

            { filteredItems && filteredItems.length > 0 && (
              <Combobox.Options
                className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'
              >
                { filteredItems.map((item) => (
                  <Combobox.Option
                    className={({ active }) =>
                      classNames(
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                      )
                    }
                    key={item.uuid}
                    value={props.getValue(item)}
                  >
                    {({ active, selected }) => (
                      <>
                        <span
                          className={classNames('block truncate', selected && 'font-semibold')}
                        >
                          { item.name }
                        </span>
                        { selected && (
                          <span
                            className={classNames(
                              'absolute inset-y-0 right-0 flex items-center pr-4',
                              active ? 'text-white' : 'text-indigo-600'
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
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            )}
          </div>
        </div>
      </Combobox>
      {/* spot for displaying a warning/error */}
      <p
        className='h-4 w-full text-red-600'
      >
        { props.message }
      </p>
      { props.children }
    </div>
  );
};

export default TinaModelPicker;
