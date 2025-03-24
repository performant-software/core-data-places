import BasePanel from '@apps/search/panels/BasePanel';
import ItemsService from '@backend/api/items';
import { useRuntimeConfig } from '@peripleo/peripleo';
import React from 'react';

interface Props {
  className?: string;
}

const Item = (props: Props) => {
  const config = useRuntimeConfig();

  return (
    <BasePanel
      className={props.className}
      name='item'
      exclusions={config.result_filtering?.items?.exclude}
      service={ItemsService}
    />
  );
}

export default Item;
