import { useMemo } from 'react';
import { classNames } from './styles';

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
      className={classNames.root}
    >
      <div
        className={classNames.imageContainer}
      >
        {imageUrl && (
          <img
            alt={alt || ''}
            src={imageUrl}
            className={classNames.image}
            loading='lazy'
            height={256}
            width={384}
          />
        )}
        {!imageUrl && (
          <div
            className={classNames.image}
          />
        )}
        <div
          className={classNames.imageRing}
        />
      </div>
      <div
        className={classNames.infoHeader}
      >
        <time
          dateTime={date}
        >
          {dateString}
        </time>
        {category && (
          <a
            href='#'
            className={classNames.category}
          >
            {category}
          </a>
        )}
      </div>
      <div
        className={classNames.infoMain}
      >
        <h3
          className={classNames.title}
        >
          <a
            href={slug}
          >
            {title}
          </a>
        </h3>
        {blurb && (
          <p
            className={classNames.blurb}
          >
            {blurb}
          </p>
        )}
      </div>
      {labels.byline && (
        <div
          className={classNames.byline}
        >
          <p>
            {labels.byline}
          </p>
        </div>
      )}
      <a
        className={classNames.readMore}
        href={slug}
      >
        {labels.readMore} &rarr;
      </a>
    </article>
  )
}

export default Card;
