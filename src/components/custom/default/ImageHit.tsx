import PropTypes from 'prop-types';
import { HitComponentProps } from '@types';
import clsx from 'clsx';

const ImageHit = (props: HitComponentProps) => {
  return (
    <div className={clsx(
      'bg-white rounded-md shadow-xs hover:shadow-md overflow-hidden flex flex-col divide-zinc-200 divide-y h-auto',
      { 'cursor-pointer': props.hit.thumbnail }
    )} onClick={() => {
      if (props.hit.thumbnail) {
        props.setManifestUrl(props.hit.thumbnail?.replace('/thumbnail', '/manifest')); //this is a hack since it looks like we're not storing the manifest URL in typesense? 
      }
    }}>
      {props.hit.thumbnail && (
        <img
          alt={props.hit.name}
          className='object-cover w-full h-[350px]'
          src={props.hit.thumbnail}
        />
      )}
      <div className='px-6 py-2 flex-grow'>
        {props.highlightComponent
          ? <props.highlightComponent hit={props.hit} className='font-medium line-clamp-2' attribute='name'/>
          : <p className='font-medium text-wrap line-clamp-2'>{props.hit.name}</p>
        }
      </div>
      {props.attributes.length > 0 && (
        <ul className='px-6 py-3 flex flex-col w-full gap-y-2'>
          {props.attributes.map(att => (
            <li
              className='italic text-sm'
              key={att.name}
            >
              {props.highlightComponent
                ? <props.highlightComponent hit={props.hit} attribute={att.name}/>
                : <span>{att.value}</span>
              }
            </li>
          ))}
        </ul>
      )}
    </div>
  )
};

ImageHit.propTypes = {
  attributes: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
  })),
  highlightComponent: PropTypes.func,
  hit: PropTypes.object
};

export default ImageHit;