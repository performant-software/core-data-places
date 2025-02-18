import BasePanel from '@apps/search/panels/BasePanel';
import { useInstancesService } from '@performant-software/core-data';
import React from 'react';

interface Props {
  className?: string;
}

const Instance = (props: Props) => (
  <BasePanel
    className={props.className}
    name='instance'
    useServiceHook={useInstancesService}
  />
);

export default Instance;
