import _ from 'underscore';

const NAME_SEPARATOR = ' ';

/**
 * Returns the name view for the passed person.
 *
 * @param person
 */
export const getNameView = (person) => {
  return _.compact([
    person.first_name,
    person.middle_name,
    person.last_name
  ]).join(NAME_SEPARATOR)
};