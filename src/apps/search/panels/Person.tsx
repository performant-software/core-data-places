import BasePanel from '@apps/search/panels/BasePanel';
import PeopleService from '@backend/api/coreData/people';
import TranslationContext from '@contexts/TranslationContext';
import { useRuntimeConfig } from '@peripleo/peripleo';
import { getNameView } from '@utils/people';
import { useCallback, useContext } from 'react';

interface Props {
  className?: string;
  panelHistory?: any[];
  setPanelHistory?: any;
}

const Person = (props: Props) => {
  const config = useRuntimeConfig();
  const { lang } = useContext(TranslationContext);

  /**
   * Returns a concatenation of the person's name attributes.
   *
   * @type {function(*): *}
   */
  const renderName = useCallback((person) => getNameView(person), []);

  /**
   * Resolves the URL for the detail page.
   */
  const resolveDetailPageUrl = useCallback((person) => {
    if (person && config.detail_pages && config.detail_pages.includes('people')) {
      return `/${lang}/people/${person.uuid}`;
    }
  }, [config, lang]);

  return (
    <BasePanel
      className={props.className}
      icon='person'
      name='person'
      exclusions={config.result_filtering?.people?.exclude}
      panelHistory={props.panelHistory}
      renderName={renderName}
      resolveDetailPageUrl={resolveDetailPageUrl}
      service={PeopleService}
      setPanelHistory={props.setPanelHistory}
    />
  );
};

export default Person;
