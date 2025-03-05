import TranslationContext from '@apps/search/TranslationContext';
import { Pill } from '@performant-software/core-data';
import { getFacetLabel } from '@utils/search';
import { useCallback, useContext } from 'react';
import { useCurrentRefinements } from 'react-instantsearch';
import _ from 'underscore';
import config from '@config';

const CurrentRefinementsList = () => {
  const { items, refine } = useCurrentRefinements();
  const { t } = useContext(TranslationContext);

  /**
   * Returns the label for the passed attribute.
   */
  const getLabel = useCallback((attribute) => getFacetLabel(attribute, t), [t]);

  if (_.isEmpty(items)) {
    return null;
  }

  return (
    <ul
      className='pb-6'
    >
      { _.map(items, (item, index) => (
        <li
          key={index}
        >
          { _.map(item.refinements, (refinement) => (
            <Pill
              className='text-xs font-light my-1'
              label={`${getLabel(item.label)}: ${config.search.date_facets?.includes(item.label) 
                ? refinement.label.replace(refinement.value.toString(), (new Date(refinement.value*1000)).getFullYear().toString()) 
                : refinement.label}`}
              onRemove={() => refine(refinement)}
              primary
            />
          ))}
        </li>
      ))}
    </ul>
  );
};

export default CurrentRefinementsList;