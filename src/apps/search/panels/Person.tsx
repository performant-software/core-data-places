import BasePanel from '@apps/search/panels/BasePanel';
import PeopleService from '@backend/api/coreData/people';
import { getNameView } from '@utils/people';
import { useCallback, useContext } from 'react';
import { useRuntimeConfig } from '@peripleo/peripleo';
import TranslationContext from '@contexts/TranslationContext';

interface Props {
  className?: string;
}

const Person = (props: Props) => {
  const config: any = useRuntimeConfig();
  const { lang } = useContext(TranslationContext);

  const exclusions = config.search.result_filtering && config.search.result_filtering.persons ? config.search.result_filtering.persons.exclude : [];

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
      return `/${lang}/people/${person.uuid}`
    }
  }, [config, lang])

  return (
    <BasePanel
      className={props.className}
      icon='person'
      name='person'
      exclusions={exclusions}
      renderName={renderName}
      resolveDetailPageUrl={resolveDetailPageUrl}
      service={PeopleService}
    />
  );
};

export default Person;
