import BasePanel from '@apps/search/panels/BasePanel';
import { useWorksService } from '@performant-software/core-data';
import React from 'react';

interface Props {
  className?: string;
}

const Work = (props: Props) => (
  <BasePanel
    className={props.className}
    name='work'
    useServiceHook={useWorksService}
  />
);

export default Work;
