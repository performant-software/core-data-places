import { useHits } from 'react-instantsearch';
import GridHit from '@components/custom/project/GridHit'
import ImageHit from '@components/custom/project/ImageHit'
import ListHit from '@components/custom/project/ListHit'
import { useSearchConfig } from '@apps/search/SearchConfigContext';
import { Highlight } from 'react-instantsearch';
import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { getAttributes, getFacetLabel, getHitValue, getRelationshipLabel, isInverse } from '@utils/search';
import { MediaGallery } from '@performant-software/core-data';
import clsx from 'clsx';
import TranslationContext from '@contexts/TranslationContext';
import { hasDetailPage } from '@utils/detailPagePaths';
import { Models } from '@types';

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
  const [manifestUrl, setManifestUrl] = useState<string | null>(null);

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
      if (searchConfig.result_card?.relationships) {
        for (const key of Object.keys(hit)) {
          const val = hit[key];

          if (Array.isArray(val) && val.length > 0) {
            for (const item of val) {
              const isRelationship = item.inverse !== undefined;

              if (isRelationship && searchConfig.result_card.relationships.includes(key)) {
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
      }

      const attributes = [];

      for (const att of getAttributes(searchConfig)) {
        const value = getHitValue(hit, att.name, att.fuzzy_date);

        const trimmedName = att.name.replace(/\.\d+/g, '')
        let label = facetLabels.current[trimmedName];

        if (!label) {
          label = getFacetLabel(trimmedName, t, isInverse(trimmedName, items));
          facetLabels.current[att.name] = label;
        }

        if (value) {
          attributes.push({
            fuzzyDate: att.fuzzy_date,
            icon: att.icon,
            label,
            name: att.name,
            value
          });
        }
      }

      const tags = [];

      for (const tag of searchConfig.result_card?.tags || []) {
        const value = getHitValue(hit, tag.name, tag.fuzzy_date);

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
    () => hasDetailPage(searchConfig.route.slice(1) as Models),
    [searchConfig.route]
  );

  const renderItem = useCallback((item: any) => {
    const hitComp = (
      <HitComponent
        highlightComponent={Highlight}
        key={item.hit.id}
        labels={{
          tags: t('tags')
        }}
        setManifestUrl={setManifestUrl}
        {...item}
      />
    );

    if (isLinkable) {
      return (
        <a
          href={`/${props.lang}${searchConfig.route}/${item.hit.id}`}
          key={item.hit.id}
        >
          { hitComp }
        </a>
      );
    }

    return hitComp
  }, [isLinkable, searchConfig.route, props.lang, t]);

  return (
    <>
      <div
        className={clsx(
          'gap-4 pb-6',
          {'w-full grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4': isGrid},
          {'flex flex-col': !isGrid}
        )}>
          { hits.map((hit) => renderItem(hit)) }
      </div>
      { manifestUrl && (
        <MediaGallery
          manifestUrl={manifestUrl}
          onClose={() => setManifestUrl(null)}
        />
      )}
    </>
  );
};

export default Hits;