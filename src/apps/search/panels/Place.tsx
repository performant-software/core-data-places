import BasePanel from '@apps/search/panels/BasePanel';
import PlacesService from '@backend/api/places';
import TranslationContext from '@contexts/TranslationContext';
import { useTranslations } from '@i18n/client';
import { CoreData as CoreDataUtils, PlaceLayersSelector } from '@performant-software/core-data';
import { useRuntimeConfig } from '@peripleo/peripleo';
import clsx from 'clsx';
import { useCallback, useContext } from 'react';
import _ from 'underscore';

type Place = {
  place_layers: Array<any>;
};

interface Props {
  className?: string;
}

const Place = (props: Props) => {
  const config = useRuntimeConfig();
  const { lang, t } = useTranslations();

  const exclusions = config.result_filtering?.places?.exclude || [];

  /**
   * Resolves the URL for the detail page.
   */
  const resolveDetailPageUrl = useCallback((place) => {
    if (place && config.detail_pages && config.detail_pages.includes('places')) {
      return `/${lang}/places/${place.uuid}`;
    }
  }, [config, lang]);

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
      resolveDetailPageUrl={resolveDetailPageUrl}
      resolveGeometry={(place) => CoreDataUtils.toFeatureCollection([place])}
      service={PlacesService}
    />
  );
};

export default Place;