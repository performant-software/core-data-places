import TranslationContext from '@apps/search/TranslationContext';
import { Icon } from '@performant-software/core-data';
import { useContext } from 'react';
import { useClearRefinements } from 'react-instantsearch';

const ClearRefinementsButton = () => {
  const { refine } = useClearRefinements();
  const { t } = useContext(TranslationContext);

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