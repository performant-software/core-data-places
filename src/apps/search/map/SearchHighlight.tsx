import { Icon } from '@performant-software/core-data';
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

const SearchHighlight = (props: Props) => (
  <div
    className={clsx('flex gap-x-0.5 items-center', props.classNames?.root)}
  >
    { props.icon && (
      <Icon
        name={props.icon}
      />
    )}
    <Highlight
      attribute={props.attribute}
      className={props.classNames?.highlight}
      hit={props.hit}
    />
  </div>
);

export default SearchHighlight;