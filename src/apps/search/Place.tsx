import RelatedRecords from '@apps/search/RelatedRecords';
import RecordPanel from '@apps/search/RecordPanel';
import { useTranslations } from '@i18n/client';
import {
  CoreData as CoreDataUtils,
  PlaceLayersSelector,
  useLoader,
  usePlacesService
} from '@performant-software/core-data';
import { useCurrentRoute, useNavigate } from '@peripleo/peripleo';
import { getCurrentId } from '@utils/router';
import React, { useCallback, useMemo } from 'react';
import _ from 'underscore';
import './Place.css';

type Place = {
  place_layers: Array<any>;
};

const Place = () => {
  const PlacesService = usePlacesService();
  const navigate = useNavigate();
  const { t } = useTranslations();

  const route = useCurrentRoute();
  const id = getCurrentId(route);

  /**
   * Loads the place record from the Core Data API.
   */
  const onLoad = useCallback(() => PlacesService.fetchOne(id), [id]);
  const { data: { place = null } = {} } = useLoader(onLoad, null, [id]);

  /**
   * Memo-izes the geometry.
   */
  const geometry = useMemo(() => place && CoreDataUtils.toFeature(place), [place]);

  return (
    <RecordPanel
      geometry={geometry}
      item={place}
      onClose={() => navigate('/')}
    >
      <RelatedRecords
        key={`related-${id}`}
        onLoadMedia={() => PlacesService.fetchRelatedManifests(id)}
        onLoadOrganizations={() => PlacesService.fetchRelatedOrganizations(id)}
        onLoadPeople={() => PlacesService.fetchRelatedPeople(id)}
        onLoadPlaces={() => PlacesService.fetchRelatedPlaces(id)}
        onLoadTaxonomies={() => PlacesService.fetchRelatedTaxonomies(id)}
      />
      {!_.isEmpty(place?.place_layers) && (
        <PlaceLayersSelector
          className='place-layers-selector'
          label={t('mapLayers')}
          layers={place.place_layers}
        />
      )}
    </RecordPanel>
  );
};

export default Place;