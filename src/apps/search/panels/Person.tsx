import BasePanel from '@apps/search/panels/BasePanel';
import PeopleService from '@backend/api/people';
import { getNameView } from '@utils/people';
import React, { useCallback } from 'react';

interface Props {
  className?: string;
}

const Person = (props: Props) => {
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
      renderName={renderName}
      service={PeopleService}
    />
  );
};

export default Person;
