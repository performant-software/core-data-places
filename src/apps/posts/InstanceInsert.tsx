import RecordInsert from "./RecordInsert";
import InstancesService from "@backend/api/coreData/instances";

const InstanceInsert = (props: any) => {
  return ( 
    <RecordInsert
      {...props.record}
      model='instance'
      service={InstancesService}
    />
  )
};

export default InstanceInsert;