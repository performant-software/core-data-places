import BasePanel from '@apps/search/panels/BasePanel';
import WorksService from '@backend/api/coreData/works';
import { useCallback, useContext } from 'react';
import {useRuntimeConfig} from '@peripleo/peripleo';
import TranslationContext from '@contexts/TranslationContext';

interface Props {
  className?: string;
}

const Work = (props: Props) => {
  const config: any = useRuntimeConfig();
  const { lang } = useContext(TranslationContext);

  const exclusions = config.search.result_filtering && config.search.result_filtering.works ? config.search.result_filtering.works.exclude : [];

  /**
   * Resolves the URL for the detail page.
   */
  const resolveDetailPageUrl = useCallback((work) => {
    if (work && config.detail_pages && config.detail_pages.includes('works')) {
      return `/${lang}/works/${work.uuid}`
    }
  }, [config, lang])

  return (
    <BasePanel
      className={props.className}
      name='work'
      exclusions={exclusions}
      resolveDetailPageUrl={resolveDetailPageUrl}
      service={WorksService}
    />
  );
}

export default Work;
