import TranslationContext from '@contexts/TranslationContext';
import { useContext } from 'react';
import { useStats } from 'react-instantsearch';

const Stats = () => {
  const { t } = useContext(TranslationContext);

  const { nbHits, nbPages, page, hitsPerPage } = useStats();

  const start = (nbPages > 0) ? ((page * hitsPerPage) + 1) : 0;
  const end = Math.min((page + 1) * hitsPerPage, nbHits);
  const formattedTotal = nbHits.toLocaleString();

  return (
    <p className='text-nowrap'>
      { t('ofResults', { start, end, total: formattedTotal }) }
    </p>
  );
};

export default Stats;
