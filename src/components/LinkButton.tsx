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
  target?: string;
  text?: string;
}

const LinkButton = (props: Props) => {
  const {
    arrow,
    border,
    color,
    className,
    content,
    href,
    text,
    ...rest
  } = props;

  return (
    <a
      className={clsx(
        'link-button inline-flex mt-4 rounded-md hover:bg-opacity-95 cursor-pointer flex-row gap-4 items-center no-underline',
        'px-6 py-3 hover:bg-[linear-gradient(rgba(0,0,0,0.15),rgba(0,0,0,0.15))] transition duration-300 focus:outline-none hover:no-underline',
        { 'focus:shadow-[0_1px_2px_0_rgba(0,0,0,0.05),0_0_0_2px_var(--color-layout),0_0_0_4px_var(--color-secondary)]': color },
        toTextClass(text),
        toBackgroundClass(color),
        toBorderClass(border),
        className
      )}
      href={href}
      {...rest}
    >
      { content }
      { arrow && (
        <ArrowRightIcon
          height={24}
          width={24}
        />
      ) }
    </a>
  );
};



export default LinkButton;