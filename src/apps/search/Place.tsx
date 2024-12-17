import RelatedRecords from '@apps/search/RelatedRecords';
import TranslationContext from '@apps/search/TranslationContext';
import {
  CoreData as CoreDataUtils,
  PlaceDetails,
  PlaceLayersSelector,
  RelatedItem,
  RelatedItemsList,
  RelatedMedia,
  RelatedOrganizations,
  RelatedPeople,
  RelatedPlaces,
  RelatedTaxonomies,
  usePlacesService,
} from '@performant-software/core-data';
import { LocationMarkers } from '@performant-software/geospatial';
import { type AnnotationPage, useCurrentRoute, useNavigate, useRuntimeConfig } from '@peripleo/peripleo';
import { X } from 'lucide-react';
import React, {
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import _ from 'underscore';
import './Place.css';

type CallbackFunction = (count: number) => void;

type Place = {
  place_layers: Array<any>;
};

const Place = () => {
  const config = useRuntimeConfig<any>();
  const [place, setPlace] = useState<Place>();

  const [mediaLoading, setMediaLoading] = useState<boolean>(true);
  const [organizationsLoading, setOrganizationsLoading] = useState<boolean>(true);
  const [peopleLoading, setPeopleLoading] = useState<boolean>(true);
  const [placesLoading, setPlacesLoading] = useState<boolean>(true);
  const [taxonomiesLoading, setTaxonomiesLoading] = useState<boolean>(true);

  const [mediaCount, setMediaCount] = useState<number>();
  const [organizationsCount, setOrganizationsCount] = useState<number>();
  const [peopleCount, setPeopleCount] = useState<number>();
  const [placesCount, setPlacesCount] = useState<number>();
  const [taxonomiesCount, setTaxonomiesCount] = useState<number>();

  const route = useCurrentRoute();
  const navigate = useNavigate();

  const PlacesService = usePlacesService();
  const { t } = useContext(TranslationContext);

  const bboxOptions = {
    padding: {
      top: 100,
      bottom: 100,
      left: 380,
      right: 120,
    },
    maxZoom: config.search.max_zoom || 14,
  };

  /**
   * Parses the UUID from the route.
   */
  const [, uuid] = useMemo(() => route.split('/').filter(Boolean), [route]);

  /**
   * Sets the place feature based on the current place.
   */
  const placeData = useMemo(() => place && CoreDataUtils.toFeature(place), [place]);

  /**
   * Sets the count of records returned from the passed response.
   */
  const setRelatedCount = useCallback((response: any, callback: CallbackFunction) => {
    const { count } = response.list || {};
    callback(count);

    return response;
  }, []);

  /**
   * Sets the count of media records returned from the passed response.
   */
  const setRelatedMediaCount = useCallback((response: AnnotationPage<any>) => {
    const count = _.reduce(_.pluck(response.items, 'item_count'), (memo, num) => memo + num) || 0;
    setMediaCount(count);

    return response;
  }, []);

  return (
    <>
      <aside
        className='place flex flex-col absolute z-10 h-full w-[350px] bg-white/80 backdrop-blur shadow overflow-y-auto'
      >
        <button
          aria-label='Close'
          className='absolute top-2 right-2 p-1.5 rounded-full z-10 bg-slate-200/60 hover:bg-slate-200 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700'
          onClick={() => navigate('/')}
          type='button'
        >
          <X
            className='h-4 w-4'
          />
        </button>
        <PlaceDetails
          id={uuid}
          key={uuid}
          onLoad={setPlace}
        />
        {!_.isEmpty(place?.place_layers) && (
          <PlaceLayersSelector
            className='place-layers-selector'
            label={t('mapLayers')}
            layers={place.place_layers}
          />
        )}
        <RelatedRecords
          key={uuid}
          onLoadMedia={() => PlacesService.fetchRelatedManifests(uuid)}
          onLoadOrganizations={() => PlacesService.fetchRelatedOrganizations(uuid)}
          onLoadPeople={() => PlacesService.fetchRelatedPeople(uuid)}
          onLoadPlaces={() => PlacesService.fetchRelatedPlaces(uuid)}
          onLoadTaxonomies={() => PlacesService.fetchRelatedTaxonomies(uuid)}
        />
      </aside>
      { placeData && (
        <LocationMarkers
          animate
          boundingBoxOptions={bboxOptions}
          fitBoundingBox={Object.hasOwn(config.search, "zoom_to_place") ? config.search.zoom_to_place : true}
          data={placeData}
          layerId='current'
        />
      )}
    </>
  );
};

export default Place;