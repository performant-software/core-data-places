import clsx from 'clsx';
import { FacetTimeline, useCachedHits, Typesense as TypesenseUtils } from '@performant-software/core-data';
import { useNavigate } from '@peripleo/peripleo';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRange } from 'react-instantsearch';
import _ from 'underscore';
import { useSearchConfig } from "@apps/search/SearchConfigContext";

interface Props {
  className?: string;
  padding?: number,
}

const TimelineView = (props: Props) => {
  const config = useSearchConfig();
  const hits = useCachedHits();
  const navigate = useNavigate();

  const { canRefine, start, range, refine } = useRange({
    attribute: config.timeline?.date_range_facet
  });
  const { min, max } = range;
  const [value, setValue] = useState([min, max]);
  const from = Math.max(min, Number.isFinite(start[0]) ? start[0] : min);
  const to = Math.min(max, Number.isFinite(start[1]) ? start[1] : max);

  /**
   * Sets the value on the state when the from/to values change.
   */
  useEffect(() => {
    setValue([from, to]);
  }, [from, to]);

  /**
   * Memo-izes the data to be displayed on the timeline as events.
   */
  const data = useMemo(() => _.chain(hits)
    .map(
      (hit) => (
        // event_path not specified = event is the primary model
        config.timeline?.event_path
          ? hit[config.timeline.event_path]
          : hit
      )
    )
    .flatten()
    .uniq('uuid')
    .compact()
    .value(),
  [hits]);

  /**
   * On event click, navigates to the selected event.
   */
  const onEventClick = useCallback((ev) => navigate(`/events/${ev.id}`), []);

  /**
   * Only display if the facet is available to refine.
   */
  if (!canRefine) {
    return null;
  }

  return (
    <div
      className={clsx(
        'p-2',
        'bg-white/80',
        'backdrop-blur-sm',
        'shadow-sm',
        props.className
      )}
      // style prop required as dynamic class names are unsupported in Tailwind
      style={{ width: `calc(100vw - ${props.padding || 0}px)` }}
    >
      <FacetTimeline
        className='w-full max-w-full'
        data={data}
        onClick={onEventClick}
        range={range}
        refine={refine}
        start={value}
      />
    </div>
  )
};

export default TimelineView;