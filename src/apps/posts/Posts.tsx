import { useTranslations } from '@i18n/useTranslations';
import TranslationContext from '@contexts/TranslationContext';
import PostList from '@apps/posts/PostList';

interface Props {
  chrono?: boolean;
  lang: string;
}

const Posts = (props: Props) => {
  const { t } = useTranslations();

  return (
    <TranslationContext.Provider
      value={{ lang: props.lang, t }}
    >
      <PostList
        chrono={props.chrono}
        lang={props.lang}
      />
    </TranslationContext.Provider>
  );
};

export default Posts;
