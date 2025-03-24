import BasePanel from '@apps/search/panels/BasePanel';
import OrganizationsService from '@backend/api/organizations';
import { useRuntimeConfig } from '@peripleo/peripleo';
import React from 'react';

interface Props {
  className?: string;
}

const Organization = (props: Props) => {
  const config = useRuntimeConfig();

  return (
    <BasePanel
      className={props.className}
      icon='participants'
      name='organization'
      exclusions={config.result_filtering?.organizations?.exclude}
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
}

export default Organization;
