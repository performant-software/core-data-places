import TranslationContext from '@apps/search/TranslationContext';
import { SelectRecordPanel } from '@performant-software/core-data';
import { useNavigate, useRuntimeConfig, useSelectionState } from '@peripleo/peripleo';
import { getIcon, getItemLabel } from '@utils/router';
import { parseFeature } from '@utils/search';
import clsx from 'clsx';
import { useCallback, useContext, useMemo } from 'react';

interface Props {
  className?: string;
}

const Selection = (props: Props) => {
  const config = useRuntimeConfig<any>();
  const navigate = useNavigate();
  const { selected, setSelected } = useSelectionState<any>();
  const { t } = useContext(TranslationContext);

  const { route } = config.search;

  /**
   * Memo-izes the parsed feature.
   */
  const feature = useMemo(() => parseFeature(selected), [selected]);

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
        items={feature?.properties?.items}
        label={label}
        onClick={onClick}
        onClose={onClose}
        renderItemName={(item) => item.name}
        title={feature?.properties?.name}
      />
    </aside>
  );
};

export default Selection;
