import TranslationContext from '@apps/search/TranslationContext';
import { Checkbox, useGeoSearchToggle } from '@performant-software/core-data';
import { useRuntimeConfig } from '@peripleo/peripleo';
import { useContext } from 'react';

const GeosearchFilter = () => {
  const config = useRuntimeConfig<any>();
  const { filterByMapBounds, setFilterByMapBounds } = useGeoSearchToggle();
  const { t } = useContext(TranslationContext);

  if (!config.search?.geosearch) {
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