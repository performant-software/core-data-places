import { useSearchConfig } from '@apps/search/SearchContext';
import SearchHighlight from '@apps/search/SearchHighlight';
import TranslationContext from '@contexts/TranslationContext';
import Badge from '@components/Badge';
import { parseFeature } from '@utils/search';
import { useContext, useMemo } from 'react';
import { useCachedHits } from '@performant-software/core-data';
import _ from 'underscore';

interface Props {
  hovered: any;
}

const Tooltip = (props: Props) => {
  const { result_card: config } = useSearchConfig();
  const { t } = useContext(TranslationContext);
  const cachedHits = useCachedHits();

  /**
   * Memo-izes the passed hovered items by parsing "properties" attribute of each.
   */
  const features = useMemo(() => {
    let items = props.hovered;

    if (!_.isArray(props.hovered)) {
      items = [props.hovered];
    }

    return _.map(items, (item) => parseFeature(item));
  }, [props.hovered]);

  /**
   * Memo-izes the hits based on the features.
   */
  const hits = useMemo(() => (
    _.chain(features)
      .map((feature) => feature.properties.items)
      .flatten()
      .value()
  ), [features]);

  /**
   * Memo-izes the first hit value. This record will be used as the display.
   */
  const hit = useMemo(() => {
    const first = _.first(hits);
    return _.find(cachedHits, item => item.id === first.id)
  }, [hits]);

  /**
   * Memo-izes the count of records.
   */
  const count = useMemo(() => hits.length - 1, [hits]);

  return (
    <div
      className='rounded px-4 py-3 text-sm bg-white shadow border max-w-[350px]'
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
