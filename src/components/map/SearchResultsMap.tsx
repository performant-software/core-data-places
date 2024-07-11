import { Map, Zoom } from "@peripleo/maplibre";
import { Controls, Peripleo } from "@peripleo/peripleo";
import { useCachedHits } from "@performant-software/core-data";
import CoreDataPlace from "../CoreDataPlace";


const SearchResultsMap = () => {
    const hits = useCachedHits();
    console.log(hits);
    const urls = hits && hits.map((hit) => (
        `${import.meta.env.PUBLIC_CORE_DATA_API_URL}/${hit.uuid}?project_ids=${import.meta.env.PUBLIC_CORE_DATA_PROJECT_ID}`
    ));
    console.log(urls);
    return (
        <CoreDataPlace
            //mapStyle={`https://api.maptiler.com/maps/dataviz/style.json?key=${import.meta.env.PUBLIC_REACT_APP_MAP_TILER_KEY}`}
            placeURIs={urls}
        />
    )
};

export default SearchResultsMap;