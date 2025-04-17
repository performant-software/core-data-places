import TranslationContext from '@contexts/TranslationContext';
import { Button, Icon } from '@performant-software/core-data';
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
      { props.thumbnail && (
        <Thumbnail
          aria-label={label}
          className='rounded-sm shadow-sm cursor-pointer'
          onClick={props.onClick}
          thumbnail={_.map(props.thumbnail, (t) => ({
            ...t,
            width: thumbnailWidth,
            height:thumbnailHeight
          }))}
        />
      )}
      { !props.thumbnail && (
        <Button
          className='flex items-center justify-center w-[80px] h-[80px]'
          onClick={props.onClick}
          rounded
          secondary
        >
          <Icon
            name='info'
            size={24}
          />
        </Button>
      )}
      <div
        className='text-sm whitespace-nowrap py-2'
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