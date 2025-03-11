import { useCallback, useMemo, useRef, useState } from 'react';

interface Props {
  onChange(value: string): void;
  value: string | null;
}

const JsonUpload = (props: Props) => {
  const [error, setError] = useState(null);
  const inputRef = useRef();

  /**
   * Memo-izes the value as JSON.
   */
  const jsonData = useMemo(() => (
    props.value && JSON.stringify(JSON.parse(props.value), null, 2)
  ), [props.value]);

  /**
   * Calls the onChange prop with a `null` value.
   */
  const onClear = useCallback(() => props.onChange(null), []);

  /**
   * Callback fired when the upload button is clicked.
   */
  const onClick = useCallback(() => {
    const { current: instance } = inputRef;

    if (instance) {
      instance.click();
    }
  }, []);

  /**
   * Parses the input file and calls the `onChange` prop.
   */
  const onUpload = useCallback(({ target: { files }}) => {
    const file = files.item(0);

    const reader = new FileReader();

    // Read the file
    reader.readAsText(file);

    // Set the onload and onerror handlers
    reader.onload = () => props.onChange(reader.result as string);
    reader.onerror = () => setError(reader.error.message);
  }, []);

  return (
    <div
      className='flex flex-col'
    >
      { error && (
        <p
          className='w-full text-red-600'
        >
          { error }
        </p>
      )}
      <div
        className='flex py-2 gap-x-2'
      >
        <button
          className={`
            icon-parent 
            inline-flex 
            items-center 
            font-medium 
            focus:outline-none 
            focus:ring-2 
            focus:shadow-outline 
            text-center
            justify-center 
            transition-all 
            duration-150 
            ease-out  
            shadow 
            text-white 
            bg-blue-500 
            hover:bg-blue-600 
            focus:ring-blue-500 
            border-0 
            text-sm 
            h-10 
            px-8 
            rounded-full
          `}
          onClick={onClick}
          type='button'
        >
          Upload
        </button>
        <button
          className={`
            icon-parent 
            inline-flex 
            items-center 
            font-medium 
            focus:outline-none 
            focus:ring-2 
            focus:shadow-outline 
            text-center 
            justify-center 
            transition-all 
            duration-150 
            ease-out 
            shadow 
            text-white 
            bg-red-500 
            hover:bg-red-600 
            focus:ring-red-500 
            text-sm 
            h-10 
            px-8  
            rounded-full
          `}
          onClick={onClear}
          type='button'
        >
          Clear
        </button>
      </div>
      <input
        accept='application/json'
        className='hidden'
        onChange={onUpload}
        ref={inputRef}
        type='file'
      />
      <div
        className='border-2 border-solid border-gray-200 h-[300px] py-2 overflow-auto'
      >
        { jsonData && (
          <code
            className='block whitespace-pre'
          >
            { jsonData }
          </code>
        )}
      </div>
    </div>
  );
};

export default JsonUpload;