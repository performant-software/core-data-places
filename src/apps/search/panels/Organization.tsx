import BasePanel from '@apps/search/panels/BasePanel';
import { useOrganizationsService } from '@performant-software/core-data';
import React from 'react';

const Organization = () => (
  <BasePanel
    name='organization'
    useServiceHook={useOrganizationsService}
  />
);

export default Organization;
