import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import React, { Fragment, useMemo } from 'react';
import _ from 'underscore';
import parse from 'html-react-parser';
import clsx from 'clsx';
import { toBackgroundClass } from '@root/src/utils/pageBuilder';

interface TabsProps {
  tabs: any[];
  children: any[];
  raise?: boolean;
  activeBg?: string;
  textStyle?: string;
  invertText?: boolean;
  inactiveBg?: string;
}


const Tabs = (props: TabsProps) => {
  const { tabs, children, raise, activeBg, textStyle, invertText, inactiveBg } = props;

  const activeBgClass = useMemo(() => activeBg && toBackgroundClass(activeBg), [activeBg]);

  const inactiveBgClass = useMemo(() => inactiveBg && toBackgroundClass(inactiveBg), [inactiveBg]);

  const parsedChildren = useMemo(() => {
    return React.Children.map(children, (child) => (
      parse(child.props.value)
    ))
  }, [props.children]);

  return (
    <TabGroup>
      <div className={clsx(
        'px-6 sm:px-12 md:px-16 lg:px-32 2xl:mx-auto max-w-(--breakpoint-2xl)',
      )}>
        <TabList aria-label='Tabs' className={clsx(
          '-mb-px flex h-[65px] overflow-x-auto relative z-30',       
          { 'border-b-2': !raise }
        )}>
          {
            _.map(tabs, (tab) => ( 
              <Tab
                as={Fragment}
                key={tab.label}
              >
                {({ hover, selected }) => ( 
                  <button className={clsx(
                    'lg:whitespace-nowrap px-3 lg:px-6 xl:px-8 py-4 focus:outline-none',
                    { '-mb-[2px] border-b-2': !raise },
                    selected && activeBgClass,
                    !selected && inactiveBgClass,
                    (!selected || !activeBgClass) && raise && invertText && 'text-text-inverse',
                    { 'border-secondary/60 border-b-2 text-secondary/60': hover && !raise },
                    { 'border-secondary border-b-2 text-secondary': selected && !raise },
                    { 'cursor-default': selected },
                    { 'font-serif italic sm:text-lg lg:text-xl font-normal': textStyle === 'italic' },
                    { 'text-sm text-gray-500 uppercase font-medium': textStyle === 'uppercase' }
                  )}>
                    { tab.label }
                  </button>
                )}
              </Tab>
            ))
          }
        </TabList>
      </div>
      <TabPanels>
        {
          _.map(parsedChildren, (child, idx) => (
              <TabPanel key={tabs[idx]?.label}>
                { child }
              </TabPanel>
            )
          )
        }
      </TabPanels>
    </TabGroup>
  )
}

export default Tabs;