import ListLayout from '@apps/search/list/ListLayout';
import { SearchConfigContextProvider } from '@apps/search/SearchConfigContext';
import TranslationContext from '@contexts/TranslationContext';
import { useTranslations } from '@i18n/useTranslations';
import TypesenseSearch from '@apps/search/TypesenseSearch';

interface Props {
  lang: string;
  name: string;
}

const ListSearch = (props: Props) => {
  const { t } = useTranslations();

  return (
    <SearchConfigContextProvider
      name={props.name}
    >
      <TypesenseSearch>
        <TranslationContext.Provider
          value={{ lang: props.lang, t }}
        >
          <ListLayout lang={props.lang} />
        </TranslationContext.Provider>
      </TypesenseSearch>
    </SearchConfigContextProvider>
  );
};

export default ListSearch;