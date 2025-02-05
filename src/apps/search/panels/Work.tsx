import BasePanel from '@apps/search/panels/BasePanel';
import { useWorksService } from '@performant-software/core-data';
import React from 'react';

const Work = () => (
  <BasePanel
    name='work'
    useServiceHook={useWorksService}
  />
);

export default Work;
