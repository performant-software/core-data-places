import RecordInsert from "./RecordInsert";
import OrganizationsService from "@backend/api/coreData/organizations";
import { renderOrganization } from "@root/src/utils/models";

const OrganizationInsert = (props: any) => {
  return ( 
    <RecordInsert
      {...props.organization}
      model='organization'
      service={OrganizationsService}
      renderItem={(item) => renderOrganization(item)}
    />
  )
};

export default OrganizationInsert;