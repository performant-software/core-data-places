import MapSearchContext from '@apps/search/map/MapSearchContext';
import { useSearchConfig } from '@apps/search/SearchConfigContext';
import SearchHighlight from '@apps/search/map/SearchHighlight';
import TranslationContext from '@contexts/TranslationContext';
import Badge from '@components/Badge';
import { useCachedHits } from '@performant-software/core-data';
import { useContext, useMemo } from 'react';
import _ from 'underscore';

interface Props {
  feature?: any;
  hovered: any;
}

const Tooltip = ({ feature, hovered }: Props) => {
  const { result_card: config } = useSearchConfig();
  const { t } = useContext(TranslationContext);
  const cachedHits = useCachedHits();
  const { features } = useContext(MapSearchContext);

  /**
   * Memo-izes the hits based on the features.
   */
  const items = useMemo(() => {
    if (feature) {
      return feature.properties.items;
    }

    if (!hovered) {
      return [];
    }

    const value = [];

    let currentHover = hovered;

    if (!_.isArray(hovered)) {
      currentHover = [hovered];
    }

    _.each(currentHover, (c) => {
      const f = _.find(features, (f) => f.properties.uuid === c.properties.uuid);
      value.push(...f.properties.items)
    });

    return value;
  }, [feature, hovered]);

  /**
   * Memo-izes the first hit value. This record will be used as the display.
   */
  const hit = useMemo(() => {
    const first = _.first(items);
    return _.find(cachedHits, item => item.id === first?.id)
  }, [items]);

  /**
   * Memo-izes the count of records.
   */
  const count = useMemo(() => items.length - 1, [items]);

  return (
    <div
      className='rounded-sm px-4 py-3 text-sm bg-white shadow-sm border max-w-[350px]'
    >
      { config.title && (
        <SearchHighlight
          attribute={config.title}
          hit={hit}
        />
      )}
      { config.attributes && config.attributes.length > 0 && (
        <SearchHighlight
          attribute={config.attributes[0].name}
          classNames={{
            highlight: 'text-muted',
            root: 'mt-1'
          }}
          icon={config.attributes[0].icon}
          hit={hit}
        />
      )}
      { count > 0 && (
        <Badge
          className='text-white bg-primary absolute -top-3 -end-2'
          content={t('plusCount', { count })}
        />
      )}
    </div>
  )
};

export default Tooltip;
