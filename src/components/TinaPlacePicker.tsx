import { Combobox, Switch, Transition, RadioGroup } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react"
import { wrapFieldsWithMeta } from "tinacms";
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'


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

  const fetchPlace = async (placeUuid: string) => {
    const placeData = await fetch(`https://core-data-cloud-production-955ccda75add.herokuapp.com/core_data/public/places/${placeUuid}?project_ids=2`).then(response => response.json());
    setSelectedPlace(placeData);
  };

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
    const fetchData = async () => {
      const data = await fetch('https://core-data-cloud-production-955ccda75add.herokuapp.com/core_data/public/places?project_ids=2').then(response => response.json())
        .then(async response => {
          const results = response.metadata.count;
          const fullData = await fetch(`https://core-data-cloud-production-955ccda75add.herokuapp.com/core_data/public/places?project_ids=2&per_page=${results}`).then(response => response.json()).then(response => JSON.stringify(response));
          return fullData});
      setPlaces(JSON.parse(data));
    }
    fetchData();
    props.input.value.uuid && fetchPlace(props.input.value.uuid);
  }, []);

  useEffect(() => {
    places && setFilteredPlaces(query === '' ? places.features : places.features.filter((place) => place.properties.title.toLowerCase().includes(query.toLowerCase())));
  }, [places, query]);

  useEffect(() => {
    props.input.value.uuid && fetchPlace(props.input.value.uuid);
  }, [props.input.value]);

  useEffect(() => {
    if (selectedPlace && !selectedPlace.geometry) {
      setMessage('NOTE: The selected place has no specified location in Core Data. This may cause errors.')
    }
    else {
      setMessage('');
    }
  }, [selectedPlace]);

  return (
    <div>
      <Combobox value={{ uuid: props.input.value?.uuid, title: props.input.value?.title}} onChange={onUpdatePlace}>
        <div className="z-[9999] relative">
          <div className="relative mt-2">
            <Combobox.Input
              className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(place: { title: string, uuid: string}) => place?.title}
              placeholder="Type to Search"
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>

            {filteredPlaces && filteredPlaces.length > 0 && (
              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredPlaces.map((place) => (
                  <Combobox.Option
                    key={place.properties.uuid}
                    value={{ uuid: place.properties.uuid, title: place.properties.title }}
                    className={({ active }) =>
                      classNames(
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                      )
                    }
                  >
                    {({ active, selected }) => (
                      <>
                        <span className={classNames('block truncate', selected && 'font-semibold')}>{place.properties.title}</span>

                        {selected && (
                          <span
                            className={classNames(
                              'absolute inset-y-0 right-0 flex items-center pr-4',
                              active ? 'text-white' : 'text-indigo-600'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
      <p className="h-4 w-full text-red-600">
        { message }
      </p>
      { selectedPlace && (
        <div className="my-8 flex flex-col gap-8">
              <Switch.Group>
                <div className="flex items-center">
                  <Switch.Label className="mr-4">Animate pulsing map marker?</Switch.Label>
                  <Switch
                    defaultChecked={props.input.value.animate}
                    onChange={toggleAnimate}
                    className={`${
                      props.input.value.animate ? '!bg-blue-600' : '!bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    <span
                      className={`${
                        props.input.value.animate ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              </Switch.Group>
              <div className="flex flex-row gap-6 items-baseline">
                <label htmlFor="buffer" className="flex">
                  Zoom buffer (defaults to 2 mi)
                </label>
                <div>
                  <input
                    type="number"
                    name="buffer"
                    id="buffer"
                    className="w-16 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="(mi)"
                    defaultValue={props.input.value?.buffer}
                    onChange={onUpdateBuffer}
                  />
                </div>
              </div>
              { selectedPlace.place_layers.length > 0 && (<fieldset>
                <legend className="text-base font-semibold leading-6 text-gray-900">Layers</legend>
                <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
                  {selectedPlace.place_layers.map((layer: any) => (
                    <div key={layer.id} className="relative flex items-start py-4">
                      <div className="min-w-0 flex-1 text-sm leading-6">
                        <label htmlFor={`layer-${layer.id}`} className="select-none font-medium text-gray-900">
                          {layer.name}
                        </label>
                      </div>
                      <div className="ml-3 flex h-6 items-center">
                        <input
                          id={`layer-${layer.id}`}
                          name={`layer-${layer.id}`}
                          type="checkbox"
                          value={layer.id}
                          defaultChecked={props.input.value?.layer && props.input.value.layer.includes(layer.id)}
                          onChange={onUpdateLayer}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>)}
        </div>
      )}
    </div>
  )
});

export default TinaPlacePicker;
