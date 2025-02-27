import BasePanel from '@apps/search/panels/BasePanel';
import InstancesService from '@backend/api/instances';
import React from 'react';

interface Props {
  className?: string;
}

const Instance = (props: Props) => (
  <BasePanel
    className={props.className}
    name='instance'
    service={InstancesService}
  />
);

export default Instance;
