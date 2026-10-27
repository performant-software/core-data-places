import ListLayout from '@apps/search/list/ListLayout';
import { RuntimeConfigProvider } from '@apps/search/SearchConfigContext';
import TranslationContext from '@contexts/TranslationContext';
import { useTranslations } from '@i18n/useTranslations';
import Search from '@apps/search/Search';

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
      <Search>
        <TranslationContext.Provider
          value={{ lang: props.lang, t }}
        >
          <ListLayout lang={props.lang} />
        </TranslationContext.Provider>
      </Search>
    </RuntimeConfigProvider>
  );
};

export default ListSearch;