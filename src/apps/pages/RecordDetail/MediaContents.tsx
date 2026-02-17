import { useMemo } from 'react';
import { useTranslations } from '@i18n/useTranslations';
import _ from 'underscore';
import Viewer from '@samvera/clover-iiif/viewer';

interface Props {
  model: string;
  uuid: string;
  data: any;
}

const MediaContents = (props: Props) => {
  const { t } = useTranslations();

  const count = useMemo(
    () => props.data.items.reduce((acc, item) => acc + item.item_count, 0),
  [props.data])

  const iiifURL = useMemo(() => (
    `${window.location.origin}/api/${props.model}/${props.uuid}/manifests.json`
  ), [props, window.location.origin]);

  return (
    <div className='py-6'>
      <h2 className='capitalize text-lg font-semibold mb-2'>{t('relatedMedia', { count })}</h2>
      <Viewer 
        iiifContent={iiifURL} 
        options={{
          informationPanel: {
            open: false
          }
        }} 
      />
    </div>
  )
}

export default MediaContents;
