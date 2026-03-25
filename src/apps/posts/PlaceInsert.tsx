import PlaceDetailModal from '@apps/posts/PlaceDetailModal';
import PlacesMap from '@components/PlacesMap';
import { useSelectionState } from '@peripleo/peripleo';
import { parseFeature } from '@utils/map';
import React, { useMemo } from 'react';

const PlaceInsert = (props: any) => {
  const { selection, setSelection } = useSelectionState();

  if (!props.place) {
    return null;
  }

  /**
   * Memo-izes the properties of the selected feature.
   */
  const place = useMemo(() => parseFeature(selection), [selection]);

  return (
    <div
      className='flex flex-col gap-y-2 my-8 w-full'
    >
      <div
        className='h-[400px] w-full lg:w-3/4 flex mx-auto'
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
          onClose={() => setSelection(null)}
          open
        />
      )}
    </div>
  );
};

export default PlaceInsert;
