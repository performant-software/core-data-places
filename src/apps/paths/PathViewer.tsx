import IframeEmbed from '@components/IframeEmbed';
import MediaInsert from '@components/MediaInsert';
import PlacesMap from '@components/PlacesMap';
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
import {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import Byline from '@components/Byline';
import { tinaField, useTina } from 'tinacms/dist/react';

export interface PathViewerProps {
  path: any;
}

const PathViewer = (props: PathViewerProps) => {
  const [currentPlace, setCurrentPlace] = useState(-1);

  const { data } = useTina({
      query: props.path.query,
      variables: props.path.variables,
      data: props.path.data
    });
  const path = useMemo(() => (data.path), [data])
  const contentDiv = useRef(null);

  const { t } = useTranslations();

  /**
   * Memo-izes the currentPlace place.
   */
  const place = useMemo(() => path?.path[currentPlace] && path.path[currentPlace].place, [currentPlace, path]);

  /**
   * Memo-izes the array of place IDs.
   */
  const placeIds = useMemo(() => place && place.uuid
    ? [place.uuid]
    : path.path.map(({ place: { uuid }}) => uuid), [place]);

  /**
   * Scrolls to the top of the content div when the currentPlace path changes.
   */
  useEffect(() => {
    const { current: instance } = contentDiv;

    if (instance) {
      instance.scroll({ top: 0, behavior: 'smooth' });
    }
  }, [currentPlace]);

  return (
    <RuntimeConfig
      path='/config.json'
      preprocess={PeripleoUtils.normalize}
    >
      <Peripleo>
        <TranslationContext.Provider
          value={{ t }}
        >
          <div
            className='w-full flex flex-row grow relative h-[calc(100vh-96px)]'
            data-tina-field={tinaField(path, "path")}
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
                <ArrowUturnLeftIcon
                  className={clsx(
                    'h-8 w-8',
                    { 'text-gray-500 cursor-default': currentPlace < 0 },
                    { 'cursor-pointer hover:scale-105 transition': currentPlace >= 0 }
                  )}
                  onClick={() => setCurrentPlace(-1)}
                />
                <ArrowLeftCircleIcon
                  className={clsx(
                    'h-8 w-8',
                    { 'text-gray-500 cursor-default': currentPlace === 0 },
                    { 'cursor-pointer hover:scale-105 transition': currentPlace !== 0 }
                  )}
                  onClick={() => currentPlace > 0 && setCurrentPlace((i) => i - 1)}
                />
                <ArrowRightCircleIcon
                  className={clsx(
                    'h-8 w-8',
                    { 'text-gray-500 cursor-default': currentPlace === path.path.length - 1 },
                    { 'cursor-pointer hover:scale-105 transition': currentPlace !== path.path.length - 1 }
                  )}
                  onClick={() => currentPlace < path.path.length - 1 && setCurrentPlace((i) => i + 1)}
                />
              </div>
            )}
            <div
              className='w-1/2'
            >
              <PlacesMap
                buffer={place?.buffer}
                animate={place?.animate}
                layer={place?.layer}
                mapId={place?.uuid || 'cover'}
                placeIds={placeIds}
              />
            </div>
            <div
              className='w-1/2 overflow-y-auto bg-neutral-dark text-white'
              ref={contentDiv}
            >
              { path && (
                <div
                  className='flex flex-col py-16 px-12 gap-16'
                >
                  { currentPlace >= 0 && (
                    <>
                      <h2
                        className='text-3xl'
                      >
                        { path.path[currentPlace].place.title }
                      </h2>
                      <article
                        className='prose prose-invert max-w-none'
                      >
                        <TinaMarkdown
                          content={path.path[currentPlace].blurb}
                          components={{
                            iframe: IframeEmbed,
                            media: MediaInsert
                        }}
                        />
                      </article>
                    </>
                  )}
                  { currentPlace < 0 && (
                    <>
                      <h2
                        className='text-3xl'
                      >
                        { path.title }
                      </h2>
                      { (path.author || path.date) && <Byline author={path.author} date={path.date} /> }
                      <article
                        className='prose prose-xl prose-invert max-w-none'
                      >
                        <TinaMarkdown
                          content={path.description}
                          components={{ iframe: IframeEmbed }}
                        />
                      </article>
                      <div
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
                        onClick={(e: any) => { e.preventDefault(); e.stopPropagation(); console.log('click!!!'); setCurrentPlace(0); }}
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
        </TranslationContext.Provider>
      </Peripleo>
    </RuntimeConfig>
  );
};

export default PathViewer;
