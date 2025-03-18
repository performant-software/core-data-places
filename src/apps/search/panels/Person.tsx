import BasePanel from '@apps/search/panels/BasePanel';
import PeopleService from '@backend/api/people';
import { getNameView } from '@utils/people';
import React, { useCallback } from 'react';
import {useRuntimeConfig} from '@peripleo/peripleo';

interface Props {
  className?: string;
}

const Person = (props: Props) => {
  const config: any = useRuntimeConfig();

  const exclusions = config.search.result_filtering && config.search.result_filtering.persons ? config.search.result_filtering.persons.exclude : [];

  /**
   * Returns a concatenation of the person's name attributes.
   *
   * @type {function(*): *}
   */
  const renderName = useCallback((person) => getNameView(person), []);

  return (
    <BasePanel
      className={props.className}
      icon='person'
      name='person'
      exclusions={exclusions}
      renderName={renderName}
      service={PeopleService}
    />
  );
};

export default Person;
