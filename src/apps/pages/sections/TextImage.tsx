import LinkButton from '@components/LinkButton';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import _ from 'underscore';

interface Props {
  backgroundPosition: 'top' | 'bottom' | 'left' | 'right';
  buttonText?: string;
  description?: string;
  image: string;
  imageAlt?: string;
  textPosition: 'left' | 'right';
  title: string;
  url?: string;
}

const BackgroundPosition = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right'
};

const TextPosition = {
  left: 'left',
  right: 'right'
};

const IMAGE_SCALE = 1.75;
const BACKGROUND_SCALE = 1.65;
const SCREEN_WIDTH_LG = 1024;

const TextImage = (props: Props) => {
  const [backgroundHeight, setBackgroundHeight] = useState<number | undefined>();
  const [contentHeight, setContentHeight] = useState<number | undefined>();
  const [imageHeight, setImageHeight] = useState<number | undefined>();
  const [screenWidth, setScreenWidth] = useState<number | undefined>();
  const [textPosition, setTextPosition] = useState<string>(props.textPosition || TextPosition.left);

  const contentRef = useRef();

  /**
   * Adds the window resize event listener.
   */
  useEffect(() => {
    const onResize = () => {
      setScreenWidth(window.innerWidth);
    };

    setScreenWidth(window.innerWidth);

    window.addEventListener('resize', onResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  /**
   * Sets the resize observer on the content element.
   */
  useEffect(() => {
    const { current: instance } = contentRef;

    let observer;

    if (instance) {
      const observer = new ResizeObserver(([entry]) => {
        setContentHeight(entry.target.clientHeight);
      });

      observer.observe(instance);
    }

    return () => observer?.disconnect();
  }, [screenWidth]);

  /**
   * Sets the image height and background height when the content height changes.
   */
  useEffect(() => {
    if (contentHeight && screenWidth >= SCREEN_WIDTH_LG) {
      const { backgroundPosition } = props;

      if (backgroundPosition === BackgroundPosition.top || backgroundPosition === BackgroundPosition.bottom) {
        setImageHeight(contentHeight * IMAGE_SCALE);
        setBackgroundHeight(contentHeight * BACKGROUND_SCALE);
      } else {
        setImageHeight(contentHeight);
      }
    }
  }, [contentHeight]);

  /**
   * Sets the text to be positioned on the same side as the background, if a background position is specified.
   */
  useEffect(() => {
    if (props.backgroundPosition === BackgroundPosition.left) {
      setTextPosition(TextPosition.left);
    } else if (props.backgroundPosition === BackgroundPosition.right) {
      setTextPosition(TextPosition.right);
    }
  }, [props.backgroundPosition]);

  return (
    <div
      class={clsx(
        'relative flex flex-col lg:flex-row px-10 py-8 gap-y-8 lg:gap-x-20 lg:px-36 lg:py-16',
        { 'flex-col-reverse lg:flex-row-reverse': textPosition === TextPosition.right },
        { 'text-text-primary': !!props.backgroundPosition }
      )}
    >
      { props.backgroundPosition && (
        <div
          class={clsx(
            'absolute bg-primary',
            { 'top-0 left-0 right-0 h-full': props.backgroundPosition === BackgroundPosition.top },
            { 'bottom-0 left-0 right-0 h-full': props.backgroundPosition === BackgroundPosition.bottom },
            { 'top-0 bottom-0 left-0 w-full lg:w-[65%]': props.backgroundPosition === BackgroundPosition.left },
            { 'top-0 bottom-0 right-0 w-full lg:w-[65%]': props.backgroundPosition === BackgroundPosition.right }
          )}
          style={{
            height: backgroundHeight ? `${backgroundHeight}px` : undefined
          }}
        />
      )}
      <div
        class={clsx(
          'lg:w-[50%] z-10',
          { 'flex flex-row items-end': props.backgroundPosition === BackgroundPosition.bottom }
        )}
      >
        <div
          ref={contentRef}
        >
          { props.title && (
            <h2
              class='text-4xl font-bold'
            >
              { props.title }
            </h2>
          )}
          { props.description && (
            <p
              class={clsx(
                { 'mt-5': !!props.title }
              )}
            >
              { props.description }
            </p>
          )}
          { !_.isEmpty(props.url) && (
            <div>
              <LinkButton
                className='bg-secondary'
                content={props.buttonText}
                href={props.url}
              />
            </div>
          )}
        </div>
      </div>
      <div
        class='z-10 lg:w-[50%]'
      >
        <div
          style={{
            height: imageHeight ? `${imageHeight}px` : undefined
          }}
        >
          <img
            alt={props.imageAlt}
            class='w-full h-full object-cover'
            src={props.image}
          />
        </div>
      </div>
    </div>
  );
};

export default TextImage;