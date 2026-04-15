import { Peripleo, RuntimeConfig } from '@peripleo/peripleo';
import { LocationMarkers } from '@performant-software/geospatial';
import { Peripleo as PeripleoUtils } from '@performant-software/core-data';
import Map from '@components/Map';
import TranslationContext from '@contexts/TranslationContext';
import { useTranslations } from '@i18n/useTranslations';
import CertaintyLayer from '@components/CertaintyLayer';
import { useMemo } from 'react';
import { kilometersToMiles } from '@utils/map';

interface Props {
  classNames?: {
    controls?: string
    root?: string,
  };
  geometry: {
    geometry_json: any,
    properties: any
  };
  lang: string;
}

const PlaceMap = (props: Props) => {
  const { t } = useTranslations();

  const buffer = useMemo(() => (
    kilometersToMiles(props.geometry.properties?.certainty_radius)
  ), [props.geometry.properties?.certainty_radius]);

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
              data={props.geometry.geometry_json}
            />
            <CertaintyLayer
              data={[{ geometry: props.geometry.geometry_json }]}
              getProperties={() => props.geometry.properties?.certainty_radius}
            />
          </Map>
        </Peripleo>
      </RuntimeConfig>
    </TranslationContext.Provider>
  )
}

export default PlaceMap