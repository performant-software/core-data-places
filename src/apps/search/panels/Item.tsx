import BasePanel from '@apps/search/panels/BasePanel';
import ItemsService from '@backend/api/coreData/items';
import { useCallback, useContext } from 'react';
import { useRuntimeConfig } from '@peripleo/peripleo';
import TranslationContext from '@contexts/TranslationContext';

interface Props {
  className?: string;
}

const Item = (props: Props) => {
  const config: any = useRuntimeConfig();
  const { lang } = useContext(TranslationContext);

  const exclusions = config.search.result_filtering && config.search.result_filtering.items ? config.search.result_filtering.items.exclude : [];

  /**
   * Resolves the URL for the detail page.
   */
  const resolveDetailPageUrl = useCallback((item) => {
    if (item && config.detail_pages && config.detail_pages.includes('items')) {
      return `/${lang}/items/${item.uuid}`
    }
  }, [config, lang])

  return (
    <BasePanel
      className={props.className}
      name='item'
      exclusions={exclusions}
      resolveDetailPageUrl={resolveDetailPageUrl}
      service={ItemsService}
    />
  );
}

export default Item;
