import { Peripleo, RuntimeConfig } from '@peripleo/peripleo';
import { LocationMarkers } from '@performant-software/geospatial';
import { Peripleo as PeripleoUtils } from '@performant-software/core-data';
import Map from "@components/Map";
import TranslationContext from '@contexts/TranslationContext';
import { useTranslations } from '@i18n/useTranslations';

interface Props {
  geometry: any;
  lang: string;
}

const PlaceMap = (props: Props) => {
  const { t } = useTranslations();

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
              data={props.geometry}
            />
          </Map>
        </Peripleo>
      </RuntimeConfig>
    </TranslationContext.Provider>
  )
}

export default PlaceMap