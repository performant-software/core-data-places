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
import { type AnnotationPage, useCurrentRoute, useNavigate } from '@peripleo/peripleo';
import { X } from 'lucide-react';
import {
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
    maxZoom: 14,
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
        <RelatedItemsList>
          <RelatedItem
            count={mediaCount}
            id='media_contents'
            label={t('relatedMedia')}
            loading={mediaLoading}
          >
            <RelatedMedia
              emptyMessage={t('none')}
              key={uuid}
              onLoad={() => (
                PlacesService.fetchRelatedManifests(uuid)
                  .then(setRelatedMediaCount)
                  .finally(() => setMediaLoading(false))
              )}
            />
          </RelatedItem>
          <RelatedItem
            count={organizationsCount}
            id='organizations'
            key={uuid}
            label={t('relatedOrganizations')}
            loading={organizationsLoading}
          >
            <RelatedOrganizations
              emptyMessage={t('none')}
              onLoad={() => (
                PlacesService.fetchRelatedOrganizations(uuid)
                  .then((resp: AnnotationPage<any>) => setRelatedCount(resp, setOrganizationsCount))
                  .finally(() => setOrganizationsLoading(false))
              )}
            />
          </RelatedItem>
          <RelatedItem
            count={peopleCount}
            id='people'
            label={t('relatedPeople')}
            loading={peopleLoading}
          >
            <RelatedPeople
              emptyMessage={t('none')}
              key={uuid}
              onLoad={() => (
                PlacesService.fetchRelatedPeople(uuid)
                  .then((resp: AnnotationPage<any>) => setRelatedCount(resp, setPeopleCount))
                  .finally(() => setPeopleLoading(false))
              )}
            />
          </RelatedItem>
          <RelatedItem
            count={placesCount}
            id='places'
            label={t('relatedPlaces')}
            loading={placesLoading}
          >
            <RelatedPlaces
              emptyMessage={t('none')}
              key={uuid}
              onLoad={() => (
                PlacesService.fetchRelatedPlaces(uuid)
                  .then((resp: AnnotationPage<any>) => setRelatedCount(resp, setPlacesCount))
                  .finally(() => setPlacesLoading(false))
              )}
            />
          </RelatedItem>
          <RelatedItem
            count={taxonomiesCount}
            id='taxomonies'
            label={t('relatedTaxonomies')}
            loading={taxonomiesLoading}
          >
            <RelatedTaxonomies
              emptyMessage={t('none')}
              key={uuid}
              onLoad={() => (
                PlacesService.fetchRelatedTaxonomies(uuid)
                  .then((resp: AnnotationPage<any>) => setRelatedCount(resp, setTaxonomiesCount))
                  .finally(() => setTaxonomiesLoading(false))
              )}
            />
          </RelatedItem>
        </RelatedItemsList>
      </aside>
      { placeData && (
        <LocationMarkers
          animate
          boundingBoxOptions={bboxOptions}
          data={placeData}
          layerId='current'
        />
      )}
    </>
  );
};

export default Place;