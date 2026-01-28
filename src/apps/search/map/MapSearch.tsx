import { MapSearchContextProvider } from '@apps/search/map/MapSearchContext';
import MapSearchProvider from '@apps/search/map/MapSearchProvider';
import MapLayout from '@apps/search/map/MapLayout';
import { SearchConfigContextProvider } from '@apps/search/SearchConfigContext';
import TypesenseSearch from '@apps/search/TypesenseSearch';
import TranslationContext from '@contexts/TranslationContext';
import { useTranslations } from '@i18n/useTranslations';
import { Peripleo as PeripleoUtils } from '@performant-software/core-data';
import { Peripleo, Router, RuntimeConfig } from '@peripleo/peripleo';

interface Props {
  allowSave?: boolean;
  lang: string;
  name: string;
  preload?: boolean;
}

const MapSearch = ({ allowSave, lang, name, preload }: Props) => {
  const { t } = useTranslations();

  return (
    <SearchConfigContextProvider
      name={name}
    >
      <RuntimeConfig
        path='/config.json'
        preprocess={PeripleoUtils.normalize}
      >
        <Router>
          <Peripleo>
            <TypesenseSearch>
              <MapSearchProvider>
                <MapSearchContextProvider
                  allowSave={allowSave}
                  preload={preload}
                >
                  <TranslationContext.Provider
                    value={{lang, t}}
                  >
                    <MapLayout />
                  </TranslationContext.Provider>
                </MapSearchContextProvider>
              </MapSearchProvider>
            </TypesenseSearch>
          </Peripleo>
        </Router>
      </RuntimeConfig>
    </SearchConfigContextProvider>
  );
};

export default MapSearch;