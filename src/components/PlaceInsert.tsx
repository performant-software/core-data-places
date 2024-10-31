import { useState } from 'react';
import CoreDataPlace from "./CoreDataPlace";
import { getPlaceURL } from "../helpers/core-data";
import PlaceDetailModal from './PlaceDetailModal';

const PlaceInsert = (props: any) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div
      className="flex flex-col gap-y-2 place-content-center mx-auto my-8 w-full"
      data-uuid={props.place.uuid}
      onClick={() => setOpen(true)}
    >
      <div className="h-[400px] w-3/4 flex mx-auto">
        <CoreDataPlace
          placeURIs={[getPlaceURL(props.place.uuid)]}
          layer={props.place?.layer}
          animate={props.place?.animate}
          buffer={props.place?.buffer}
          mapId={props.place.uuid}
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
  );
};

export default PlaceInsert;
