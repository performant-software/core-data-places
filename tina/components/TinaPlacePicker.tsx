import { Combobox, Switch } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useCallback, useEffect, useState } from 'react'
import { wrapFieldsWithMeta } from 'tinacms';
import { getPlacesURL, getPlaceURL } from '../../src/helpers/core-data';

interface CustomTinaFieldProps {
  field: any,
  input: any,
  meta: any
};

const TinaPlacePicker = wrapFieldsWithMeta((props: CustomTinaFieldProps) => {
  const [places, setPlaces] = useState<any>();
  const [query, setQuery] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState<any>();
  const [selectedPlace, setSelectedPlace] = useState<any>();
  const [message, setMessage] = useState('');

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const fetchPlace = useCallback((id) => {
    const url = getPlaceURL(id);
    return fetch(url).then((response) => response.json());
  }, []);

  const fetchPlaces = useCallback((params = {}) => {
    const url = getPlacesURL(params);
    return fetch(url).then((response) => response.json());
  }, []);

  const toggleAnimate = (e: any) => {
    const newData = {
      ...props.input.value,
      animate: e
    };
    props.input.onChange(newData);
  };

  const onUpdatePlace = (e: any) => {
    const newData = {
      ...props.input.value,
      uuid: e.uuid,
      title: e.title
    };
    props.input.onChange(newData);
  };

  const onUpdateLayer = (e: any) => {
    const newLayer = !props.input.value?.layer ? [ parseInt(e.target.value) ]
      : props.input.value.layer.includes(parseInt(e.target.value)) ? props.input.value.layer.filter((layer: any) => parseInt(layer) != parseInt(e.target.value) ) : [ ...props.input.value.layer, parseInt(e.target.value) ];
    const newData = {
      ...props.input.value,
      layer: newLayer
    };
    props.input.onChange(newData);
  };

  const onUpdateBuffer = (e: any) => {
    const newData = {
      ...props.input.value,
      buffer: e.target.valueAsNumber
    };
    props.input.onChange(newData);
  };

  useEffect(() => {
    fetchPlaces({ per_page: 0 })
      .then((data) => setPlaces(data.places));
  }, []);

  useEffect(() => {
    const { uuid } = props.input.value;

    if (uuid) {
      fetchPlace(uuid)
        .then((data) => setSelectedPlace(data.place));
    }
  }, []);

  useEffect(() => {
    places && setFilteredPlaces(query === '' ? places : places.filter((place) => place.name.toLowerCase().includes(query.toLowerCase())));
  }, [places, query]);

  useEffect(() => {
    if (selectedPlace && !selectedPlace.place_geometry) {
      setMessage('NOTE: The selected place has no specified location in Core Data. This may cause errors.')
    }
    else {
      setMessage('');
    }
  }, [selectedPlace]);

  return (
    <div>
      <Combobox
        onChange={onUpdatePlace}
        value={{
          title: props.input.value?.title,
          uuid: props.input.value?.uuid
        }}
      >
        <div
          className='z-[9999] relative'
        >
          <div
            className='relative mt-2'
          >
            <Combobox.Input
              className='w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              displayValue={(place: { title: string, uuid: string}) => place?.title}
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

            { filteredPlaces && filteredPlaces.length > 0 && (
              <Combobox.Options
                className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'
              >
                { filteredPlaces.map((place) => (
                  <Combobox.Option
                    className={({ active }) =>
                      classNames(
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                      )
                    }
                    key={place.uuid}
                    value={{
                      title: place.name,
                      uuid: place.uuid
                  }}
                  >
                    {({ active, selected }) => (
                      <>
                        <span
                          className={classNames('block truncate', selected && 'font-semibold')}
                        >
                          { place.name }
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
        { message }
      </p>
      { selectedPlace && (
        <div
          className='my-8 flex flex-col gap-8'
        >
          <Switch.Group>
            <div
              className='flex items-center'
            >
              <Switch.Label
                className='mr-4'
              >
                Animate pulsing map marker?
              </Switch.Label>
              <Switch
                className={`${
                  props.input.value.animate ? '!bg-blue-600' : '!bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                defaultChecked={props.input.value.animate}
                onChange={toggleAnimate}
              >
                <span
                  className={`${
                    props.input.value.animate ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </Switch.Group>
          <div
            className='flex flex-row gap-6 items-baseline'
          >
            <label
              className='flex'
              htmlFor='buffer'
            >
              Zoom buffer (defaults to 2 mi)
            </label>
            <div>
              <input
                className='w-16 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                defaultValue={props.input.value?.buffer}
                id='buffer'
                name='buffer'
                onChange={onUpdateBuffer}
                placeholder='(mi)'
                type='number'
              />
            </div>
          </div>
          { selectedPlace.place_layers.length > 0 && (
            <fieldset>
              <legend
                className='text-base font-semibold leading-6 text-gray-900'
              >
                Layers
              </legend>
            <div
              className='mt-4 divide-y divide-gray-200 border-b border-t border-gray-200'
            >
              { selectedPlace.place_layers.map((layer: any) => (
                <div
                  className='relative flex items-start py-4'
                  key={layer.id}
                >
                  <div
                    className='min-w-0 flex-1 text-sm leading-6'
                  >
                    <label
                      className='select-none font-medium text-gray-900'
                      htmlFor={`layer-${layer.id}`}
                    >
                      { layer.name }
                    </label>
                  </div>
                  <div
                    className='ml-3 flex h-6 items-center'
                  >
                    <input
                      className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
                      defaultChecked={props.input.value?.layer && props.input.value.layer.includes(layer.id)}
                      id={`layer-${layer.id}`}
                      name={`layer-${layer.id}`}
                      onChange={onUpdateLayer}
                      type='checkbox'
                      value={layer.id}
                    />
                  </div>
                </div>
              ))}
            </div>
          </fieldset>)}
        </div>
      )}
    </div>
  );
});

export default TinaPlacePicker;
