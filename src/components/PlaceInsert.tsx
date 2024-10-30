import { isModalOpen, currentPlace } from "../modalStore";
import CoreDataPlace from "./CoreDataPlace";
import { projectIdsApiSuffix } from "../helpers/core-data";
import config from '../../public/config.json';

const PlaceInsert = (props: any) => {
  return (
    <div
      className="flex flex-col gap-y-2 place-content-center mx-auto my-8 w-full"
      data-uuid={props.place.uuid}
      onClick={() => {
        isModalOpen.set(true);
        currentPlace.set(props.place.uuid);
      }}
    >
      <div className="h-[400px] w-3/4 flex mx-auto">
        <CoreDataPlace
          placeURIs={[
            `${config.core_data.url}/core_data/public/v1/places/${props.place.uuid}?${projectIdsApiSuffix}`,
          ]}
          layer={props.place?.layer}
          animate={props.place?.animate}
          buffer={props.place?.buffer}
          mapId={props.place.uuid}
        />
      </div>
      <div className="text-center text-lg place-tile">{props.title}</div>
      <p className="text-center italic text-sm">{props.caption}</p>
    </div>
  );
};

export default PlaceInsert;
