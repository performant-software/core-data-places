import { CoreDataContextProvider } from '@performant-software/core-data';
import { useState } from 'react';
import config from '../../public/config.json';
import PlaceDetailModal from './PlaceDetailModal';
import PlacesMap from "./PlacesMap";

const PlaceInsert = (props: any) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <CoreDataContextProvider
      baseUrl={config.core_data.url}
      projectIds={config.core_data.project_ids}
    >
      <div
        className="flex flex-col gap-y-2 place-content-center mx-auto my-8 w-full"
        data-uuid={props.place.uuid}
        onClick={() => setOpen(true)}
      >
        <div className="h-[400px] w-3/4 flex mx-auto">
          <PlacesMap
            layer={props.place?.layer}
            animate={props.place?.animate}
            buffer={props.place?.buffer}
            mapId={props.place.uuid}
            placeIds={[props.place.uuid]}
          />
        </div>
        <div className="text-center text-lg place-tile">{props.title}</div>
        <p className="text-center italic text-sm">{props.caption}</p>
        { open && (
          <PlaceDetailModal
            placeId={props.place.uuid}
            onClose={() => setOpen(false)}
            open
          />
        )}
      </div>
    </CoreDataContextProvider>
  );
};

export default PlaceInsert;
