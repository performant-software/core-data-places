import BasePanel from '@apps/search/panels/BasePanel';
import ItemsService from '@backend/api/coreData/items';
import TranslationContext from '@contexts/TranslationContext';
import { useRuntimeConfig } from '@peripleo/peripleo';
import { useCallback, useContext } from 'react';

interface Props {
  className?: string;
  panelHistory?: any[];
  setPanelHistory?: any;
}

const Item = (props: Props) => {
  const config = useRuntimeConfig();
  const { lang } = useContext(TranslationContext);

  /**
   * Resolves the URL for the detail page.
   */
  const resolveDetailPageUrl = useCallback((item) => {
    if (item && config.detail_pages && config.detail_pages.includes('items')) {
      return `/${lang}/items/${item.uuid}`;
    }
  }, [config, lang]);

  return (
    <BasePanel
      className={props.className}
      name='item'
      exclusions={config.result_filtering?.items?.exclude}
      panelHistory={props.panelHistory}
      resolveDetailPageUrl={resolveDetailPageUrl}
      service={ItemsService}
      setPanelHistory={props.setPanelHistory}
    />
  );
}

export default Item;
