import clsx from 'clsx';
import { toBackgroundClass } from '../utils/pageBuilder';

interface SpacerProps {
  size: string;
  color?: string;
  thick?: boolean;
}

const Spacer = (props: SpacerProps) => (
  <div
    className={clsx(
      'w-full',
      { 'h-[1px]': !!props.color && !props.thick },
      { 'h-[2px]': !!props.color && props.thick },
      { 'my-3 lg:my-5': props.size === 'xs'},
      { 'my-4 lg:my-8': props.size === 'small' },
      { 'my-8 lg:my-16': props.size === 'medium' },
      { 'my-16 lg:my-24': props.size === 'large' },
      toBackgroundClass(props.color)
    )}
  />
);

export default Spacer;