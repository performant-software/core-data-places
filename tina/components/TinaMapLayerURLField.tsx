import { useEffect, useMemo, useState } from 'react';
import { wrapFieldsWithMeta } from 'tinacms';
import { Listbox } from '@headlessui/react';

interface CustomTinaFieldProps {
  field: any,
  input: any,
  meta: any,
  tinaForm: any,
  form: any,
  index: any
}

const TinaMapLayerURLField = wrapFieldsWithMeta((props: CustomTinaFieldProps) => {
  const [isGeoref, setIsGeoref] = useState<boolean>(false);
  const [mapLibrary, setMapLibrary] = useState<any>([]);

  useEffect(() => {
    // conditionally render the dropdown if the layer_type field is set to georeference
    const layerTypeField = props.form.getFieldState(
      `${props.field.name.replace('.url', '.layer_type')}`
    );
    setIsGeoref(layerTypeField.value === 'georeference');
  }, [props.field, props.form]);

  useEffect(() => {
    // fetch the map library and set it on state
    const fetchMapLib = async () => {
      const data = await fetch(process.env.TINA_PUBLIC_MAP_LIBRARY_URL);
      const mapLib = await data.json();
      setMapLibrary(mapLib);
    }
    try {
      fetchMapLib();
    } catch {
      setMapLibrary([]);
    }
  }, [process.env.TINA_PUBLIC_MAP_LIBRARY_URL]);

  const selectedLayerName = useMemo(() => {
    // get the selected layer's name from its url
    return mapLibrary?.find((layer) => layer.url === props.input.value)?.name;
  }, [mapLibrary, props.input.value]);

  return (
    <div>
      {isGeoref && mapLibrary && (
        <>
          <Listbox
            value={props.input.value}
            onChange={props.input.onChange}
          >
            <Listbox.Button
              className="shadow appearance-none bg-white block pl-3 pr-8 py-2 truncate w-full text-base cursor-pointer border border-gray-200 focus:outline-none focus:shadow-outline focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-gray-700 text-left"
            >
              {selectedLayerName || "Select map library layer"}
            </Listbox.Button>
            <Listbox.Options
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              {mapLibrary.map((mapLayer) => (
                <Listbox.Option
                  key={mapLayer.url}
                  value={mapLayer.url}
                  className={({ active }) =>
                    `${active ? 'bg-indigo-600 text-white' : 'text-gray-900'} relative cursor-default select-none py-2 pl-3 pr-9`
                  }
                >
                  {mapLayer.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
          <div className="block font-sans text-xs font-semibold text-gray-700 whitespace-normal mt-2 mb-2">or input manually:</div>
        </>
      )}
      <input
        type="text"
        className="shadow-inner focus:shadow-outline focus:border-blue-500 focus:outline-none block text-base placeholder:text-gray-300 px-3 py-2 text-gray-600 w-full bg-white border border-gray-200 transition-all ease-out duration-150 focus:text-gray-900 rounded-md"
        name={props.field.name}
        {...props.input}
      />
    </div>
  );
});

export default TinaMapLayerURLField;
