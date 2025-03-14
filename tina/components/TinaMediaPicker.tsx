import { useState } from 'react'
import { wrapFieldsWithMeta } from 'tinacms';
import MediaContentsService from '@backend/api/mediaContents';
import TinaModelPicker from './TinaModelPicker';

interface CustomTinaFieldProps {
  field: any,
  input: any,
  meta: any
}

const TinaMediaPicker = wrapFieldsWithMeta((props: CustomTinaFieldProps) => {
  const [selectedMedia, setSelectedMedia] = useState<any>();

  return (
    <TinaModelPicker
      {...props}
      service={MediaContentsService}
      onSelectItem={(_item) => setSelectedMedia(_item)}
      getValue={(media) => ({
        title: media.name,
        uuid: media.uuid,
        manifest_url: media.manifest_url,
        content_url: media.content_url,
        content_preview_url: media.content_preview_url
      })}
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
