import BasePanel from '@apps/search/panels/BasePanel';
import OrganizationsService from '@backend/api/organizations';
import TranslationContext from '@contexts/TranslationContext';
import { useRuntimeConfig } from '@peripleo/peripleo';
import { useCallback, useContext } from 'react';

interface Props {
  className?: string;
}

const Organization = (props: Props) => {
  const config = useRuntimeConfig();
  const { lang } = useContext(TranslationContext);

  /**
   * Resolves the URL for the detail page.
   */
  const resolveDetailPageUrl = useCallback((organization) => {
    if (organization && config.detail_pages && config.detail_pages.includes('organizations')) {
      return `/${lang}/organizations/${organization.uuid}`;
    }
  }, [config, lang]);

  return (
    <BasePanel
      className={props.className}
      icon='participants'
      name='organization'
      exclusions={config.result_filtering?.organizations?.exclude}
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
