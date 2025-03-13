import BasePanel from '@apps/search/panels/BasePanel';
import OrganizationsService from '@backend/api/organizations';
import { useCallback, useContext } from 'react';
import { useRuntimeConfig } from '@peripleo/peripleo';
import TranslationContext from '@contexts/TranslationContext';

interface Props {
  className?: string;
}

const Organization = (props: Props) => {
  const config: any = useRuntimeConfig();
  const { lang } = useContext(TranslationContext);

  const exclusions = config.search.result_filtering && config.search.result_filtering.organizations ? config.search.result_filtering.organizations.exclude : [];

  /**
   * Resolves the URL for the detail page.
   */
  const resolveDetailPageUrl = useCallback((organization) => {
    if (organization && config.detail_pages && config.detail_pages.includes('organizations')) {
      return `/${lang}/organizations/${organization.uuid}`
    }
  }, [config, lang])

  return (
    <BasePanel
      className={props.className}
      icon='participants'
      name='organization'
      exclusions={exclusions}
      renderItem={(organization) => (
        <p
          className='text-sm'
        >
          { organization.description }
        </p>
      )}
      resolveDetailPageUrl={resolveDetailPageUrl}
      service={OrganizationsService}
    />
  );
}

export default Organization;
