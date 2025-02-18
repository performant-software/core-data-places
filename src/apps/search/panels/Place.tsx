import BasePanel from '@apps/search/panels/BasePanel';
import { useTranslations } from '@i18n/client';
import {
  CoreData as CoreDataUtils,
  PlaceLayersSelector,
  usePlacesService
} from '@performant-software/core-data';
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

  return (
    <BasePanel
      className={clsx('place', props.className)}
      icon='location'
      name='place'
      renderItem={(place) => (
        <>
          { !_.isEmpty(place?.place_layers) && (
            <PlaceLayersSelector
              className='place-layers-selector px-0'
              label={t('mapLayers')}
              layers={place.place_layers}
            />
          )}
        </>
      )}
      resolveGeometry={(place) => CoreDataUtils.toFeatureCollection([place])}
      useServiceHook={usePlacesService}
    />
  );
};

export default Place;