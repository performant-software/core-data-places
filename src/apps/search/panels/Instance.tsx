import BasePanel from '@apps/search/panels/BasePanel';
import InstancesService from '@backend/api/coreData/instances';
import TranslationContext from '@contexts/TranslationContext';
import { useRuntimeConfig } from '@peripleo/peripleo';
import { useCallback, useContext } from 'react';

interface Props {
  className?: string;
  panelHistory?: any[];
  setPanelHistory?: any;
}

const Instance = (props: Props) => {
  const config = useRuntimeConfig();
  const { lang } = useContext(TranslationContext);

  /**
   * Resolves the URL for the detail page.
   */
  const resolveDetailPageUrl = useCallback((instance) => {
    if (instance && config.detail_pages && config.detail_pages.includes('instances')) {
      return `/${lang}/instances/${instance.uuid}`;
    }
  }, [config, lang]);

  return (
    <BasePanel
      className={props.className}
      name='instance'
      exclusions={config.result_filtering?.instances?.exclude}
      panelHistory={props.panelHistory}
      resolveDetailPageUrl={resolveDetailPageUrl}
      service={InstancesService}
      setPanelHistory={props.setPanelHistory}
    />
  );
};

export default Instance;
