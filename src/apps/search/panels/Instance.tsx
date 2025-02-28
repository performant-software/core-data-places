import BasePanel from '@apps/search/panels/BasePanel';
import InstancesService from '@backend/api/instances';
import React from 'react';
import {useRuntimeConfig} from '@peripleo/peripleo';

interface Props {
  className?: string;
}

const Instance = (props: Props) => (
  <BasePanel
    className={props.className}
    name='instance'
    exclusions={exclusions}
    service={InstancesService}
  />
);

};

export default Instance;
