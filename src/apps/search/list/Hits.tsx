import { useHits } from 'react-instantsearch';
import GridHit from '@components/custom/project/GridHit'
import ImageHit from '@components/custom/project/ImageHit'
import ListHit from '@components/custom/project/ListHit'
import { useSearchConfig } from '@apps/search/SearchConfigContext';
import { Highlight } from 'react-instantsearch';
import { useCallback, useContext, useMemo, useRef } from 'react';
import { getAttributes, getFacetLabel, getHitValue, getRelationshipLabel, isInverse } from '@utils/search';
import clsx from 'clsx';
import config from '@config';
import TranslationContext from '@contexts/TranslationContext';

interface Props {
  lang: string;
}

const hitComponents = {
  grid: GridHit,
  image: ImageHit,
  list: ListHit
};

const Hits = (props: Props) => {
  const searchConfig = useSearchConfig();
  const { items } = useHits();
  const { t } = useContext(TranslationContext);

  const isGrid = useMemo(() => searchConfig.type !== 'list', [searchConfig.type]);

  const HitComponent = useMemo(() => hitComponents[searchConfig.type], [searchConfig.type]);

  // keep a mapping of facet labels outside the component
  // so we don't need to run the utility functions over and over
  const facetLabels = useRef({});

  /**
   * Construct a hits array with the values and labels so the custom hit components
   * don't need to rely on InstantSearch hooks, importing config, etc.
   */
  const hits = useMemo(() => {
    return items.map((hit) => {
      const relationships = {};

      // assemble relationships for hit components
      for (const key of Object.keys(hit)) {
        const val = hit[key];

        if (Array.isArray(val) && val.length > 0) {
          for (const item of val) {
            const isRelationship = item.inverse !== undefined;

            if (isRelationship) {
              if (relationships[key]) {
                relationships[key].items.push({
                  name: item.name,
                  uuid: item.uuid
                });
              } else {
                relationships[key] = {
                  label: getRelationshipLabel(key, t, item.inverse),
                  items: [{
                    name: item.name,
                    uuid: item.uuid
                  }]
                };
              }
            }
          }
        }
      }

      const attributes = [];

      for (const att of getAttributes(searchConfig)) {
        const value = getHitValue(hit, att.name);

        const trimmedName = att.name.replace(/\.\d+/g, '')
        let label = facetLabels.current[trimmedName];

        if (!label) {
          label = getFacetLabel(trimmedName, t, isInverse(trimmedName, items));
          facetLabels.current[att.name] = label;
        }

        if (value) {
          attributes.push({
            icon: att.icon,
            label,
            name: att.name,
            value
          });
        }
      }

      const tags = [];

      for (const tag of searchConfig.result_card?.tags || []) {
        const value = getHitValue(hit, tag.name);

        if (value) {
          tags.push({
            ...tag,
            value
          });
        }
      }

      return {
        hit,
        attributes,
        relationships,
        tags
      };
    });
  }, [items, t, searchConfig]);

  const isLinkable = useMemo(
    () => config.detail_pages?.includes(searchConfig.route.slice(1)),
    [searchConfig.route]
  );

  const renderItem = useCallback((item: any) => {
    const hitComp = (
      <HitComponent
        highlightComponent={Highlight}
        key={item.hit.id}
        {...item}
      />
    );

    if (isLinkable) {
      return (
        <a href={`/${props.lang}${searchConfig.route}/${item.hit.id}`}>
          {hitComp}
        </a>
      );
    }

    return hitComp
  }, [isLinkable, searchConfig.route, props.lang]);

  return (
    <div
      className={clsx(
        'flex flex-col gap-4 py-6',
        {'flex-row flex-wrap': isGrid},
        {'flex-col': !isGrid}
      )}>
        { hits.map((hit) => renderItem(hit)) }
    </div>
  );
};

export default Hits;