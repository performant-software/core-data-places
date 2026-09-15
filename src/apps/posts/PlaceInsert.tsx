import RecordInsert from "./RecordInsert";
import PlacesService from "@backend/api/coreData/places";
import { renderPlace } from "@root/src/utils/models";

const PlaceInsert = (props: any) => {
  return ( 
    <RecordInsert
      {...props.place}
      model='place'
      service={PlacesService}
      renderItem={(item) => renderPlace(item)}
    />
  )
};

export default PlaceInsert;
