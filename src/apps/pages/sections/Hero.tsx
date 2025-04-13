import clsx from 'clsx';
import { useMemo } from 'react';
import _ from 'underscore';

interface Props {
  height?: string;
  imageAlt?: string;
  imageUrl: string;
  subtitle: string;
  title: string;
}

export const HeroHeight = {
  small: 'small',
  medium: 'medium',
  large: 'large'
};

const Hero = (props: Props) => {
  const height = useMemo(() => {
    let value = HeroHeight.small;

    if (props.height) {
      value = props.height;
    } else if (!_.isEmpty(props.subtitle)) {
      value = HeroHeight.medium;
    }

    return value;
  }, []);

  return (
    <div
      className={clsx(
        'relative flex flex-col bg-gray-900 justify-center',
        { 'h-[220px]': height === HeroHeight.small },
        { 'h-[420px]': height === HeroHeight.medium },
        { 'h-[720px]': height === HeroHeight.large }
      )}
    >
      <img
        alt={props.imageAlt}
        className='absolute top-0 left-0 h-full w-full object-cover'
        src={props.imageUrl}
      />
      <div
        className='absolute top-0 left-0 w-full h-full bg-gray-900/40'
      />
      { (props.title || props.subtitle) && (
        <div
          className='relative z-10 text-white px-8 md:px-20 py-12 max-w-full md:max-w-[55%]'
        >
          { props.title && (
            <h1
              class='text-7xl font-bold m-0 uppercase'
            >
              { props.title }
            </h1>
          )}
          { props.subtitle && (
            <p
              className='pt-10'
            >
              { props.subtitle }
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Hero;