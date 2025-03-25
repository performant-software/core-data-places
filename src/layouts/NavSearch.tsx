import NavLink from '@layouts/NavLink';
import { Icon } from '@performant-software/core-data';
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import NavItem from '@layouts/NavItem';
import clsx from 'clsx';
import { Fragment } from 'react';
import _ from 'underscore';

const NavSearch = (props) => {
  console.log(props.items);

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
    <Popover
      className='flex flex-col justify-center'
    >
      <PopoverButton
        as='div'
        className='flex items-center gap-x-2 cursor-pointer'
      >
        <NavItem
          active={props.active}
          content={props.content}
        />
        <Icon
          name='down'
        />
      </PopoverButton>
      <Transition
        as={Fragment}
        leave='transition ease-in duration-100'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        <PopoverPanel
          anchor='bottom'
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
        >
          { _.map(props.items, (item, index) => (
            <a
              className={clsx(
                'py-2 hover:bg-neutral-100',
                { 'bg-neutral-100': item.active }
              )}
              key={item.name}
              href={item.href}
            >
              <span
                className='relative cursor-pointer select-none py-3 px-6'
              >
                { item.label || `Index ${index}` }
              </span>
            </a>
          ))}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
};

export default NavSearch;