import TranslationContext from '@apps/search/TranslationContext';
import { Thumbnail } from '@samvera/clover-iiif/primitives';
import clsx from 'clsx';
import React, { useContext } from 'react';
import _ from 'underscore';

const DEFAULT_THUMBNAIL_HEIGHT = 80;
const DEFAULT_THUMBNAIL_WIDTH = 80;

interface Collection {
  items: [{
    id: string,
    item_count: number,
    label: {
      en: Array<string>
    },
    thumbnail: any
  }]
}

interface Props {
  className?: string;
  itemCount?: number;
  name: string;
  onClick?: () => void;
  thumbnail: Array<any>;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
}

const ManifestThumbnail = (props: Props) => {
  const { thumbnailWidth = DEFAULT_THUMBNAIL_WIDTH, thumbnailHeight = DEFAULT_THUMBNAIL_HEIGHT } = props;

  const { t } = useContext(TranslationContext);
  const label = t('relatedMediaItem', { name: props.name, count: props.itemCount });

  return (
    <li
      className={clsx('flex flex-col justify-center', props.className)}
    >
      <Thumbnail
        aria-label={label}
        className='rounded shadow cursor-pointer'
        onClick={props.onClick}
        thumbnail={_.map(props.thumbnail, (t) => ({
          ...t,
          width: thumbnailWidth,
          height:thumbnailHeight
        }))}
      />
      <div
        className='text-sm whitespace-nowrap'
      >
        { label }
      </div>
    </li>
  );
};

export default ManifestThumbnail;

export {
  Collection
}