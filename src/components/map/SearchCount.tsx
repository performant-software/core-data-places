import { useSearchBox, useCachedHits } from '@performant-software/core-data';
import clsx from 'clsx';
import { useContext, useMemo } from 'react';
import _ from 'underscore';
import TranslationContext from './TranslationContext';

interface Props {
  className?: string;
}

const SearchCount = (props: Props) => {
  const hits = useCachedHits();
  const { query } = useSearchBox();
  const { t } = useContext(TranslationContext);

  const count = hits?.length || 0;

  const content = useMemo(() => (
    count === 1
      ? t('resultsCountSingular', { query })
      : t('resultsCount', { count, query })
  ), [count, query]);

  if (_.isEmpty(query)) {
    return null;
  }

  return (
    <div
      className={clsx('text-gray-1000', 'font-semibold', props.className)}
    >
      { content }
    </div>
  );
};

export default SearchCount;