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
      'w-full flex items-center',
      { 'h-[1px]': props.size === 'none' && !props.thick },
      { 'h-[2px]': props.size === 'none' && props.thick },
      { 'h-3 lg:h-5': props.size === 'xs'},
      { 'h-4 lg:h-8': props.size === 'small' },
      { 'h-8 lg:h-16': props.size === 'medium' },
      { 'h-16 lg:h-24': props.size === 'large' },
    )}
    >
    <div className={clsx(
      'w-full',
      { 'h-[1px]': !!props.color && !props.thick },
      { 'h-[2px]': !!props.color && props.thick },
      toBackgroundClass(props.color)
    )} />
  </div>
);

export default Spacer;