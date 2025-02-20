import BasePanel from '@apps/search/panels/BasePanel';
import { useOrganizationsService } from '@performant-software/core-data';
import React from 'react';

interface Props {
  className?: string;
}

const Organization = (props: Props) => (
  <BasePanel
    className={props.className}
    icon='participants'
    name='organization'
    renderItem={(organization) => (
      <p
        className='text-sm'
      >
        { organization.description }
      </p>
    )}
    useServiceHook={useOrganizationsService}
  />
);

export default Organization;
