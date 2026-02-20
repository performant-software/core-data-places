import { useCurrentRoute } from '@peripleo/peripleo';
import { getCurrentId } from '@utils/router';
import { useCallback } from 'react';

const useSelectable = () => {
  const route = useCurrentRoute();
  const id = getCurrentId(route);

  const isSelected = useCallback((hit) => hit.id === id, [id]);

  return {
    isSelected
  };
};

export default useSelectable;