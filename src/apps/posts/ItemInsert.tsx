import RecordInsert from "./RecordInsert";
import ItemsService from "@backend/api/coreData/items";

const ItemInsert = (props: any) => {
  return ( 
    <RecordInsert
      {...props.item}
      model='item'
      service={ItemsService}
    />
  )
};

export default ItemInsert;