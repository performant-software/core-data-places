import { useTranslations } from '@i18n/useTranslations';
import { Button } from '@performant-software/core-data';
import Viewer from '@samvera/clover-iiif/viewer';
import { useMemo, useState } from 'react';
import _ from 'underscore';

interface Props {
  model: string;
  uuid: string;
  data: any;
  showContentWarning?: boolean;
}

const MediaContents = (props: Props) => {
  const { t } = useTranslations();
  const [showContentWarning, setShowContentWarning] = useState(props.showContentWarning);

  const count = useMemo(
    () => props.data.items.reduce((acc, item) => acc + item.item_count, 0),
  [props.data])

  const iiifURL = useMemo(() => (
    `${window.location.origin}/api/${props.model}/${props.uuid}/manifests.json`
  ), [props, window.location.origin]);

  return (
    <div className='py-6'>
      <h2 className='capitalize text-lg font-semibold mb-2'>{t('relatedMedia', { count })}</h2>
        { showContentWarning && (
          <div className='flex items-center flex-col md:flex-row gap-6 my-4'>
            <p className='text-lg'>{t('contentWarningRelatedMedia')}</p>
            <Button
              onClick={() => setShowContentWarning(false)}
              primary='true'
              rounded='true'
            >
              {t('yes')}
            </Button>
          </div>
        ) }
      { !showContentWarning && (
        <Viewer 
          iiifContent={iiifURL} 
          options={{
            informationPanel: {
              open: false
            }
          }} 
        />
      ) }
    </div>
  )
}

export default MediaContents;
