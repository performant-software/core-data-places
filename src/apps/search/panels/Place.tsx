import RecordPanel from '@apps/search/panels/RecordPanel';
import { useTranslations } from '@i18n/client';
import {
  CoreData as CoreDataUtils,
  PlaceLayersSelector,
  useLoader,
  usePlacesService
} from '@performant-software/core-data';
import { useCurrentRoute, useNavigate } from '@peripleo/peripleo';
import { getPreviewImage } from '@utils/media';
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
   * Loads the first related media record from the Core Data API.
   */
  const onLoadMedia = useCallback(() => PlacesService.fetchRelatedMedia(id, { limit: 1 }), [id]);
  const { data: { media_contents: mediaContents = [] } = {} } = useLoader(onLoadMedia);

  /**
   * Memo-izes the geometry.
   */
  const geometry = useMemo(() => place && CoreDataUtils.toFeature(place), [place]);

  /**
   * Memo-izes the image.
   */
  const image = useMemo(() => getPreviewImage(mediaContents), [mediaContents]);

  return (
    <RecordPanel
      className='place'
      geometry={geometry}
      id={id}
      image={image}
      name={place?.name}
      onClose={() => navigate('/')}
      onLoadMedia={() => PlacesService.fetchRelatedManifests(id)}
      onLoadOrganizations={() => PlacesService.fetchRelatedOrganizations(id)}
      onLoadPeople={() => PlacesService.fetchRelatedPeople(id)}
      onLoadPlaces={() => PlacesService.fetchRelatedPlaces(id)}
      onLoadTaxonomies={() => PlacesService.fetchRelatedTaxonomies(id)}
      userDefined={place?.user_defined}
    >
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