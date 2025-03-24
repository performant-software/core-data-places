import BasePanel from '@apps/search/panels/BasePanel';
import WorksService from '@backend/api/works';
import { useRuntimeConfig } from '@peripleo/peripleo';
import React from 'react';

interface Props {
  className?: string;
}

const Work = (props: Props) => {
  const config = useRuntimeConfig();

  return (
    <BasePanel
      className={props.className}
      name='work'
      exclusions={config.result_filtering?.works?.exclude}
      service={WorksService}
    />
  );
}

export default Work;
