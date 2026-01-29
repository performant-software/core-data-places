import { MapSearchContextProvider } from '@apps/search/map/MapSearchContext';
import TypesenseSearch from '@apps/search/TypesenseSearch';
import TranslationContext from '@contexts/TranslationContext';
import { useTranslations } from '@i18n/useTranslations';
import { Peripleo, Router } from '@peripleo/peripleo';
import MapLayout from '@apps/search/map/MapLayout';
import { RuntimeConfigProvider } from '@apps/search/SearchConfigContext';
import MapSearchProvider from '@apps/search/map/MapSearchProvider';

interface Props {
  allowSave?: boolean;
  lang: string;
  name: string;
}

const MapSearch = ({allowSave, lang, name}: Props) => {
  const { t } = useTranslations();

  return (
    <RuntimeConfigProvider
      name={name}
    >
      <Router>
        <Peripleo>
          <MapSearchContextProvider
            allowSave={allowSave}
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
    </RuntimeConfigProvider>
  );
};

export default MapSearch;