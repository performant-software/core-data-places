import BasePanel from '@apps/search/panels/BasePanel';
import InstancesService from '@backend/api/instances';
import { useRuntimeConfig } from '@peripleo/peripleo';
import React from 'react';

interface Props {
  className?: string;
}

const Instance = (props: Props) => {
  const config = useRuntimeConfig();

  return (
    <BasePanel
      className={props.className}
      name='instance'
      exclusions={config.result_filtering?.instances?.exclude}
      service={InstancesService}
    />
  );
};

export default Instance;
