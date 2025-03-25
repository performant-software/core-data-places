import NavItem from '@layouts/NavItem';

interface Props {
  active?: boolean;
  content: string;
  href: string
}

const NavLink = ({ active, content, href }: Props) => (
  <a
    className='flex flex-col p-y-4 justify-center'
    href={href}
  >
    <NavItem
      active={active}
      content={content}
    />
  </a>
);

export default NavLink;