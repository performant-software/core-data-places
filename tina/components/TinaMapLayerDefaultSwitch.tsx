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

const TinaMapLayerDefaultSwitch = wrapFieldsWithMeta((props: CustomTinaFieldProps) => {
  const [isOverlay, setIsOverlay] = useState<boolean>(false);
  const [switchColor, setSwitchColor] = useState<string>('!bg-gray-200');

  useEffect(() => {
    // force "default" field unchecked and disabled if overlay is unchecked
    const overlayField = props.form.getFieldState(
      `${props.field.name.replace('.default', '.overlay')}`
    );
    const fieldIsOverlay = overlayField.value === true;
    if (!fieldIsOverlay) {
      props.input.onChange(false);
    }
    setIsOverlay(fieldIsOverlay);
  }, [props.field, props.form, props.input]);

  useEffect(() => {
    // set a "disabled" color if this is not an overlay layer,
    // otherwise use normal checked and unchecked colors
    if (!isOverlay) {
      setSwitchColor('!bg-gray-100');
    } else if (props.input.value === true) {
      setSwitchColor('!bg-blue-600');
    } else {
      setSwitchColor('!bg-gray-200');
    }
  }, [props.input.value, isOverlay])

  return (
    // adapted from TinaMapLayerOverlaySwitch.tsx
    <Switch
      className={`${switchColor} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
      defaultChecked={props.input.value}
      onChange={props.input.onChange}
      disabled={!isOverlay}
    >
      <span
        className={`${
        props.input.value ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </Switch>
  );
});

export default TinaMapLayerDefaultSwitch;
