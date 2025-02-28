import BasePanel from '@apps/search/panels/BasePanel';
import InstancesService from '@backend/api/instances';
import React from 'react';
import {useRuntimeConfig} from '@peripleo/peripleo';

interface Props {
  className?: string;
}

const Instance = (props: Props) => {
  const config: any = useRuntimeConfig();

  const exclusions = config.search.result_filtering && config.search.result_filtering.instances ? config.search.result_filtering.instances.exclude : [];
    return (
    <BasePanel
      className={props.className}
      name='instance'
      exclusions={exclusions}
      service={InstancesService}
    />
  );
};

export default Instance;
