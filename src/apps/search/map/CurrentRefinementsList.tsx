import TranslationContext from '@contexts/TranslationContext';
import { Pill } from '@performant-software/core-data';
import { getFacetLabel, isInverse } from '@utils/search';
import { useCallback, useContext } from 'react';
import { useCurrentRefinements, useHits } from 'react-instantsearch';
import _ from 'underscore';

const CurrentRefinementsList = () => {
  const { items, refine } = useCurrentRefinements();
  const { items: hits } = useHits();
  const { t } = useContext(TranslationContext);

  /**
   * Returns the label for the passed attribute.
   */
  const getLabel = useCallback((attribute) => (
    getFacetLabel(attribute, t, isInverse(attribute, hits))
  ), [hits.length, t]);

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
              label={`${getLabel(item.label)}: ${refinement.label}`}
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