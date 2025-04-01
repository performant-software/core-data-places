import { SearchContextProvider } from '@apps/search/SearchContext';
import SearchLayout from '@apps/search/SearchLayout';
import TypesenseSearch from '@apps/search/TypesenseSearch';
import TranslationContext from '@contexts/TranslationContext';
import { useTranslations } from '@i18n/useTranslations';
import { Peripleo as PeripleoUtils } from '@performant-software/core-data';
import { Peripleo, Router, RuntimeConfig } from '@peripleo/peripleo';

interface Props {
  lang: string;
  name: string;
}

const Search = ({ lang, name }: Props) => {
  const { t } = useTranslations();

  return (
    <RuntimeConfig
      path='/config.json'
      preprocess={PeripleoUtils.normalize}
    >
      <Router>
        <Peripleo>
          <SearchContextProvider
            name={name}
          >
            <TypesenseSearch>
              <TranslationContext.Provider
                value={{ lang, t }}
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