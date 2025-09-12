import { useSearchConfig } from '@apps/search/SearchContext';
import { buildMapData, buildTableData, buildTimelineData } from '@utils/visualization';
import Map from '@visualizations/Map';
import Table from '@visualizations/Table';
import Timeline from '@visualizations/Timeline';
import clsx from 'clsx';
import { useMemo } from 'react';

interface Props {
  data: any;
  view: number;
}

const ItemViews = {
  map: 0,
  table: 1,
  timeline: 2
};

const SearchVisualizations = (props: Props) => {
  const config = useSearchConfig();

  /**
   * Memo-izes the data for the map visualization.
   */
  const mapData = useMemo(() => JSON.stringify(buildMapData(config, props.data)), [props.data]);

  /**
   * Memo-izes the data for the table visualization.
   */
  const tableData = useMemo(() => JSON.stringify(buildTableData(config, props.data)), [props.data]);

  /**
   * Memo-izes the data for the timeline visualization.
   */
  const timelineData = useMemo(() => JSON.stringify(buildTimelineData(config, props.data)), [props.data]);

  return (
    <div
      className='py-4'
    >
      <div
        className={clsx({ 'hidden': props.view !== ItemViews.map })}
      >
        <Map
          data={mapData}
        />
      </div>
      <div
        className={clsx({ 'hidden': props.view !== ItemViews.table })}
      >
        <Table
          data={tableData}
        />
      </div>
      <div
        className={clsx({ 'hidden': props.view !== ItemViews.timeline })}
      >
        <Timeline
          data={timelineData}
        />
      </div>
    </div>
  );
};

export default SearchVisualizations;

export {
  ItemViews
};