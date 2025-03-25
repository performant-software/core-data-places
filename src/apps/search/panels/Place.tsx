import BasePanel from '@apps/search/panels/BasePanel';
import PlacesService from '@backend/api/places';
import { useTranslations } from '@i18n/client';
import { CoreData as CoreDataUtils, PlaceLayersSelector } from '@performant-software/core-data';
import { useRuntimeConfig } from '@peripleo/peripleo';
import clsx from 'clsx';
import React from 'react';
import _ from 'underscore';

type Place = {
  place_layers: Array<any>;
};

interface Props {
  className?: string;
}

const Place = (props: Props) => {
  const { t } = useTranslations();

  const config = useRuntimeConfig();
  const exclusions = config.result_filtering?.places?.exclude || [];

  return (
    <BasePanel
      className={clsx('place', props.className)}
      icon='location'
      name='place'
      exclusions={exclusions}
      renderItem={(place) => (
        <>
          { !exclusions.includes('place_layers') && !_.isEmpty(place?.place_layers) && (
            <PlaceLayersSelector
              className='place-layers-selector px-0'
              label={t('mapLayers')}
              layers={place.place_layers}
            />
          )}
        </>
      )}
      resolveGeometry={(place) => CoreDataUtils.toFeatureCollection([place])}
      service={PlacesService}
    />
  );
};

export default Place;