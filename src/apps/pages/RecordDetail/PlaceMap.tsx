import { Peripleo, RuntimeConfig } from '@peripleo/peripleo';
import { LocationMarkers } from '@performant-software/geospatial';
import { Peripleo as PeripleoUtils } from '@performant-software/core-data';
import Map from "@components/Map";
import TranslationContext from '@contexts/TranslationContext';
import { useTranslations } from '@i18n/client';

interface Props {
  record: any;
  lang: string;
}

const PlaceMap = (props: Props) => {
  const { t } = useTranslations();

  if (!props.record.place_geometry?.geometry_json) {
    return null;
  }

  return (
    <TranslationContext.Provider
      value={{ t, lang: props.lang }}
    >
      <RuntimeConfig
        path='/config.json'
        preprocess={PeripleoUtils.normalize}
      >
        <Peripleo>
          <Map>
            <LocationMarkers
              boundingBoxOptions={{
                animate: false
              }}
              data={props.record.place_geometry.geometry_json}
            />
          </Map>
        </Peripleo>
      </RuntimeConfig>
    </TranslationContext.Provider>
  )
}

export default PlaceMap