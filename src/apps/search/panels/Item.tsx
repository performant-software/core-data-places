import BasePanel from '@apps/search/panels/BasePanel';
import { useItemsService } from '@performant-software/core-data';
import React from 'react';

const Item = () => (
  <BasePanel
    name='item'
    useServiceHook={useItemsService}
  />
);

export default Item;
