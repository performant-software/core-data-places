import { HeaderImage, KeyValueList } from '@performant-software/core-data';
import { LocationMarkers } from '@performant-software/geospatial';
import { useRuntimeConfig } from '@peripleo/peripleo';
import clsx from 'clsx';
import { X } from 'lucide-react';
import React, { useMemo, type ReactNode } from 'react';
import _ from 'underscore';

interface Image {
  name: string;
  src: string;
}

interface Item {
  uuid: string;
  name: string;
  user_defined: Array<{ [key: string]: string }>;
}

interface Props {
  children: ReactNode,
  className?: string;
  geometry?: any;
  item: Item;
  image?: Image;
  onClose(): void;
}

const RecordPanel = (props: Props) => {
  const config = useRuntimeConfig<any>();

  /**
   * Memo-izes the bounding box options.
   */
  const bboxOptions = useMemo(() => ({
    padding: {
      top: 100,
      bottom: 100,
      left: 380,
      right: 120,
    },
    maxZoom: config.search.max_zoom || 14,
  }), [config]);

  /**
   * Memo-izes user defined field values.
   *
   * @type {UserDefinedField[]|*[]}
   */
  const userDefined = useMemo(() => (
    props.item?.user_defined ? Object.values(props.item.user_defined) : []
  ), [props.item]);

  return (
    <aside
      className={clsx(
        'flex',
        'flex-col',
        'absolute',
        'z-10',
        'h-full',
        'w-[350px]',
        'bg-white/80',
        'backdrop-blur',
        'shadow',
        'overflow-y-auto',
        props.className
      )}
    >
      <button
        aria-label='Close'
        className='absolute top-2 right-2 p-1.5 rounded-full z-10 bg-slate-200/60 hover:bg-slate-200 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700'
        onClick={props.onClose}
        type='button'
      >
        <X
          className='h-4 w-4'
        />
      </button>
      { props.image && (
        <HeaderImage
          name={props.image.name}
          src={props.image.src}
        />
      )}
      { props.item && (
        <h1
          className='ps-3 pe-7 font-medium'
        >
          { props.item.name }
        </h1>
      )}
      { userDefined && (
        <KeyValueList
          items={userDefined}
        />
      )}
      { props.children }
      { props.geometry && (
        <LocationMarkers
          animate
          boundingBoxOptions={bboxOptions}
          fitBoundingBox={_.get(config.map, 'zoom_to_place', true)}
          data={props.geometry}
          layerId='current'
        />
      )}
    </aside>
  );
};

export default RecordPanel;
