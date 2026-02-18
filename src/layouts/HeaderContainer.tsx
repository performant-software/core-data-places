import { useStore } from '@nanostores/react';
import PagesStore from '@store/pages';
import clsx from 'clsx';

const HeaderContainer = (props) => {
  const { transparent } = useStore(PagesStore);

  return (
    <div
      className={clsx(
        'flex flex-row justify-center w-full z-10 text-text-primary h-[72px]',
        { 'bg-primary': !transparent }
      )}
    >
      { props.children }
    </div>
  );
};

export default HeaderContainer;