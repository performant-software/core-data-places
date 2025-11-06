import PropTypes from "prop-types";
import {useMemo} from "react";
import {Pill} from "@performant-software/core-data/ssr";

interface Props {
  attributes: {
    label: string;
    icon: string;
    name: string;
    value: string;
  }[]
  relationships: {
    label: string,
    names: string[]
  }[]
  highlightComponent?: React.FC<any>;
  hit: any;
  tags?: {
    name: string;
    primary?: boolean;
    secondary?: boolean;
    value: string;
  }[]
}

const ListHit = (props: Props) => {
  const relationshipUuids = useMemo(
    () => Object.keys(props.relationships),
    [props.relationships]
  )

  return (
    <div className='flex gap-x-6 p-4 bg-white rounded-md shadow-md'>
      <div className='flex flex-col grow divide-y divide-zinc-900/20'>
        <div>
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
            ? <props.highlightComponent hit={props.hit} className='font-bold text-neutral-950' attribute='name'/>
            : <p className='font-bold text-neutral-950'>{props.hit.name}</p>
          }
        </div>
        {props.attributes.length > 0 && (
          <ul className='grid grid-cols-4 w-full'>
            {props.attributes.map(att => (
              <li
                className='flex flex-col gap-2 py-2'
                key={att.name}
              >
                <p className='uppercase text-black/50 text-xs'>{att.label}</p>
                {props.highlightComponent
                  ? <props.highlightComponent className='font-semibold text-sm' hit={props.hit} attribute={att.name}/>
                  : <span className='font-semibold text-sm'>{att.value}</span>
                }
              </li>
            ))}
          </ul>
        )}
        {relationshipUuids.length > 0 && (
          <ul className='grid grid-cols-4 w-full'>
            {relationshipUuids.map(uuid => (
              <li
                className='flex items-center gap-2 py-2 text-[13px]'
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
          className='object-cover w-[140px] h-[115px]'
          src={props.hit.thumbnail}
        />
      )}
    </div>
  )
}

ListHit.propTypes = {
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
}

export default ListHit;