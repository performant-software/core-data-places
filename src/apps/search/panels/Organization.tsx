import BasePanel from '@apps/search/panels/BasePanel';
import OrganizationsService from '@backend/api/organizations';
import React from 'react';
import {useRuntimeConfig} from '@peripleo/peripleo';

interface Props {
  className?: string;
}

const Organization = (props: Props) => {
  const config: any = useRuntimeConfig();

  const exclusions = config.search.result_filtering && config.search.result_filtering.organizations ? config.search.result_filtering.organizations.exclude : [];

  return (
    <BasePanel
      className={props.className}
      icon='participants'
      name='organization'
      exclusions={exclusions}
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
