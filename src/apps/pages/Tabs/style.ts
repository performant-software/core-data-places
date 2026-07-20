import clsx from "clsx";
import { toBackgroundClass } from '@utils/pageBuilder';

export const getClassNames = (options: any) => {
  const { raise } = options;
  return ({
    tabGroup: 'px-6 sm:px-12 md:px-16 lg:px-32 2xl:mx-auto max-w-(--breakpoint-2xl) overflow-x-auto overflow-y-visible',
    tabList: clsx(
        'flex min-h-[65px] relative z-30',       
        { 'w-full border-b-4 h-[65px]': !raise }
      ),
    button: (active: boolean) => getButtonClass({...options, active}),
    tabContent: 'tab-content flex flex-col'
  })
}

const getButtonClass = (options: any) => {
  const { active, activeBg, inactiveBg, invertText, raise, textStyle } = options;
  return (clsx(
    'tab-button',
    'lg:whitespace-nowrap px-3 lg:px-6 xl:px-8 py-4 focus:outline-none',
    { '-mb-[4px] border-b-4': !raise },
    active && toBackgroundClass(activeBg),
    !active&& toBackgroundClass(inactiveBg),
    (!active || !toBackgroundClass(activeBg)) && raise && invertText && 'text-text-inverse',
    { 'hover:border-secondary/60 border-b-4 hover:text-secondary/60': !raise },
    { 'border-secondary border-b-4 text-secondary': active && !raise },
    { 'cursor-default': active },
    { 'font-serif italic sm:text-lg lg:text-xl font-normal': textStyle === 'italic' },
    { 'text-sm text-gray-500 uppercase font-medium': textStyle === 'uppercase' }
  ))
};