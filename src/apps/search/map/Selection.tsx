import MapSearchContext from '@apps/search/map/MapSearchContext';
import { useSearchConfig } from '@apps/search/SearchConfigContext';
import TranslationContext from '@contexts/TranslationContext';
import { SelectRecordPanel } from '@performant-software/core-data';
import { useSelection } from '@peripleo/maplibre';
import { useNavigate } from '@peripleo/peripleo';
import { getIcon, getItemLabel } from '@utils/router';
import clsx from 'clsx';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo
} from 'react';
import _ from 'underscore';

interface Props {
  className?: string;
}

const Selection = (props: Props) => {
  const config = useSearchConfig();
  const navigate = useNavigate();

  const { features } = useContext(MapSearchContext);
  const { t } = useContext(TranslationContext);

  const { selection: { selected } = {}, setSelected } = useSelection() || {};

  const { route } = config;

  /**
   * Memo-izes the selected features.
   */
  const selectedFeatures = useMemo(() => {
    if (!selected) {
      return [];
    }

    let selectedItems = selected;

    if (!_.isArray(selected)) {
      // @ts-ignore
      selectedItems = [selected];
    }

    const ids = _.map(selectedItems, (s) => s.properties.uuid);
    return _.filter(features, (f) => ids.includes(f.properties.uuid));
  }, [features, selected]);

  /**
   * Memo-izes the parsed selected.
   */
  const items = useMemo(() => (
    _.chain(selectedFeatures)
      .map((feature) => feature.properties.items)
      .flatten()
      .value()
  ), [selected]);

  /**
   * Memo-izes the icon name for the route.
   */
  const itemIcon = useMemo(() => getIcon(route), []);

  /**
   * Memo-izes the label for the route.
   */
  const label = useMemo(() => t('selectRecord', { name: getItemLabel(route, t) }), [t]);

  /**
   * Navigates to the URL for the passed item.
   */
  const onClick = useCallback((item) => navigate(`${route}/${item.uuid}`), []);

  /**
   * Clears the selection and navigates back to the root URL.
   */
  const onClose = useCallback(() => {
    setSelected(null);
    navigate('/');
  }, []);

  /**
   * Memo-izes the title for the selection panel. If a single point was selected, we'll display the name of the place
   * record. If a cluster was selected, we'll display a more generic title.
   */
  const title = useMemo(() => {
    let value;

    if (selectedFeatures?.length === 1) {
      const [feature,] = selectedFeatures;
      value = feature.properties?.name;
    } else {
      value = t('multipleLocations');
    }

    return value;
  }, [selectedFeatures]);

  /**
   * Determines if we can navigate without needing the user to select a record.
   */
  useEffect(() => {
    // Navigate to the root path if the panel is closed.
    if (_.isEmpty(selectedFeatures)) {
      navigate('/');
    }

    // Navigate directly to the record
    if (selectedFeatures.length === 1) {
      const [selectedFeature,] = selectedFeatures;

      if (selectedFeature.properties.items.length === 1) {
        const [item,] = selectedFeature.properties.items;
        navigate(`${config.route}/${item.id}`);
      }
    }
  }, [selectedFeatures]);

  if (_.isEmpty(items)) {
    return null;
  }

  return (
    <aside
      className={clsx(
        'flex',
        'flex-col',
        'bg-white/80',
        'backdrop-blur-sm',
        'shadow-sm',
        'overflow-y-auto',
        props.className
      )}
    >
      <SelectRecordPanel
        headerIcon='location'
        itemIcon={itemIcon}
        items={items}
        label={label}
        onClick={onClick}
        onClose={onClose}
        renderItemName={(item) => item.name}
        title={title}
      />
    </aside>
  );
};

export default Selection;
