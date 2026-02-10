import { useTranslations } from '@i18n/useTranslations';
import { useStore } from '@nanostores/react';
import PagesStore from '@store/pages';
import { useEffect, useState } from 'react';

interface Props {
  defaultTitle?: string;
  titleKey?: string;
}

const Title = ({ defaultTitle, titleKey }: Props) => {
  const [title, setTitle] = useState<string>(defaultTitle);

  const pageStore = useStore(PagesStore);
  const { t } = useTranslations();

  /**
   * Sets the title on the state based on the page store.
   */
  useEffect(() => {
    setTitle(pageStore.title);
  }, [pageStore.title]);

  /**
   * Sets the title on the state based on the passed title key.
   */
  useEffect(() => {
    if (titleKey) {
      setTitle(t(titleKey));
    }
  }, [t, titleKey]);

  return (
    <title>{ title }</title>
  );
};

export default Title;