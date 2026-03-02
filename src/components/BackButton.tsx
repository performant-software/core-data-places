import { Icon } from '@performant-software/core-data/ssr';
import clsx from 'clsx';
import { useCallback } from 'react';

interface Props {
  className?: string;
  size?: number;
}

const BackButton = (props: Props) => {
  const onClick = useCallback(() => {
    window.location.href = document.referrer;
  }, []);

  return (
    <button
      className={clsx(
        'rounded-full w-8 h-8 flex items-center justify-center',
        props.className
      )}
      onClick={onClick}
      role='button'
    >
      <Icon
        name='left_arrow'
        size={props.size || 30}
      />
    </button>
  );
};

export default BackButton;