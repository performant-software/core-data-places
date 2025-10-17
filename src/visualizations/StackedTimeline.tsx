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
  ResponsiveContainer,
  LabelList
} from 'recharts';

interface Props extends DataVisualizationProps {
  interval: number;
}

const DEFAULT_INTERVAL = 10;

const StackedTimeline = (props: DataVisualizationProps) => {

  /**
   * Memo-izes the data as parsed JSON.
   */
  const data = useMemo(() => JSON.parse(props.data), [props.data]);

  console.log(data)

  return (
    <VisualizationContainer
      title={props.title}
    >
      <ResponsiveContainer
        width='100%'
        minHeight={500}
      >
        <BarChart
          data={data?.events?.sort((a,b) => a.date_range[0] - b.date_range[0])}
          layout='vertical'
        >
          <YAxis
            dataKey='name'
            type='category'
            hide
          />
          <XAxis
            dataKey='date_range'
            type='number'
            orientation='top'
            tickFormatter={(tick) => {
              const tickDate = new Date(tick*1000);
              return tickDate.toLocaleDateString('en-US', { year: 'numeric'})
            }}
            domain={['dataMin', 'dataMax']}
            tickCount={10}
            interval={'preserveStartEnd'}
          />
          <Bar
            dataKey='date_range'
            fill='var(--color-primary)'
          >
            <LabelList dataKey='name' position='bottom' />
          </Bar>
          {/* <Tooltip /> */}
        </BarChart>
      </ResponsiveContainer>
    </VisualizationContainer>
  );
};

export default StackedTimeline;