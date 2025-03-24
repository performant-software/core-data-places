import { SearchContextProvider } from '@apps/search/SearchContext';
import SearchLayout from '@apps/search/SearchLayout';
import TranslationContext from '@apps/search/TranslationContext';
import TypesenseSearch from '@apps/search/TypesenseSearch';
import { useTranslations } from '@i18n/client';
import { Peripleo as PeripleoUtils } from '@performant-software/core-data';
import { Peripleo, Router, RuntimeConfig } from '@peripleo/peripleo';

interface Props {
  name: string;
}

const Search = (props: Props) => {
  const { t } = useTranslations();

  return (
    <RuntimeConfig
      path='/config.json'
      preprocess={PeripleoUtils.normalize}
    >
      <Router>
        <Peripleo>
          <SearchContextProvider
            name={props.name}
          >
            <TypesenseSearch>
              <TranslationContext.Provider
                value={{ t }}
              >
                <SearchLayout />
              </TranslationContext.Provider>
            </TypesenseSearch>
          </SearchContextProvider>
        </Peripleo>
      </Router>
    </RuntimeConfig>
  );
};

export default Search;