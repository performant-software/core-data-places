import PropTypes from 'prop-types';
import { HitComponentProps } from '@types';

const ImageHit = (props: HitComponentProps) => {
  return (
    <div className='bg-white rounded-md shadow-md overflow-hidden flex flex-col divide-zinc-200 divide-y h-auto'>
      {props.hit.thumbnail && (
        <img
          alt={props.hit.name}
          className='object-cover w-full'
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
              className='flex items-center gap-2 text-sm'
              key={att.name}
            >
              <span className='uppercase text-black/50 text-xs'>{att.label}</span>
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
    label: PropTypes.string,
    icon: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
  })),
  highlightComponent: PropTypes.func,
  hit: PropTypes.object
};

export default ImageHit;