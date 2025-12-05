import clsx from 'clsx';
import { ColorValues } from '@root/tina/content/pages';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface Props {
  arrow?: boolean;
  className?: string;
  color?: string;
  content: JSX.Element | string;
  href: string;
  text?: string;
}

const LinkButton = ({ className, content, href, ...props }: Props) => (
  <a
    className={clsx(
      'inline-flex mt-4 rounded-md px-6 py-3 hover:bg-opacity-95 cursor-pointer flex-row gap-4 items-center no-underline mx-6',
      { 'bg-primary': props.color === ColorValues.primary },
      { 'bg-secondary': props.color === ColorValues.secondary },
      { 'bg-white': props.color === ColorValues.white },
      { 'bg-black': props.color === ColorValues.black },
      { 'text-primary': props.text === ColorValues.primary },
      { 'text-secondary': props.text === ColorValues.secondary },
      { 'text-white': props.text === ColorValues.white },
      { 'text-black': props.text === ColorValues.black },
      className
    )}
    href={href}
    {...props}
  >
    <div>
      { content }
    </div>
    { props.arrow && ( 
      <ArrowRightIcon height={24} width={24} />
    ) }
  </a>
);

export default LinkButton;