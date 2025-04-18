import clsx from 'clsx';

interface Props {
  active?: boolean;
  content: string;
}

const NavItem = (props: Props) => (
  <div
    className={clsx(
      'flex',
      'font-light',
      { 'border-b border-text-primary': props.active }
    )}
  >
    { props.content }
  </div>
);

export default NavItem;
