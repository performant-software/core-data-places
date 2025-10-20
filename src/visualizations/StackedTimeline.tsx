import VisualizationContainer from '@components/VisualizationContainer';
import { getLanguageFromUrl } from '@i18n/utils';
import { DataVisualizationProps } from '@types';
import { useCallback, useMemo } from 'react';
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
import config from '@config';

const StackedTimeline = (props: DataVisualizationProps) => {
  
  /**
   * Memo-izes the data as parsed JSON.
  */
 const data = useMemo(() => JSON.parse(props.data), [props.data]);

 const language = useMemo(() => getLanguageFromUrl(window.location.pathname), [window.location.pathname]);

 const onClickBar = useCallback((data: any) => {
  if (data.uuid) {
    window.location.href = `/${language}/events/${data.uuid}`
  }
 }, [language]);

 const renderLabel = useCallback((props) => {
   const { x, y, width, height, value, index } = props;
   const horizontal = useMemo(() => (index <= data.events?.length/2 ? x + width + 6 : x - 6 ), [data]);
   const anchor = useMemo(() => (index <= data.events?.length/2 ? "start" : "end" ), [data]);
 
   return (
     <text x={horizontal} y={y + height / 2} fill="#666" textAnchor={anchor} dominantBaseline="middle">
       {value}
     </text>
   );
 }, [data]);

  return (
    <VisualizationContainer
      title={props.title}
    >
      <div className="w-full flex items-center justify-center">
        <ResponsiveContainer
          width='100%'
          height={data?.events?.length*50 || 500}
        >
          <BarChart
            data={data?.events}
            layout='vertical'
          >
            <CartesianGrid horizontal={false} />
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
                return tickDate.getFullYear().toString();
              }}
              domain={['dataMin', 'dataMax']}
              tickCount={30}
              scale='time'
              interval='preserveStartEnd'
            />
            <Bar
              dataKey='date_range'
              fill='var(--color-primary)'
              onClick={config.detail_pages?.includes('events') ? onClickBar : null}
            >
              <LabelList dataKey='name' content={renderLabel} />
            </Bar>
            <Tooltip cursor={false} formatter={(value, name, props) => {
              const start = new Date(value[0]*1000).getFullYear()
              const end = new Date(value[1]*1000).getFullYear()
              return ([
                `${Math.abs(start)}${start < 0 ? 'BCE' : ''} - ${Math.abs(end)}${end < 0 ? 'BCE' : ''}`,
                name.toString().replaceAll('_', ' ').toUpperCase()
              ])
            }}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </VisualizationContainer>
  );
};

export default StackedTimeline;