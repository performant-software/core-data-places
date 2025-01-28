import RelatedRecords from '@apps/search/panels/RelatedRecords';
import UserDefinedFieldView from '@components/UserDefinedFieldView';
import { HeaderImage, KeyValueList } from '@performant-software/core-data';
import { LocationMarkers } from '@performant-software/geospatial';
import { useRuntimeConfig } from '@peripleo/peripleo';
import clsx from 'clsx';
import { X } from 'lucide-react';
import React, { useMemo, type ReactNode, useCallback } from 'react';
import _ from 'underscore';

interface Props {
  children?: ReactNode,
  className?: string;
  geometry?: any;
  id: string;
  image?: {
    name: string,
    src: string
  };
  name: string;
  onClose?(): void;
  onLoadMedia?(): Promise<any>;
  onLoadOrganizations?(): Promise<any>;
  onLoadPeople?(): Promise<any>;
  onLoadPlaces?(): Promise<any>;
  onLoadTaxonomies?(): Promise<any>;
  userDefined?: { [key: string]: string };
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
   * Renders the user-defined field value for the passed data type.
   */
  const renderUserDefined = useCallback((type: string, value: any) => (
    <UserDefinedFieldView
      type={type}
      value={value}
    />
  ), []);

  /**
   * Memo-izes user defined field values.
   *
   * @type {UserDefinedField[]|*[]}
   */
  const userDefined = useMemo(() => (
    _.chain(props.userDefined || [])
      .values()
      .filter((u) => Boolean(u.value))
      .map(({ label, type, value }) => ({
        label,
        value: renderUserDefined(type, value)
      }))
      .value()
  ), [renderUserDefined, props.userDefined]);

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
      { props.name && (
        <h1
          className='ps-3 pe-7 font-medium'
        >
          { props.name }
        </h1>
      )}
      { props.children && (
        <div
          className='ps-3 pe-7 text-sm'
        >
          { props.children }
        </div>
      )}
      { userDefined && (
        <div
          className='ps-3'
        >
          <KeyValueList
            items={userDefined}
          />
        </div>
      )}
      { props.geometry && (
        <LocationMarkers
          animate
          boundingBoxOptions={bboxOptions}
          fitBoundingBox={_.get(config.map, 'zoom_to_place', true)}
          data={props.geometry}
          layerId='current'
        />
      )}
      <RelatedRecords
        key={`related-${props.id}`}
        onLoadMedia={props.onLoadMedia}
        onLoadOrganizations={props.onLoadOrganizations}
        onLoadPeople={props.onLoadPeople}
        onLoadPlaces={props.onLoadPlaces}
        onLoadTaxonomies={props.onLoadTaxonomies}
      />
    </aside>
  );
};

export default RecordPanel;
