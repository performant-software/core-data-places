import BasePanel from '@apps/search/panels/BasePanel';
import { useInstancesService } from '@performant-software/core-data';
import React from 'react';

const Instance = () => (
  <BasePanel
    name='instance'
    useServiceHook={useInstancesService}
  />
);

export default Instance;
