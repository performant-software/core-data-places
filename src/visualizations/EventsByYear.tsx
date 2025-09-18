import VisualizationContainer from '@components/VisualizationContainer';
import { DataVisualizationProps } from '@types';
import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Props extends DataVisualizationProps {
  interval: number;
}

const DEFAULT_INTERVAL = 10;

const EventsByYear = (props: Props) => {
  /**
   * Don't render if no data is passed.
   */
  if (!props?.data) {
    return null;
  }
  
  const { interval = DEFAULT_INTERVAL } = props;

  /**
   * Memo-izes the data as parsed JSON.
   */
  const data = useMemo(() => JSON.parse(props.data), [props.data]);

  return (
    <VisualizationContainer
      title={props.title}
    >
      <ResponsiveContainer
        width='100%'
        height={500}
      >
        <BarChart
          margin={{
            top: 0,
            left: -40,
            right: 0,
            bottom: 0
          }}
          data={data}
        >
          <CartesianGrid
            strokeDasharray='3 3'
          />
          <XAxis
            allowDataOverflow
            dataKey='year'
            domain={([min, max]) => [
              Math.round(min / interval) * interval,
              Math.ceil(max / interval) * interval
            ]}
            interval={interval - 1}
            scale='time'
            type='number'
          />
          <YAxis
            allowDataOverflow
            allowDecimals={false}
            dataKey='count'
            type='number'
          />
          <Bar
            dataKey='count'
            fill='var(--color-primary)'
          />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </VisualizationContainer>
  );
};

export default EventsByYear;