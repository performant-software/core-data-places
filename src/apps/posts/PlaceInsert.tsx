import PlaceDetailModal from '@apps/posts/PlaceDetailModal';
import PlacesMap from '@components/PlacesMap';
import { useSelectionState } from '@peripleo/peripleo';
import { parseFeature } from '@utils/map';
import React, { useMemo } from 'react';

const PlaceInsert = (props: any) => {
  const { selected, setSelected } = useSelectionState();

  /**
   * Memo-izes the properties of the selected feature.
   */
  const place = useMemo(() => parseFeature(selected), [selected]);

  return (
    <div
      className='flex flex-col gap-y-2 my-8 w-full'
    >
      <div
        className='h-[400px] w-3/4 flex w-full'
      >
        <PlacesMap
          layer={props.place?.layer}
          animate={props.place?.animate}
          buffer={props.place?.buffer}
          mapId={props.place.uuid}
          placeIds={[props.place.uuid]}
        />
      </div>
      <div
        className='text-center text-lg place-tile'
      >
        { props.title }
      </div>
      <p
        className='text-center italic text-sm'
      >
        { props.caption }
      </p>
      { place && (
        <PlaceDetailModal
          place={place.properties}
          onClose={() => setSelected(null)}
          open
        />
      )}
    </div>
  );
};

export default PlaceInsert;
