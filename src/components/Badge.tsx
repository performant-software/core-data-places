import clsx from 'clsx';

interface Props {
  className?: string;
  content: string;
}

const Badge = (props: Props) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center px-1.5 py-1 text-xs font-semibold rounded-full',
        props.className
      )}
    >
      { props.content }
    </span>
  );
};

export default Badge;