import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import React, { Fragment, useMemo } from 'react';
import _ from 'underscore';
import parse from 'html-react-parser';
import { getClassNames } from './style';

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

  const classNames = useMemo(() => (getClassNames({ raise, activeBg, textStyle, invertText, inactiveBg })), [props]);

  const parsedChildren = useMemo(() => {
    return React.Children.map(children, (child) => (
      parse(child.props.value)
    ))
  }, [props.children]);

  return (
    <TabGroup>
      <div className={classNames.tabGroup}>
        <TabList aria-label='Tabs' className={classNames.tabList}>
          {
            _.map(tabs, (tab: any) => ( 
              <Tab
                as={Fragment}
                key={tab.label}
              >
                {({ selected }) => ( 
                  <button className={classNames.button(selected)}>
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
          _.map(parsedChildren, (child: any, idx: number) => (
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