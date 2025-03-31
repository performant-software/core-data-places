import BasePanel from '@apps/search/panels/BasePanel';
import InstancesService from '@backend/api/coreData/instances';
import { useCallback, useContext } from 'react';
import { useRuntimeConfig } from '@peripleo/peripleo';
import TranslationContext from '@contexts/TranslationContext';

interface Props {
  className?: string;
}

const Instance = (props: Props) => {
  const config: any = useRuntimeConfig();
  const { lang } = useContext(TranslationContext);

  const exclusions = config.search.result_filtering && config.search.result_filtering.instances ? config.search.result_filtering.instances.exclude : [];

  /**
   * Resolves the URL for the detail page.
   */
  const resolveDetailPageUrl = useCallback((instance) => {
    if (instance && config.detail_pages && config.detail_pages.includes('instances')) {
      return `/${lang}/instances/${instance.uuid}`
    }
  }, [config, lang])

  return (
    <BasePanel
      className={props.className}
      name='instance'
      exclusions={exclusions}
      resolveDetailPageUrl={resolveDetailPageUrl}
      service={InstancesService}
    />
  );
};

export default Instance;
