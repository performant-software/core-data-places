import { useSearchBox, useCachedHits } from '@performant-software/core-data';
import clsx from 'clsx';
import React, { useMemo } from 'react';
import { useStats } from 'react-instantsearch';
import _ from 'underscore';

interface Props {
  className?: string;
}

const SearchCount = (props: Props) => {
  // const { nbHits: count } = useStats();
  const count = useCachedHits() ? useCachedHits().length : 0;
  const { query } = useSearchBox();

  const content = useMemo(() => (
    count === 1
      ? `${count} result for ${query}`
      : `${count} results for ${query}`
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
