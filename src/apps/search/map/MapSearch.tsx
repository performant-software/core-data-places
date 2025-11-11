import { MapSearchContextProvider } from '@apps/search/map/MapSearchContext';
import TypesenseSearch from '@apps/search/TypesenseSearch';
import TranslationContext from '@contexts/TranslationContext';
import { useTranslations } from '@i18n/useTranslations';
import { Peripleo as PeripleoUtils } from '@performant-software/core-data';
import { Peripleo, Router, RuntimeConfig } from '@peripleo/peripleo';
import MapLayout from '@apps/search/map/MapLayout';
import { SearchConfigContextProvider } from '@apps/search/SearchConfigContext';
import MapSearchProvider from '@apps/search/map/MapSearchProvider';

interface Props {
  allowSave?: boolean;
  lang: string;
  name: string;
}

const MapSearch = ({allowSave, lang, name}: Props) => {
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
            <MapSearchContextProvider
              allowSave={allowSave}
              name={name}
            >
              <TypesenseSearch>
                <MapSearchProvider>
                  <TranslationContext.Provider
                    value={{lang, t}}
                  >
                    <MapLayout />
                  </TranslationContext.Provider>
                </MapSearchProvider>
              </TypesenseSearch>
            </MapSearchContextProvider>
          </Peripleo>
        </Router>
      </RuntimeConfig>
    </SearchConfigContextProvider>
  );
};

export default MapSearch;