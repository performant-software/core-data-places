import { Icon } from '@performant-software/core-data/ssr';
import clsx from 'clsx';

interface Props {
  className?: string;
  id?: string;
  onClick?(): void;
}

const BackButton = (props: Props) => (
  <button
    className={clsx(
      'rounded-full w-8 h-8 flex items-center justify-center',
      props.className
    )}
    id={props.id}
    onClick={props.onClick}
    role='button'
  >
    <Icon
      name='left_arrow'
      size={30}
    />
  </button>
);

export default BackButton;