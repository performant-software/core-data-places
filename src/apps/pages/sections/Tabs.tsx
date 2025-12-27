import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import React, { useMemo } from 'react';
import _ from 'underscore';
import parse from 'html-react-parser';

interface TabsProps {
  tabs: any[];
  children: any[];
}


const Tabs = (props: TabsProps) => {
  const { tabs, children } = props;

  const parsedChildren = useMemo(() => {
    return React.Children.map(children, (child) => (
      parse(child.props.value)
    ))
  }, [props.children]);

  return (
    <TabGroup>
      <div className='border-b border-gray-200'>
        <TabList aria-label='Tabs' className='-mb-px flex'>
          {
            _.map(tabs, (tab) => ( 
              <Tab
                className='whitespace-nowrap border-b-2 px-8 py-4 text-sm font-medium border-transparent text-gray-500 data-hover:border-secondary/60 data-hover:text-secondary/60 cursor-pointer data-selected:border-secondary data-selected:text-secondary'
                key={tab.label}
              >
                { tab.label }
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