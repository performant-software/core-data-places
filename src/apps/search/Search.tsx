import MapView from '@apps/search/MapView';
import SearchRoutes from '@apps/search/SearchRoutes';
import TranslationContext from '@apps/search/TranslationContext';
import TypesenseSearch from '@apps/search/TypesenseSearch';
import { useTranslations } from '@i18n/client';
import { Peripleo as PeripleoUtils } from '@performant-software/core-data';
import { Peripleo, Router, RuntimeConfig } from '@peripleo/peripleo';

const Search = () => {
  const { t } = useTranslations();

  return (
    <RuntimeConfig
      path='/config.json'
      preprocess={PeripleoUtils.normalize}
    >
      <Router>
        <Peripleo>
          <TypesenseSearch>
            <TranslationContext.Provider
              value={{ t }}
            >
              <SearchRoutes />
              <MapView />
            </TranslationContext.Provider>
          </TypesenseSearch>
        </Peripleo>
      </Router>
    </RuntimeConfig>
  );
};

export default Search;
