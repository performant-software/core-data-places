import BasePanel from '@apps/search/panels/BasePanel';
import { useItemsService } from '@performant-software/core-data';
import React from 'react';

interface Props {
  className?: string;
}

const Item = (props: Props) => (
  <BasePanel
    className={props.className}
    name='item'
    useServiceHook={useItemsService}
  />
);

export default Item;
