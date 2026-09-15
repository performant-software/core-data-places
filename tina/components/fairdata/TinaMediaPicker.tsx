import MediaContentsService from '@backend/api/coreData/mediaContents';
import { useEffect, useState } from 'react'
import { wrapFieldsWithMeta } from 'tinacms';
import TinaModelPicker from './TinaModelPicker';

interface CustomTinaFieldProps {
  field: any,
  input: any,
  meta: any
}

const TinaMediaPicker = wrapFieldsWithMeta((props: CustomTinaFieldProps) => {
  const [selectedMedia, setSelectedMedia] = useState<any>();

  useEffect(() => {
    props.input.onChange({
      ...props.input.value,
      title: selectedMedia?.name,
      uuid: selectedMedia?.uuid,
      manifest_url: selectedMedia?.manifest_url,
      content_url: selectedMedia?.content_url,
      content_preview_url: selectedMedia?.content_preview_url
    });
  }, [selectedMedia]);

  return (
    <TinaModelPicker
      onChange={setSelectedMedia}
      onLoad={(params) => (
        MediaContentsService
          .fetchAll(params)
          .then((response) => response.media_contents)
      )}
      value={selectedMedia}
    >
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
    </TinaModelPicker>
  );
});

export default TinaMediaPicker;
