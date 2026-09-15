import RecordInsert from "./RecordInsert";
import InstancesService from "@backend/api/coreData/instances";

const InstanceInsert = (props: any) => {
  return ( 
    <RecordInsert
      {...props.instance}
      model='instance'
      service={InstancesService}
    />
  )
};

export default InstanceInsert;