import { useTranslations } from '@i18n/useTranslations';
import TranslationContext from '@contexts/TranslationContext';
import PathList from '@apps/paths/PathList';

interface Props {
  lang: string;
  sort?: {
    name: string;
    direction?: 'asc' | 'desc';
  };
}

const Paths = (props: Props) => {
  const { t } = useTranslations();

  return (
    <TranslationContext.Provider
      value={{ lang: props.lang, t }}
    >
      <PathList
        sort={props.sort}
        lang={props.lang}
      />
    </TranslationContext.Provider>
  );
};

export default Paths;
