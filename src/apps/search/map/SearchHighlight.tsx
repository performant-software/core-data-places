import { useSearchConfig } from '@apps/search/SearchConfigContext';
import { Icon } from '@performant-software/core-data';
import { getHitValue } from '@utils/search';
import clsx from 'clsx';
import { Highlight } from 'react-instantsearch';

interface Props {
  attribute: string;
  badge?: boolean;
  classNames?: {
    root?: string,
    highlight?: string
  };
  hit: any;
  icon?: string;
}

const SearchHighlight = (props: Props) => {
  const config = useSearchConfig();

  return (
    <div
      className={clsx('flex gap-x-0.5 items-center', props.classNames?.root)}
    >
      { props.icon && (
        <Icon
          name={props.icon}
        />
      )}
      { config?.static_search
        // Ignore highlighting in static search mode because it's
        // unsupported by items.js
        ? (
          <span
            className={props.classNames?.highlight}
          >
            { getHitValue(props.hit, { name: props.attribute }) }
          </span>
        )
        : (
          <Highlight
            attribute={props.attribute}
            className={props.classNames?.highlight}
            hit={props.hit}
          />
        )}
    </div>
  );
};

export default SearchHighlight;
