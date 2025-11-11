import { Pill } from '@performant-software/core-data/ssr';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { HitComponentProps } from '@types';

const GridHit = (props: HitComponentProps) => {
  const relationshipUuids = useMemo(
    () => Object.keys(props.relationships),
    [props.relationships]
  );

  return (
    <div className='bg-white rounded-md shadow-md w-[275px] flex flex-col divide-zinc-200 divide-y h-full'>
      <div className='px-6 py-3 flex-grow'>
        <div>
          {props.tags?.map(tg => (
            <Pill
              primary={tg.primary}
              secondary={tg.secondary}
              key={tg.name}
              label={tg.value}
              className='text-xs rounded-[5px]! p-0.5!'
            />
          ))}
        </div>
        {props.highlightComponent
          ? <props.highlightComponent hit={props.hit} className='underline font-bold' attribute='name'/>
          : <p className='underline font-bold'>{props.hit.name}</p>
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
      {relationshipUuids.length > 0 && (
        <ul className='px-6 py-3 flex flex-col w-full'>
          {relationshipUuids.map(uuid => (
            <li
              className='flex items-center justify-between gap-2 text-[13px]'
              key={uuid}
            >
              <span className='italic'>{props.relationships[uuid].label}</span>
              <span>{props.relationships[uuid].items.length}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
};

GridHit.propTypes = {
  attributes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    icon: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
  })),
  highlightComponent: PropTypes.func,
  hit: PropTypes.object,
  tags: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    value: PropTypes.string,
  })),
};

export default GridHit;