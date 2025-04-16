import NavItem from '@components/NavItem';
import NavLink from '@components/NavLink';
import { Icon } from '@performant-software/core-data';
import clsx from 'clsx';
import { DropdownMenu } from 'radix-ui';
import _ from 'underscore';

interface Item {
  active?: boolean;
  href: string;
  label: string;
  name: string;
}

interface Props {
  active?: boolean;
  content: string;
  items: Array<Item>;
}

const NavDropdown = (props: Props) => {
  /**
   * If the items array only contains a single option, render a NavLink.
   */
  if (props.items?.length === 1) {
    const [item,] = props.items;

    return (
      <NavLink
        active={props.active}
        content={props.content}
        href={item.href}
      />
    );
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        asChild
      >
        <div
          className='flex items-center gap-x-2 cursor-pointer outline-none hover:bg-transparent'
        >
          <NavItem
            active={props.active}
            content={props.content}
          />
          <Icon
            name='down'
          />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={`
            flex 
            flex-col 
            mt-1
            rounded-md 
            bg-white 
            text-base
            text-black
            shadow-lg 
            ring-1 
            ring-black/5 
            focus:outline-none 
            sm:text-sm 
            z-10
            py-3
          `}
          sideOffset={5}
        >
          { _.map(props.items, (item, index) => (
            <DropdownMenu.Item
              className={clsx(
                'py-2 hover:bg-neutral-100 outline-none',
                { 'bg-neutral-100': item.active }
              )}
              key={index}
            >
              <a
                key={item.name}
                href={item.href}
              >
                <span
                  className='relative cursor-pointer select-none py-3 px-6'
                >
                  { item.label }
                </span>
              </a>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default NavDropdown;