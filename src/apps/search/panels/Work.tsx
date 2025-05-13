import BasePanel from '@apps/search/panels/BasePanel';
import WorksService from '@backend/api/coreData/works';
import TranslationContext from '@contexts/TranslationContext';
import { useRuntimeConfig } from '@peripleo/peripleo';
import { useCallback, useContext } from 'react';

interface Props {
  className?: string;
  panelHistory?: any[];
  setPanelHistory?: any;
}

const Work = (props: Props) => {
  const config = useRuntimeConfig();
  const { lang } = useContext(TranslationContext);

  /**
   * Resolves the URL for the detail page.
   */
  const resolveDetailPageUrl = useCallback((work) => {
    if (work && config.detail_pages && config.detail_pages.includes('works')) {
      return `/${lang}/works/${work.uuid}`;
    }
  }, [config, lang]);

  return (
    <BasePanel
      className={props.className}
      name='work'
      exclusions={config.result_filtering?.works?.exclude}
      panelHistory={props.panelHistory}
      resolveDetailPageUrl={resolveDetailPageUrl}
      service={WorksService}
      setPanelHistory={props.setPanelHistory}
    />
  );
}

export default Work;
