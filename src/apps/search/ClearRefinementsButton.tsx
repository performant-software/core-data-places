import TranslationContext from '@apps/search/TranslationContext';
import { Icon } from '@performant-software/core-data';
import { useContext } from 'react';
import { useClearRefinements, useCurrentRefinements } from 'react-instantsearch';
import _ from 'underscore';

const ClearRefinementsButton = () => {
  const { refine } = useClearRefinements();
  const { items } = useCurrentRefinements();
  const { t } = useContext(TranslationContext);

  if (_.isEmpty(items)) {
    return null;
  }

  return (
    <button
      className='flex items-center gap-x-2 text-sm'
      onClick={() => refine()}
      type='button'
    >
      <Icon
        name='reset'
      />
      { t('reset') }
    </button>
  );
};

export default ClearRefinementsButton;