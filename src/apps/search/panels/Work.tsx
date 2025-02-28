import BasePanel from '@apps/search/panels/BasePanel';
import WorksService from '@backend/api/works';
import React from 'react';
import {useRuntimeConfig} from '@peripleo/peripleo';

interface Props {
  className?: string;
}

const Work = (props: Props) => {
  const config: any = useRuntimeConfig();

  const exclusions = config.search.result_filtering && config.search.result_filtering.works ? config.search.result_filtering.works.exclude : [];

  return (
    <BasePanel
      className={props.className}
      name='work'
      exclusions={exclusions}
      service={WorksService}
    />
  );
}

export default Work;
