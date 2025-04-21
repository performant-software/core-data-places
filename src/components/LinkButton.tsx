import clsx from 'clsx';

interface Props {
  className?: string;
  content: JSX.Element | string;
  href: string;
}

const LinkButton = ({ className, content, href, ...props }: Props) => (
  <a
    class={clsx(
      'inline-block mt-4 rounded-md px-6 py-3 hover:bg-opacity-95 cursor-pointer',
      className
    )}
    href={href}
    {...props}
  >
    { content }
  </a>
);

export default LinkButton;