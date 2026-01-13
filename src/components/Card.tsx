import { useMemo } from 'react';

interface Props {
  alt?: string;
  date?: string;
  dateOptions?: Intl.DateTimeFormatOptions;
  category?: string;
  title: string;
  slug: string;
  imageUrl?: string;
  blurb?: string;
  labels: {
    byline: string;
    readMore: string;
  }
}

const Card = (props: Props) => {
  const { alt, category, date, dateOptions, title, slug, imageUrl, blurb, labels } = props;

  const dateString = useMemo(
    () => date ? new Date(date).toLocaleDateString(undefined, dateOptions) : null,
    [date]
  );

  return (
    <article
      className='flex max-w-xl flex-col items-start justify-between bg-neutral-light'
    >
      <div
        className='relative w-full'
      >
        {imageUrl && (
          <img
            alt={alt || ''}
            src={imageUrl}
            className='aspect-[16/9] w-full bg-neutral-light object-cover sm:aspect-[2/1] lg:aspect-[3/2]'
            loading='lazy'
            height={256}
            width={384}
          />
        )}
        {!imageUrl && (
          <div
            className='aspect-[16/9] w-full bg-neutral-light object-cover sm:aspect-[2/1] lg:aspect-[3/2]'
          />
        )}
        <div
          className='absolute inset-0 ring-1 ring-inset ring-gray-900/10'
        />
      </div>
      <div
        className='flex items-center gap-x-4 text-xs p-2'
      >
        <time
          dateTime={date}
          className='text-gray-500'
        >
          {dateString}
        </time>
        {category && (
          <a
            href='#'
            className='relative z-10 rounded-full bg-gray-200 px-3 py-1.5 font-medium text-gray-600 hover:bg-white'
          >
            {category}
          </a>
        )}
      </div>
      <div
        className='group relative p-6'
      >
        <h3
          className='mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600'
        >
          <a
            href={slug}
          >
        <span
          className='absolute inset-0'
        />
            {title}
          </a>
        </h3>
        {blurb && (
          <p
            className='mt-5 line-clamp-3 text-sm leading-6 text-gray-600'
          >
            {blurb}
          </p>
        )}
      </div>
      {labels.byline && (
        <div
          className='relative mt-8 flex items-center gap-x-4 p-6'
        >
          <div
            className='text-sm leading-6'
          >
            <p
              className='font-semibold text-gray-900'
            >
              {labels.byline}
            </p>
          </div>
        </div>
      )}
      <a
        className='flex justify-end p-8 w-full'
        href={slug}
      >
        {labels.readMore} &rarr;
      </a>
    </article>
  )
}

export default Card;
