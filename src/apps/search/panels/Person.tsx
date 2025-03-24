import BasePanel from '@apps/search/panels/BasePanel';
import PeopleService from '@backend/api/people';
import { useRuntimeConfig } from '@peripleo/peripleo';
import { getNameView } from '@utils/people';
import React, { useCallback } from 'react';

interface Props {
  className?: string;
}

const Person = (props: Props) => {
  const config = useRuntimeConfig();

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
      exclusions={config.result_filtering?.people?.exclude}
      renderName={renderName}
      service={PeopleService}
    />
  );
};

export default Person;
