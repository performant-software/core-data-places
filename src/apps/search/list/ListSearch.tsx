import ListLayout from '@apps/search/list/ListLayout';
import { RuntimeConfigProvider } from '@apps/search/SearchConfigContext';
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
    <RuntimeConfigProvider
      name={props.name}
    >
      <TypesenseSearch>
        <TranslationContext.Provider
          value={{ lang: props.lang, t }}
        >
          <ListLayout lang={props.lang} />
        </TranslationContext.Provider>
      </TypesenseSearch>
    </RuntimeConfigProvider>
  );
};

export default ListSearch;