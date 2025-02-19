import { useEffect, useState } from 'react';
import { wrapFieldsWithMeta } from 'tinacms';
import { Switch } from '@headlessui/react';

interface CustomTinaFieldProps {
  field: any,
  input: any,
  meta: any,
  tinaForm: any,
  form: any,
  index: any
}

const TinaMapLayerOverlaySwitch = wrapFieldsWithMeta((props: CustomTinaFieldProps) => {
  const [isGeoref, setIsGeoref] = useState<boolean>(false);
  const [switchColor, setSwitchColor] = useState<string>('!bg-gray-200');

  useEffect(() => {
    // force overlay checked and disabled if layer_type is georeference
    const layerTypeField = props.form.getFieldState(
      `${props.field.name.replace('.overlay', '.layer_type')}`
    );
    const fieldIsGeoref = layerTypeField.value === "georeference";
    if (fieldIsGeoref) {
      props.input.onChange(true);
    }
    setIsGeoref(fieldIsGeoref);
  }, [props.field, props.form, props.input]);

  useEffect(() => {
    // set a "disabled AND checked" color if georeference is the layer type
    // otherwise use normal checked and unchecked colors
    if (isGeoref) {
      setSwitchColor('!bg-blue-100');
    } else if (props.input.value === true) {
      setSwitchColor('!bg-blue-600');
    } else {
      setSwitchColor('!bg-gray-200');
    }
  }, [props.input.value, isGeoref])

  return (
    // adapted from switch in TinaPlacePicker.tsx
    <Switch
      className={`${switchColor} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
      defaultChecked={props.input.value}
      onChange={props.input.onChange}
      disabled={isGeoref}
    >
      <span
        className={`${
        props.input.value ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </Switch>
  );
});

export default TinaMapLayerOverlaySwitch;
