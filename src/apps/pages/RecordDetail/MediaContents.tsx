import { useMemo, useState } from 'react';
import { useTranslations } from '@i18n/client';
import { MediaGallery } from '@performant-software/core-data';
import _ from 'underscore';
import ManifestThumbnail from '@apps/search/ManifestThumbnail';
import TranslationContext from '@contexts/TranslationContext';

interface Props {
  data: any;
  lang: string;
}

const MediaContents = (props: Props) => {
  const [manifestUrl, setManifestUrl] = useState<string | null>(null);
  const { t } = useTranslations();

  const count = useMemo(
    () => props.data.items.reduce((acc, item) => acc + item.item_count, 0),
  [props.data])

  return (
    <div className="py-6">
      <h2 className="capitalize text-lg font-semibold mb-2">{t('relatedMedia', { count })}</h2>
      <div className='flex gap-6 flex-wrap'>
        {props.data.items && props.data.items.map(media => (
          <TranslationContext.Provider
            value={{ t, lang: props.lang }}
          >
            <ManifestThumbnail
              className='ps-6 pe-6'
              itemCount={media.item_count}
              name={_.first(media.label?.en)}
              onClick={() => setManifestUrl(media.id)}
              thumbnail={media.thumbnail}
            />
          </TranslationContext.Provider>
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
