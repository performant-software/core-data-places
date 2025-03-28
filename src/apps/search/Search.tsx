import SearchLayout from '@apps/search/SearchLayout';
import TypesenseSearch from '@apps/search/TypesenseSearch';
import TranslationContext from '@contexts/TranslationContext';
import { useTranslations } from '@i18n/client';
import { Peripleo as PeripleoUtils } from '@performant-software/core-data';
import { Peripleo, Router, RuntimeConfig } from '@peripleo/peripleo';

interface Props {
  lang: string
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
          <TypesenseSearch>
            <TranslationContext.Provider
              value={{ t, lang: props.lang }}
            >
              <SearchLayout />
            </TranslationContext.Provider>
          </TypesenseSearch>
        </Peripleo>
      </Router>
    </RuntimeConfig>
  );
};

export default Search;