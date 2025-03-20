import TranslationContext from '@apps/search/TranslationContext';
import { SelectRecordPanel } from '@performant-software/core-data';
import { useSelection } from '@peripleo/maplibre';
import { useNavigate, useRuntimeConfig } from '@peripleo/peripleo';
import { getIcon, getItemLabel } from '@utils/router';
import { parseFeature } from '@utils/search';
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
  const config = useRuntimeConfig<any>();
  const navigate = useNavigate();
  const { t } = useContext(TranslationContext);

  const { selection: { selected } = {}, setSelected } = useSelection() || {};

  const { route } = config.search;

  /**
   * Memo-izes an array of selected records.
   */
  const records = useMemo(() => {
    let value;

    if (selected) {
      if (_.isArray(selected)) {
        value = [...selected];
      } else {
        value = [selected];
      }
    }

    return value;
  }, [selected]);

  /**
   * Memo-izes the parsed selected.
   */
  const items = useMemo(() => (
    _.chain(records)
      .map((record) => parseFeature(record))
      .map((record) => record.properties.items)
      .flatten()
      .value()
  ), [records]);

  /**
   * Memo-izes the icon name for the route.
   */
  const itemIcon = useMemo(() => getIcon(route), []);

  /**
   * Memo-izes the label for the route.
   */
  const label = useMemo(() => t('selectRecord', { name: getItemLabel(route, t) }), [t]);

  /**
   * Clears the selection and navigates to the URL for the passed item.
   */
  const onClick = useCallback((item) => {
    setSelected(null);
    navigate(`${route}/${item.uuid}`);
  }, []);

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

    if (records?.length === 1) {
      const [record,] = records;
      value = record.properties?.name;
    } else {
      value = t('multipleLocations');
    }

    return value;
  }, [records]);

  /**
   * Navigate to the root path if the selection is cleared.
   */
  useEffect(() => {
    if (_.isEmpty(records)) {
      navigate('/');
    }
  }, [records]);

  if (_.isEmpty(items)) {
    return null;
  }

  return (
    <aside
      className={clsx(
        'flex',
        'flex-col',
        'bg-white/80',
        'backdrop-blur',
        'shadow',
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
