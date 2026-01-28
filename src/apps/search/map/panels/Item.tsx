import BasePanel from '@apps/search/map/panels/BasePanel';
import ItemsService from '@backend/api/coreData/items';
import TranslationContext from '@contexts/TranslationContext';
import { useRuntimeConfig } from '@peripleo/peripleo';
import { useCallback, useContext } from 'react';
import { hasDetailPage } from '@utils/detailPagePaths';

interface Props {
  className?: string;
}

const Item = (props: Props) => {
  const config = useRuntimeConfig();
  const { lang } = useContext(TranslationContext);

  /**
   * Resolves the URL for the detail page.
   */
  const resolveDetailPageUrl = useCallback((item) => {
    if (item && hasDetailPage('items')) {
      return `/${lang}/items/${item.uuid}`;
    }
  }, [lang]);

  return (
    <BasePanel
      className={props.className}
      name='item'
      exclusions={config.result_filtering?.items?.exclude}
      resolveDetailPageUrl={resolveDetailPageUrl}
      service={ItemsService}
    />
  );
}

export default Item;
