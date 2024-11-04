import { useCachedHits } from '@performant-software/core-data';
import type { Feature, FeatureCluster } from '@peripleo/peripleo';
import { useContext, useMemo } from 'react';
import _ from 'underscore';
import Badge from '../Badge';
import config from '../../../public/config.json';
import SearchHighlight from './SearchHighlight';
import TranslationContext from './TranslationContext';

interface Props {
  event: MouseEvent;
  target: Feature | FeatureCluster;
}

const SearchResultTooltip = (props: Props) => {
  const { t } = useContext(TranslationContext);
  const hits = useCachedHits();

  const isCluster = useMemo(() => 'clusterId' in props.target, [props.target]);
  const feature = useMemo(() => isCluster ? (props.target as any)?.features[0] : props.target, [isCluster, props.target]);
  const count = useMemo(() => isCluster ? (props.target as any)?.features.length - 1 : 0, [isCluster, props.target]);
  const hit = useMemo(() => _.findWhere(hits, { record_id: feature?.properties.record_id }), [hits, feature]);

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
      { isCluster && count > 0 && (
        <Badge
          className='text-white bg-blue-600 absolute -top-4 -end-2 dark:border-gray-900 border-2 border-white'
          content={t('plusCount', { count })}
        />
      )}
    </div>
  )
};

export default SearchResultTooltip;
