import { getMediaURL } from '../utils'
import { Combobox, Switch } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useCallback, useEffect, useState } from 'react'
import { wrapFieldsWithMeta } from 'tinacms';
import Viewer from '@samvera/clover-iiif/viewer';

interface CustomTinaFieldProps {
  field: any,
  input: any,
  meta: any
}

const TinaMediaPicker = wrapFieldsWithMeta((props: CustomTinaFieldProps) => {
  const [media, setMedia] = useState<any>();
  const [query, setQuery] = useState('');
  const [filteredMedia, setFilteredMedia] = useState<any>();
  const [selectedMedia, setSelectedMedia] = useState<any>();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const fetchMedia = useCallback((params = {}) => {
    const url = getMediaURL(params);
    return fetch(url).then((response) => response.json());
  }, []);

  const onUpdateMedia = (e: any) => {
    const newData = {
      ...props.input.value,
      uuid: e.uuid,
      title: e.title,
      manifest_url: e.manifest_url,
      content_url: e.content_url,
      content_preview_url: e.content_preview_url
    };
    props.input.onChange(newData);
  };

  useEffect(() => {
    setLoading(true);
    fetchMedia({ per_page: 0 })
      .then((data) => {
        setMedia(data.media_contents);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setSelectedMedia(props.input.value)
  }, [props.input.value]);

  useEffect(() => {
    media && setFilteredMedia(query === '' ? media : media.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())));
  }, [media, query]);

  return loading ? <p>Loading media content...</p> : (
    <div>
      <Combobox
        onChange={onUpdateMedia}
        value={{
          title: props.input.value?.title,
          uuid: props.input.value?.uuid,
          manifest_url: props.input.value?.manifest_url,
          content_url: props.input.value?.content_url,
          content_preview_url: props.input.value?.content_preview_url
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
              displayValue={(media: { title: string, uuid: string}) => media?.title}
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

            { filteredMedia && filteredMedia.length > 0 && (
              <Combobox.Options
                className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'
              >
                { filteredMedia.map((media) => (
                  <Combobox.Option
                    className={({ active }) =>
                      classNames(
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                      )
                    }
                    key={media.uuid}
                    value={{
                      title: media.name,
                      uuid: media.uuid,
                      manifest_url: media.manifest_url,
                      content_url: media.content_url,
                      content_preview_url: media.content_preview_url
                  }}
                  >
                    {({ active, selected }) => (
                      <>
                        <span
                          className={classNames('block truncate', selected && 'font-semibold')}
                        >
                          { media.name }
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
      { selectedMedia && (
        <div
          className='my-8 flex flex-col gap-8'
        >
          <img
            src={selectedMedia.content_preview_url}
            alt={selectedMedia.title}
            className='w-96'
          />
        </div>
      )}
    </div>
  );
});

export default TinaMediaPicker;
