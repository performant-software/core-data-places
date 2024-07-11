import {
  CoreData as CoreDataUtils,
  PlaceDetails,
  PlaceLayersSelector,
  PlacesService,
  RelatedItem,
  RelatedItemsList,
  RelatedMedia,
  RelatedOrganizations,
  RelatedPeople,
  RelatedPlaces,
  RelatedTaxonomies
} from '@performant-software/core-data';
import { LocationMarkers } from '@performant-software/geospatial';
import { type AnnotationPage, useCurrentRoute, useNavigate } from '@peripleo/peripleo';
import { X } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'underscore';
import '../../styles/Place.css';

type CallbackFunction = (count: number) => void;

type Place = {
  place_layers: Array<any>
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

  const bboxOptions = {
    padding: {
      top: 100,
      bottom: 100,
      left: 380,
      right: 120
    },
    maxZoom: 14
  };

  /**
   * Parses the UUID from the route.
   */
  const [, uuid] = useMemo(() => route.split('/').filter(Boolean), [route]);

  /**
   * Sets the place feature based on the current place.
   */
  const placeData = useMemo(() => place && CoreDataUtils.toFeature(place), [place]);

  useEffect(() => {
    console.log(placeData)
  }, [place]);

  /**
   * Sets the count of records returned from the passed response.
   */
  const setRelatedCount = useCallback((response: AnnotationPage<any>, callback: CallbackFunction) => {
    const { total } = response.partOf;
    callback(total);

    return response;
  }, []);

  /**
   * Sets the count of media records returned from the passed response.
   */
  const setRelatedMediaCount = useCallback((response: AnnotationPage<any>) => {
    const count = _.reduce(_.pluck(response.items, 'item_count'), (a, b) => (a +b)) || 0;
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
          onLoad={setPlace}
        />
        { place && (
          <PlaceLayersSelector
            className='place-layers-selector'
            label={'Map Layers'}
            layers={place.place_layers}
          />
        )}
        <RelatedItemsList>
          <RelatedItem
            count={mediaCount}
            id='media_contents'
            label={'Related Media'}
            loading={mediaLoading}
          >
            <RelatedMedia
              emptyMessage={'None'}
              onLoad={(baseUrl: string, projectIds: Array<number>) => (
                PlacesService
                  .fetchRelatedManifests(baseUrl, uuid, projectIds)
                  .then(setRelatedMediaCount)
                  .finally(() => setMediaLoading(false))
              )}
            />
          </RelatedItem>
          <RelatedItem
            count={organizationsCount}
            id='organizations'
            label={'Related Organizations'}
            loading={organizationsLoading}
          >
            <RelatedOrganizations
              emptyMessage={'None'}
              onLoad={(baseUrl: string, projectIds: Array<number>) => (
                PlacesService
                  .fetchRelatedOrganizations(baseUrl, uuid, projectIds)
                  .then((resp: AnnotationPage<any>) => setRelatedCount(resp, setOrganizationsCount))
                  .finally(() => setOrganizationsLoading(false))
              )}
            />
          </RelatedItem>
          <RelatedItem
            count={peopleCount}
            id='people'
            label={'Related People'}
            loading={peopleLoading}
          >
            <RelatedPeople
              emptyMessage={'None'}
              onLoad={(baseUrl: string, projectIds: Array<number>) => (
                PlacesService
                  .fetchRelatedPeople(baseUrl, uuid, projectIds)
                  .then((resp: AnnotationPage<any>) => setRelatedCount(resp, setPeopleCount))
                  .finally(() => setPeopleLoading(false))
              )}
            />
          </RelatedItem>
          <RelatedItem
            count={placesCount}
            id='places'
            label={'Related Places'}
            loading={placesLoading}
          >
            <RelatedPlaces
              emptyMessage={'None'}
              onLoad={(baseUrl: string, projectIds: Array<number>) => (
                PlacesService
                  .fetchRelatedPlaces(baseUrl, uuid, projectIds)
                  .then((resp: AnnotationPage<any>) => setRelatedCount(resp, setPlacesCount))
                  .finally(() => setPlacesLoading(false))
              )}
            />
          </RelatedItem>
          <RelatedItem
            count={taxonomiesCount}
            id='taxomonies'
            label={'Related Taxonomies'}
            loading={taxonomiesLoading}
          >
            <RelatedTaxonomies
              emptyMessage={'None'}
              onLoad={(baseUrl: string, projectIds: Array<number>) => (
                PlacesService
                  .fetchRelatedTaxonomies(baseUrl, uuid, projectIds)
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
