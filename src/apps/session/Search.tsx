import SearchList from '@apps/session/SearchList';
import TranslationContext from '@contexts/TranslationContext';
import { useTranslations } from '@i18n/useTranslations';

interface Props {
  lang: string;
}

const Search = ({ lang }: Props) => {
  const { t } = useTranslations();

  return (
    <TranslationContext.Provider
      value={{ lang, t }}
    >
      <SearchList />
    </TranslationContext.Provider>
  );
};

export default Search;