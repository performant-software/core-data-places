import { useSearchConfig } from '@apps/search/SearchContext';
import TranslationContext from '@contexts/TranslationContext';
import { Checkbox, useGeoSearchToggle } from '@performant-software/core-data';
import { useContext } from 'react';

const GeosearchFilter = () => {
  const config = useSearchConfig();
  const { filterByMapBounds, setFilterByMapBounds } = useGeoSearchToggle();
  const { t } = useContext(TranslationContext);

  if (!config.geosearch) {
    return null;
  }

  return (
    <div
      className='text-sm flex items-center'
    >
      <Checkbox
        ariaLabel={t('filterMapBounds')}
        checked={filterByMapBounds}
        id='filterMapBounds'
        onClick={(checked) => setFilterByMapBounds(checked)}
      />
      <label
        htmlFor='filterMapBounds'
      >
        { t('filterMapBounds') }
      </label>
    </div>
  );
};

export default GeosearchFilter;