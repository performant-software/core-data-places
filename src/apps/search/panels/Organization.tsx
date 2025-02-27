import BasePanel from '@apps/search/panels/BasePanel';
import OrganizationsService from '@backend/api/organizations';
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
    service={OrganizationsService}
  />
);

export default Organization;
