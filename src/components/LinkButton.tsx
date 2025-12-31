import clsx from 'clsx';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { toBackgroundClass, toBorderClass, toTextClass } from '@utils/pageBuilder';

interface Props {
  arrow?: boolean;
  border?: string;
  className?: string;
  color?: string;
  content: JSX.Element | string;
  href: string;
  text?: string;
}

const LinkButton = ({ className, content, href, ...props }: Props) => (
  <a
    className={clsx(
      'link-button inline-flex mt-4 rounded-md px-6 py-3 hover:bg-opacity-95 cursor-pointer flex-row gap-4 items-center no-underline',
      'hover:bg-[linear-gradient(rgba(0,0,0,0.15),rgba(0,0,0,0.15))] transition duration-300',
      'focus:outline-none',
      props.color && 'focus:shadow-[0_1px_2px_0_rgba(0,0,0,0.05),0_0_0_2px_var(--color-layout),0_0_0_4px_var(--color-secondary)]',
      { 'hover:underline hover:underline-offset-[6px] hover:decoration-2': !props.color && !props.border },
      toBackgroundClass(props.color),
      toTextClass(props.text),
      toBorderClass(props.border),
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