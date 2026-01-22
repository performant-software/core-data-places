import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Pill } from '@performant-software/core-data/ssr';
import { HitComponentProps } from '@types';

interface Props extends HitComponentProps {
  labels: {
    tags: string
  }
}

const ListHit = (props: Props) => {
  const relationshipUuids = useMemo(
    () => Object.keys(props.relationships),
    [props.relationships]
  );

  return (
    <div className='flex gap-x-6 p-4 bg-white rounded-md shadow-xs hover:shadow-md'>
      <div className='flex flex-col grow divide-y divide-zinc-900/20'>
        <div className='pb-2'>
          {props.highlightComponent
            ? <props.highlightComponent hit={props.hit} className='font-bold text-neutral-950' attribute='name'/>
            : <p className='font-bold text-neutral-950'>{props.hit.name}</p>
          }
        </div>
        {(props.attributes.length > 0 || props.tags.length > 0) && (
          <div className='py-2'>
            {props.attributes.length > 0 && (
              <ul className='grid grid-cols-4 w-full'>
                {props.attributes.map(att => (
                  <li
                    className='flex gap-2 items-center'
                    key={att.name}
                  >
                    <p className='uppercase text-black/50 text-xs font-semibold'>{att.label}</p>
                    {props.highlightComponent
                      ? <props.highlightComponent className='font-semibold text-sm' hit={props.hit} attribute={att.name}/>
                      : <span className='font-semibold text-sm'>{att.value}</span>
                    }
                  </li>
                ))}
              </ul>
            )}
            {props.tags.length > 0 && (
              <li className='flex items-center gap-2 w-full'>
                <span className="text-xs font-semibold text-black/50 uppercase">{props.labels.tags}</span>
                {props.tags?.map(tg => (
                  <Pill
                    primary={tg.primary}
                    secondary={tg.secondary}
                    key={tg.name}
                    label={tg.value}
                    className='text-xs rounded-[5px]! px-2! py-1!'
                  />
                ))}
              </li>
            )}
          </div>
        )}
        {relationshipUuids.length > 0 && (
          <ul className='grid grid-cols-4 w-full pt-2'>
            {relationshipUuids.map(uuid => (
              <li
                className='flex items-center gap-2 text-[13px]'
                key={uuid}
              >
                <span className='italic'>{props.relationships[uuid].label}</span>
                <span>{props.relationships[uuid].items.length}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {props.hit.thumbnail && (
        <img
          alt={props.hit.name}
          className='object-cover w-[140px] h-[115px]'
          src={props.hit.thumbnail}
        />
      )}
    </div>
  )
};

ListHit.propTypes = {
  attributes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    icon: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
  })),
  highlightComponent: PropTypes.func,
  hit: PropTypes.object,
  labels: PropTypes.shape({
    tags: PropTypes.string.isRequired
  }),
  tags: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    value: PropTypes.string,
  }))
};

export default ListHit;