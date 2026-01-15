import { ChangeEventHandler } from 'react';

interface Props {
  className?: string;
  label: string;
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  placeholder?: string;
  type: string;
  value: string;
}

const FormInput = (props: Props) => {
  const {
    className,
    label,
    name,
    onChange,
    placeholder,
    type,
    value
  } = props;

  return (
    <div
      className={className}
    >
      <div>
        <label
          htmlFor={name}
          className='block text-sm/6 font-medium text-gray-900'
        >
          { label }
        </label>
        <div
          className='mt-2'
        >
          <div
            className='flex items-center rounded-md bg-white border border-solid border-layout'
          >
            { type === 'text' && (
              <input
                className='block w-full rounded-md bg-white px-3.5 py-2'
                name={name}
                onChange={onChange}
                placeholder={placeholder}
                type='text'
                value={value}
              />
            )}
            { type === 'textarea' && (
              <textarea
                className='block w-full rounded-md bg-white px-3 py-1.5 rounded'
                name={name}
                onChange={onChange}
                rows={3}
                value={value}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormInput;