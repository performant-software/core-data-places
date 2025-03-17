import BasePanel from '@apps/search/panels/BasePanel';
import ItemsService from '@backend/api/items';
import React from 'react';
import {useRuntimeConfig} from '@peripleo/peripleo';

interface Props {
  className?: string;
}

const Item = (props: Props) => {
  const config: any = useRuntimeConfig();

  const exclusions = config.search.result_filtering && config.search.result_filtering.items ? config.search.result_filtering.items.exclude : [];

  return (
    <BasePanel
      className={props.className}
      name='item'
      exclusions={exclusions}
      service={ItemsService}
    />
  );
}

export default Item;
