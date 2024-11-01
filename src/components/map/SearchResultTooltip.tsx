import { String as StringUtils } from '@performant-software/shared-components';
import { useCachedHits } from '@performant-software/core-data';
import type { Feature, FeatureCluster } from '@peripleo/peripleo';
import React, { useMemo } from 'react';
import RelatedModel from './RelatedModel';

interface Props {
  event: MouseEvent;
  renderMoreLabel(count: number): string;
  target: Feature | FeatureCluster;
}

const SearchResultTooltip = (props: Props) => {
  const isCluster = useMemo(() => 'clusterId' in props.target, [props.target]);

  const feature = useMemo(() => isCluster ? (props.target as any)?.features[0] : props.target, [isCluster, props.target]);
  const count = useMemo(() => isCluster ? (props.target as any)?.features.length - 1 : 0, [isCluster, props.target]);

  const name = useMemo(() => StringUtils.truncate(feature.properties.name), [feature.properties.name]);
  const label = useMemo(() => count > 0 && props.renderMoreLabel ? props.renderMoreLabel(count) : null, [count, props.renderMoreLabel]);

  const hits = useCachedHits();
  // @ts-ignore
  const hit = useMemo(() => (hits ? hits.find((hit) => ('properties' in props.target && hit.record_id == props.target.properties.record_id)) : undefined), [props.target, hits])

  return (
    <div
      className='rounded px-2 py-1.5 text-sm shadow bg-black text-white'
    >
      { name }
      { label && (
        <span
          className='text-white/60 pl-2'
        >
          { label }
        </span>
      )}
      { feature && (
        <RelatedModel
          className='flex'
          hit={hit}
          prefix
        />
      )}
    </div>
  )
};

export default SearchResultTooltip;
