import BasePanel from '@apps/search/panels/BasePanel';
import WorksService from '@backend/api/works';
import React from 'react';

interface Props {
  className?: string;
}

const Work = (props: Props) => (
  <BasePanel
    className={props.className}
    name='work'
    service={WorksService}
  />
);

export default Work;
