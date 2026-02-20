import { Pagination as PerformantPagination } from '@performant-software/core-data';
import { useHitsPerPage, usePagination } from 'react-instantsearch';
import { useCallback, useState } from 'react';

const HITS_PER_PAGE_DUMMY_ARRAY = [
  { value: 50, default: true, label: ''}
];

const Pagination = () => {
  const [page, setPage] = useState(1);
  const [hitsPerPage, setHitsPerPage] = useState(50);

  const {
    nbPages,
    refine,
    nbHits,
  } = usePagination();

  const {
    refine: refineHitsPerPage,
  } = useHitsPerPage({
    // the actual hits per page dropdown is managed in the downstream component
    // but, frustratingly, useHitsPerPage expects an array of options regardless.
    // this param is just here so it doesn't error out.
    items: HITS_PER_PAGE_DUMMY_ARRAY
  });

  const onChangeHitsPerPage = useCallback((value: number) => {
    setHitsPerPage(value);
    refineHitsPerPage(value);
  }, [refineHitsPerPage]);

  const onChangePage = useCallback((value: number) => {
    setPage(value);
    refine(value - 1);
  }, [refine]);

  return (
    <PerformantPagination
      className='bg-transparent!'
      nbHits={nbHits}
      page={page}
      nbPages={nbPages}
      hitsPerPage={hitsPerPage}
      onChangeHitsPerPage={onChangeHitsPerPage}
      onChangePage={onChangePage}
    />
  );
};

export default Pagination;