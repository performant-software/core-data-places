import IframeEmbed from '@components/IframeEmbed';
import MediaInsert from '@components/MediaInsert';
import TranslationContext from '@contexts/TranslationContext';
import { useTranslations } from '@i18n/useTranslations';
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  ArrowRightIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';
import { Peripleo as PeripleoUtils } from '@performant-software/core-data';
import { Peripleo, RuntimeConfig } from '@peripleo/peripleo';
import clsx from 'clsx';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import Byline from '@components/Byline';
import { PathQuery, PathQueryVariables } from '@root/tina/__generated__/types';
import { tinaField, useTina } from 'tinacms/dist/react';
import usePlacesFeatures from '@root/src/hooks/usePlacesFeatures';
import Map from '@components/Map';
import { LocationMarkers, Map as MapUtils } from '@performant-software/geospatial';
import { OverlayLayer } from '@performant-software/core-data';
import PathSelectionManager from '@apps/paths/PathSelectionManager';
import { GeoJSONLayer } from '@peripleo/maplibre';
import { dottedLine, noFill, selectablePoint, selectablePolygon } from '@utils/mapStyles';
import { Button } from '@headlessui/react';

export interface PathViewerProps {
  variables: PathQueryVariables;
  data: PathQuery;
  query: string;
  overlayLayer?: any
  colors: {
    geometry: string;
    selected: string
  }
}

const FULL_VIEW_BUFFER = 0.2;

const PathViewer = (props: PathViewerProps) => {
  const [current, setCurrent] = useState(-1);

  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const view = useMemo(() => (data?.path?.view || 'zoom'), [data?.path?.view]);
  const path = useMemo(() => (data?.path), [data]);
  const contentDiv = useRef(null);
  const { t } = useTranslations();

  /**
   * Memo-izes the current place.
   */
  const place = useMemo(() => path?.path[current] && path.path[current].place, [current, path]);

  /**
   * Memo-izes the array of place IDs.
   */
  const allPlaceIds = useMemo(
    () => path.path.map(({ place: { uuid } }) => uuid),
    [path.path]
  );

  const placeIds = useMemo(
    () => (view === 'zoom' && place?.uuid ? [place.uuid] : allPlaceIds),
    [view, place?.uuid, allPlaceIds]
  );

  const mapData = usePlacesFeatures(placeIds);

  /**
   * Scrolls to the top of the content div when the current path changes.
   */
  useEffect(() => {
    const { current: instance } = contentDiv;

    if (instance) {
      instance.scroll({ top: 0, behavior: 'smooth' });
    }
  }, [current]);

  const layerId = useMemo(() => (view === 'zoom' ? `markers-${place?.uuid || 'cover'}` : 'markers'), [view, place?.uuid]);

  const arcs = useMemo(() => MapUtils.toArcs(mapData.features), [mapData.features]);

  return (
    <div
      className='w-full flex flex-row grow relative h-[calc(100vh-96px)]'
    >
      { path && (
        <div
          className={`
            absolute 
            bottom-[15%] 
            left-[50%] 
            -translate-x-1/2 
            mx-auto 
            w-48 
            h-16 
            rounded-full 
            bg-white 
            z-999 
            drop-shadow-xl 
            flex 
            justify-around 
            items-center 
            hover:scale-110 
            transition
          `}
        >
          <Button
            onClick={() => setCurrent(-1)}
          >
            <ArrowUturnLeftIcon
              className={clsx(
                'h-8 w-8',
                { 'text-gray-500 cursor-default': current < 0 },
                { 'cursor-pointer hover:scale-105 transition': current >= 0 }
              )}
            />
          </Button>
          <Button
            onClick={() => current > -1 && setCurrent((i) => i - 1)}
          >
            <ArrowLeftCircleIcon
              className={clsx(
                'h-8 w-8',
                { 'text-gray-500 cursor-default': current === -1 },
                { 'cursor-pointer hover:scale-105 transition': current !== 0 }
              )}
            />
          </Button>
          <Button
            onClick={() => current < path.path.length - 1 && setCurrent((i) => i + 1)}
          >
            <ArrowRightCircleIcon
              className={clsx(
                'h-8 w-8',
                { 'text-gray-500 cursor-default': current === path.path.length - 1 },
                { 'cursor-pointer hover:scale-105 transition': current !== path.path.length - 1 }
              )}
            />
          </Button>
        </div>
      )}
      <div
        className='w-1/2'
      >
        <Map showLayerMenu={false}>
          <LocationMarkers
            id='markers'
            buffer={view === 'zoom' ? place?.buffer : FULL_VIEW_BUFFER}
            data={mapData}
            layerId={layerId}
            layer={view === 'zoom' ? place?.layer : undefined}
            pointStyle={selectablePoint}
            fillStyle={selectablePolygon}
          />
          <PathSelectionManager placeUuid={place?.uuid} mapData={mapData} />
          <GeoJSONLayer
            data={arcs}
            id='arcs'
            strokeStyle={dottedLine}
            fillStyle={noFill}
          />
          {props.overlayLayer && (
            <OverlayLayer
              overlay={props.overlayLayer}
            />
          )}
        </Map>
      </div>
      <div
        className='w-1/2 overflow-y-auto bg-neutral-dark text-white'
        ref={contentDiv}
      >
        { path && (
          <div
            className='flex flex-col py-16 px-12 gap-16'
          >
            { current >= 0 && (
              <>
                <h2
                  className='text-3xl'
                  data-tina-field={tinaField(path.path[current].place, 'title')}
                >
                  { path.path[current].place.title }
                </h2>
                <article
                  className='prose prose-invert max-w-none'
                  data-tina-field={tinaField(path.path[current])}
                >
                  <TinaMarkdown
                    content={path.path[current].blurb}
                    components={{
                      iframe: IframeEmbed,
                      media: MediaInsert
                  }}
                  />
                </article>
              </>
            )}
            { current < 0 && (
              <>
                <h2
                  className='text-3xl'
                  data-tina-field={tinaField(data?.path, 'title')}
                >
                  { path.title }
                </h2>
                { (path.author || path.date) && <Byline author={path.author} date={path.date} /> }
                <article
                  className='prose prose-xl prose-invert max-w-none'
                  data-tina-field={tinaField(data?.path, 'description')}
                >
                  <TinaMarkdown
                    content={path.description}
                    components={{ iframe: IframeEmbed }}
                  />
                </article>
                <Button
                  className={`
                    cursor-pointer 
                    bg-white 
                    text-neutral-dark 
                    w-48 
                    h-16 
                    flex 
                    justify-between 
                    items-center 
                    hover:scale-105 
                    rounded-full 
                    px-6
                  `}
                  onClick={() => setCurrent(0)}
                >
                  <p>
                    { t('startTour') }
                  </p>
                  <ArrowRightIcon
                    className='h-8 w-8'
                  />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Wrapper = (props: PathViewerProps) => {
  const { t } = useTranslations();

  return (
    <RuntimeConfig
      path='/config.json'
      preprocess={PeripleoUtils.normalize}
    >
      <Peripleo>
        <TranslationContext.Provider
          value={{ t }}
        >
          <PathViewer {...props} />
        </TranslationContext.Provider>
      </Peripleo>
    </RuntimeConfig>
  )
};

export default Wrapper;
