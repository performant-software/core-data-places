import { useTranslations } from '@i18n/useTranslations';
import Viewer from '@samvera/clover-iiif/viewer';
import { useMemo } from 'react';

interface Props {
  data: any;
}

const MediaContents = (props: Props) => {
  const { t } = useTranslations();

  const count = useMemo(
    () => props.data.items.reduce((acc, item) => acc + item.item_count, 0),
  [props.data])

  return (
    <div className='py-6'>
      <h2 className='capitalize text-lg font-semibold mb-2'>{t('relatedMedia', { count })}</h2>
      <Viewer 
        iiifContent={props.data} 
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
