import clsx from 'clsx';

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
      { 'bg-primary': props.color === 'primary' },
      { 'bg-secondary': props.color === 'secondary' },
      { 'bg-white': props.color === 'white' },
      { 'bg-black': props.color === 'black' }
    )}
  />
);

export default Spacer;