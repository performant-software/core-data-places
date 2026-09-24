import { Peripleo, RuntimeConfig } from '@peripleo/peripleo';
import { LocationMarkers } from '@performant-software/geospatial';
import { Peripleo as PeripleoUtils } from '@performant-software/core-data';
import Map from '@components/Map';
import TranslationContext from '@contexts/TranslationContext';
import { useTranslations } from '@i18n/useTranslations';
import { useMemo } from 'react';
import { kilometersToMiles } from '@utils/map';
import { Map as MapUtils } from '@performant-software/geospatial';

interface Props {
  classNames?: {
    controls?: string
    root?: string,
  };
  geometry: any;
  lang: string;
}

const PlaceMap = (props: Props) => {
  const { t } = useTranslations();

  const buffer = useMemo(() => {
    const maxRadius = Math.max(
      props.geometry.features.map(f => f.properties?.originalProperties?.certainty_radius ?? 0)
    );

    if (maxRadius) {
      return kilometersToMiles(maxRadius);
    }

    return undefined;
  }, [props.geometry.features]);

  const mapGeometry = useMemo(() => {
    if (props.geometry) {
      return {
        ...props.geometry,
        features: props.geometry.features.map((feature) => {
          const certaintyRadius = feature.properties?.originalProperties?.certainty_radius

          if (certaintyRadius) {
            return MapUtils.toCertaintyCircle(
              feature,
              certaintyRadius
            )
          }

          return feature;
        })
      }
    }
  }, [props.geometry])

  return (
    <TranslationContext.Provider
      value={{ t, lang: props.lang }}
    >
      <RuntimeConfig
        path='/config.json'
        preprocess={PeripleoUtils.normalize}
      >
        <Peripleo>
          <Map classNames={props.classNames}>
            <LocationMarkers
              boundingBoxOptions={{
                animate: false
              }}
              buffer={buffer}
              data={mapGeometry}
            />
          </Map>
        </Peripleo>
      </RuntimeConfig>
    </TranslationContext.Provider>
  )
}

export default PlaceMap