import BasePanel from '@apps/search/panels/BasePanel';
import { usePeopleService } from '@performant-software/core-data';
import { getNameView } from '@utils/people';
import React, { useCallback } from 'react';

const Person = () => {
  /**
   * Returns a concatenation of the person's name attributes.
   *
   * @type {function(*): *}
   */
  const renderName = useCallback((person) => getNameView(person), []);

  return (
    <BasePanel
      name='person'
      renderName={renderName}
      useServiceHook={usePeopleService}
    />
  );
};

export default Person;
