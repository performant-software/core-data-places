import { useTranslations } from '@i18n/useTranslations';
import TranslationContext from '@contexts/TranslationContext';
import PostList from '@apps/posts/PostList';

interface Props {
  lang: string;
  sort?: {
    name: string;
    direction?: 'asc' | 'desc';
  };
}

const Posts = (props: Props) => {
  const { t } = useTranslations();

  return (
    <TranslationContext.Provider
      value={{ lang: props.lang, t }}
    >
      <PostList
        sort={props.sort}
        lang={props.lang}
      />
    </TranslationContext.Provider>
  );
};

export default Posts;
