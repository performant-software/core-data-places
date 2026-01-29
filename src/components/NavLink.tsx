import NavItem from '@components/NavItem';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

interface Props {
  active?: boolean;
  content: string;
  href: string
}

const NavLink = ({ active, content, href }: Props) => {
  const isInternalLink = href.startsWith('/');

  return (
    <a
      className='flex p-y-4 justify-center gap-2 items-center'
      href={href}
      target={isInternalLink ? '_self' : '_blank'}
      rel={isInternalLink ? 'noopener noreferrer' : undefined}
    >
      <NavItem
        active={active}
        content={content}
      />
      {!isInternalLink && (
        <ArrowTopRightOnSquareIcon
          height={16}
          width={16}
        />
      )}
    </a>
  )
};

export default NavLink;