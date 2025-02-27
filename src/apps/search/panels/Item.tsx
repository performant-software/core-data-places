import BasePanel from '@apps/search/panels/BasePanel';
import ItemsService from '@backend/api/items';
import React from 'react';

interface Props {
  className?: string;
}

const Item = (props: Props) => (
  <BasePanel
    className={props.className}
    name='item'
    service={ItemsService}
  />
);

export default Item;
