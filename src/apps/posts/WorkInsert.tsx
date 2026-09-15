import RecordInsert from "./RecordInsert";
import WorksService from "@backend/api/coreData/works";

const WorkInsert = (props: any) => {
  return ( 
    <RecordInsert
      {...props.work}
      model='work'
      service={WorksService}
    />
  )
};

export default WorkInsert;