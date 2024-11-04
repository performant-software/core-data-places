import { Peripleo as PeripleoUtils } from '@performant-software/core-data';
import { Peripleo, Router, RuntimeConfig } from '@peripleo/peripleo';
import MapView from './MapView';
import SearchRoutes from './SearchRoutes';
import TranslationContext from './TranslationContext';
import TypesenseSearch from './TypesenseSearch';
import { useTranslations } from '../../i18n/client';

const Search = () => {
  const { t } = useTranslations();

  return (
    <RuntimeConfig
      //@ts-ignore
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
