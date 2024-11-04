import IframeEmbed from '@components/IframeEmbed';
import PlacesMap from '@components/PlacesMap';
import { useTranslations } from '@i18n/client';
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  ArrowRightIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';
import { Peripleo as PeripleoUtils } from '@performant-software/core-data';
import { RuntimeConfig } from '@peripleo/peripleo';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';

export interface PathViewerProps {
  path: any;
}

const PathViewer = (props: PathViewerProps) => {
  const [current, setCurrent] = useState(-1);

  const { path } = props;
  const contentDiv = useRef(null);

  const { t } = useTranslations();

  useEffect(() => {
    contentDiv &&
      contentDiv.current &&
      setTimeout(() => {
        contentDiv.current.scroll({
          top: 0,
          behavior: 'smooth',
        });
      }, 50);
  }, [current]);

  return (
    <RuntimeConfig
      path='/config.json'
      preprocess={PeripleoUtils.normalize}
    >
      <div
        className='w-full flex flex-row flex-grow relative'
      >
        { path && (
          <div
            className='absolute bottom-[15%] left-[50%] -translate-x-1/2 mx-auto w-48 h-16 rounded-full bg-white z-[999] drop-shadow-xl flex justify-around items-center hover:scale-110 transition'
          >
            <ArrowUturnLeftIcon
              className={clsx(
                'h-8 w-8',
                { 'text-gray-500 cursor-default': current < 0 },
                { 'cursor-pointer hover:scale-105 transition': current >= 0 }
              )}
              onClick={() => setCurrent(-1)}
            />
            <ArrowLeftCircleIcon
              className={clsx(
                'h-8 w-8',
                { 'text-gray-500 cursor-default': current === 0 },
                { 'cursor-pointer hover:scale-105 transition': current !== 0 }
              )}
              onClick={() => current > 0 && setCurrent((i) => i - 1)}
            />
            <ArrowRightCircleIcon
              className={clsx(
                'h-8 w-8',
                { 'text-gray-500 cursor-default': current === path.path.length - 1 },
                { 'cursor-pointer hover:scale-105 transition': current !== path.path.length - 1 }
              )}
              onClick={() => current < path.path.length - 1 && setCurrent((i) => i + 1)}
            />
          </div>
        )}
        <div
          className='w-1/2'
        >
          { path && current >= 0 && (
            <PlacesMap
              buffer={path.path[current].place?.buffer}
              animate={path.path[current].place?.animate}
              layer={path.path[current].place?.layer}
              mapId={path.path[current].place.uuid}
              placeIds={[path.path[current].place.uuid]}
            />
          )}
          { path && current < 0 && (
            <PlacesMap
              animate={false}
              mapId='cover'
              placeIds={path.path.map(({ place: { uuid }}) => uuid)}
            />
          )}
        </div>
        <div
          className='w-1/2 overflow-y-scroll bg-neutral-dark text-white'
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
                  >
                    { path.path[current].place.title }
                  </h2>
                  <article
                    className='prose prose-invert max-w-none'
                  >
                    <TinaMarkdown
                      content={path.path[current].blurb}
                      components={{ iframe: IframeEmbed }}
                    />
                  </article>
                </>
              )}
              { current < 0 && (
                <>
                  <h2
                    className='text-3xl'
                  >
                    { path.title }
                  </h2>
                  <article
                    className='prose prose-xl prose-invert max-w-none'
                  >
                    <TinaMarkdown
                      content={path.description}
                      components={{ iframe: IframeEmbed }}
                    />
                  </article>
                  <div
                    className='cursor-pointer bg-white text-neutral-dark w-48 h-16 flex justify-between items-center hover:scale-105 rounded-full px-6'
                    onClick={() => setCurrent(0)}
                  >
                    <p>
                      { t('startTour') }
                    </p>
                    <ArrowRightIcon
                      className='h-8 w-8'
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </RuntimeConfig>
  );
};

export default PathViewer;