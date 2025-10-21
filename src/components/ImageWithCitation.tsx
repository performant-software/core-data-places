interface ImageWithCitationProps {
  alt?: string;
  citation?: string;
  citationLink?: string;
  classNames?: {
    root?: string;
    image?: string;
    citation?: string;
  };
  src: string;
}

const ImageWithCitation = (props: ImageWithCitationProps) => {
  const { alt, citation, citationLink, classNames, src } = props;
  return citation ? (
    <div className={classNames?.root}>
      <img alt={alt} src={src} className={classNames?.image} />
      {citationLink ? (
        <a href={citationLink} className={classNames?.citation}>
          {citation}
        </a>
      ) : (
        <p className={classNames?.citation}>{citation}</p>
      )}
    </div>
  ) : (
    <img alt={alt} src={src} className={classNames?.image} />
  );
};

export default ImageWithCitation;
