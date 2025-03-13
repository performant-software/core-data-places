import { useState } from 'react';
import { useTranslations } from '@i18n/client';
import { MediaGallery } from '@performant-software/core-data';
import _ from 'underscore';
import ManifestThumbnail from '@apps/search/ManifestThumbnail';
import TranslationContext from '@contexts/TranslationContext';

interface Props {
  data: any[];
  lang: string;
  uuid: string;
}

const MediaContents = (props: Props) => {
  const [manifestUrl, setManifestUrl] = useState<string | null>(null);
  const { t } = useTranslations();

  return (
    <div className="py-6">
      <h2 className="capitalize text-lg font-semibold mb-2">{t(props.uuid)} ({props.data.length})</h2>
      <div className='flex gap-6 flex-wrap'>
        {props.data.map(media => (
          // <TranslationContext.Provider
          //   value={{ t, lang: props.lang }}
          // >
          //   <ManifestThumbnail
          //     className='ps-6 pe-6'
          //     itemCount={media.item_count}
          //     name={_.first(media.label?.en)}
          //     onClick={() => setManifestUrl(media.id)}
          //     thumbnail={media.thumbnail}
          //   />
          // </TranslationContext.Provider>
          <img
            aria-label={media.name}
            className='rounded shadow cursor-pointer h-[260px] w-[260px]'
            onClick={() => setManifestUrl(media.manifest_url)}
            src={media.content_thumbnail_url}
          />
        ))}
        { manifestUrl && (
          <MediaGallery
            manifestUrl={manifestUrl}
            onClose={() => setManifestUrl(null)}
          />
        )}
      </div>
    </div>
  )
}

export default MediaContents;
