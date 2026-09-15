import { useTranslations } from "@i18n/useTranslations";
import RecordInsert from "./RecordInsert";
import EventsService from "@backend/api/coreData/events";
import { renderEvent } from "@root/src/utils/models";

const EventInsert = (props: any) => {
  const { t } = useTranslations();
  return ( 
    <RecordInsert
      {...props.event}
      model='event'
      service={EventsService}
      renderItem={(item) => renderEvent(item, t)}
    />
  )
};

export default EventInsert;