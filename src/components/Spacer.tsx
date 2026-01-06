import clsx from 'clsx';
import { toBackgroundClass } from '../utils/pageBuilder';

interface SpacerProps {
  size: string;
  color?: string;
}

const Spacer = (props: SpacerProps) => (
  <div
    className={clsx(
      'w-full',
      { 'h-[2px]': !!props.color },
      { 'my-4 lg:my-8': props.size === 'small' },
      { 'my-8 lg:my-16': props.size === 'medium' },
      { 'my-16 lg:my-32': props.size === 'large' },
      toBackgroundClass(props.color)
    )}
  />
);

export default Spacer;