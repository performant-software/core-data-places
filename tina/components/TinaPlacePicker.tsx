import PlacesService from '@backend/api/coreData/places';
import { Switch } from '@headlessui/react';
import { useEffect, useState } from 'react'
import { wrapFieldsWithMeta } from 'tinacms';
import TinaModelPicker from './TinaModelPicker';

interface CustomTinaFieldProps {
  field: any,
  input: any,
  meta: any
}

const TinaPlacePicker = wrapFieldsWithMeta((props: CustomTinaFieldProps) => {
  const [selectedPlace, setSelectedPlace] = useState<any>();
  const [message, setMessage] = useState('');

  const toggleAnimate = (e: any) => {
    const newData = {
      ...props.input.value,
      animate: e
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
    props.input.onChange({
      ...props.input.value,
      title: selectedPlace?.name,
      uuid: selectedPlace?.uuid
    });

    if (selectedPlace && !selectedPlace.place_geometry) {
      setMessage('NOTE: The selected place has no specified location in Core Data. This may cause errors.')
    }
    else {
      setMessage('');
    }
  }, [selectedPlace]);

  return (
    <TinaModelPicker
      message={message}
      onChange={setSelectedPlace}
      onLoad={(params) => (
        PlacesService
          .fetchAll(params)
          .then(({ places }) => places)
      )}
      value={selectedPlace || {}}
    >
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
          { selectedPlace.place_layers?.length > 0 && (
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
    </TinaModelPicker>
  );
});

export default TinaPlacePicker;
