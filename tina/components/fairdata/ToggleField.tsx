import { Field, Label, Switch } from '@headlessui/react';

interface ToggleFieldProps {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}

const ToggleField = (props: ToggleFieldProps) => (
  <Field>
    <div
      className='flex items-center py-4'
    >
      <Label
        className='mr-4'
      >
        { props.label }
      </Label>
      <Switch
        className={`${
          props.checked ? '!bg-blue-600' : '!bg-gray-200'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        defaultChecked={props.checked}
        onChange={props.onChange}
      >
        <span
          className={`${
            props.checked ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
    </div>
  </Field>
);

export default ToggleField;
