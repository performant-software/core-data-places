import SearchList from '@apps/session/SearchList';
import TranslationContext from '@contexts/TranslationContext';
import { useTranslations } from '@i18n/useTranslations';

interface Props {
  lang: string;
  sessionId?: string;
}

const Search = ({ lang, sessionId }: Props) => {
  const { t } = useTranslations();

  return (
    <TranslationContext.Provider
      value={{ lang, t }}
    >
      <SearchList
        sessionId={sessionId}
      />
    </TranslationContext.Provider>
  );
};

export default Search;