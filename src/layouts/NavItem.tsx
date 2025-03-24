import clsx from 'clsx';

interface Props {
  active?: boolean;
  content: string;
}

const NavItem = (props: Props) => (
  <div
    class={clsx(
      'flex',
      'font-light',
      { 'border-b': props.active }
    )}
  >
    { props.content }
  </div>
);

export default NavItem;
