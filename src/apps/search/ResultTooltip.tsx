import SearchHighlight from '@apps/search/SearchHighlight';
import TranslationContext from '@apps/search/TranslationContext';
import Badge from '@components/Badge';
import config from '@config';
import { useCachedHits } from '@performant-software/core-data';
import type { Feature, FeatureCluster } from '@peripleo/peripleo';
import { parseFeature } from '@utils/search';
import { useContext, useMemo } from 'react';
import _ from 'underscore';

interface Props {
  event: MouseEvent;
  target: Feature<any> | FeatureCluster<any>;
}

const ResultTooltip = (props: Props) => {
  const { t } = useContext(TranslationContext);
  const hits = useCachedHits();

  /**
   * Memo-izes whether the passed target represents a cluster of coordinates.
   */
  const isCluster = useMemo(() => 'clusterId' in props.target, [props.target]);

  /**
   * Memo-izes the feature for the passed target.
   */
  const feature = useMemo(() => {
    if (isCluster) {
      return (props.target as any)?.features[0];
    }

    return parseFeature(props.target);
  }, [isCluster, props.target]);

  /**
   * Memo-izes the count for the passed target.
   */
  const count = useMemo(() => {
    if (isCluster) {
      return (props.target as any)?.features.length - 1;
    }

    return feature.properties?.items?.length - 1;
  }, [feature, isCluster, props.target]);

  /**
   * Memo-izes the hit for the passed target. If the target represents multiple hits, the first in the array will
   * be used.
   */
  const hit = useMemo(() => _.findWhere(hits, { uuid: feature?.properties?.items[0]?.uuid }), [hits, feature]);

  return (
    <div
      className='rounded px-2 py-1.5 text-sm shadow bg-black text-white border'
    >
      { config.search.result_card.title && (
        <SearchHighlight
          attribute={config.search.result_card.title}
          className='truncate'
          badge={!isCluster}
          hit={hit}
        />
      )}
      { !isCluster && config.search.result_card.subtitle && (
        <SearchHighlight
          attribute={config.search.result_card.subtitle}
          className='truncate'
          badge={!isCluster}
          hit={hit}
        />
      )}
      {  count > 0 && (
        <Badge
          className='text-white bg-primary absolute -top-4 -end-2 dark:border-gray-900 border-2 border-white'
          content={t('plusCount', { count })}
        />
      )}
    </div>
  )
};

export default ResultTooltip;
