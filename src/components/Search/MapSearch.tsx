import { useEffect, useState } from "react";
import { PlaceDetailsPanel } from "@performant-software/core-data";
import CoreDataPlace from "../CoreDataPlace";
import PlaceDetail from "../PlaceDetail";

export interface MapSearchProps {
    placeId: string;
}
// note: this will change once we have the multiplace map component!

const MapSearch = (props: MapSearchProps) => {
    return (
        <div className="flex flex-row w-full h-screen">
            <div className="bg-white w-1/4">
                <PlaceDetail
                    placeId={props.placeId}
                    onClose={() => console.log(close)}
                />
            </div>
            <div className="w-3/4 h-full">
                <CoreDataPlace
                    // mapStyle={`https://api.maptiler.com/maps/dataviz/style.json?key=${import.meta.env.PUBLIC_REACT_APP_MAP_TILER_KEY}`}
                    placeURIs={[`${import.meta.env.PUBLIC_CORE_DATA_API_URL}/${props.placeId}?project_ids=${import.meta.env.PUBLIC_CORE_DATA_PROJECT_ID}`]}
                />        
            </div>
        </div>
    )

};

export default MapSearch;