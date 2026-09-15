import { getNameView } from "@root/src/utils/people";
import RecordInsert from "./RecordInsert";
import PeopleService from "@backend/api/coreData/people";

const PersonInsert = (props: any) => {
  return ( 
    <RecordInsert
      {...props.person}
      model='person'
      service={PeopleService}
      renderName={getNameView}
    />
  )
};

export default PersonInsert;