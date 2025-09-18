import VisualizationContainer from '@components/VisualizationContainer';
import { Timeline, Typesense as TypesenseUtils } from '@performant-software/core-data';
import type { DataVisualizationProps } from '@types';
import React, { useMemo } from 'react';
import _ from 'underscore';

const TimelineVisualization = (props: DataVisualizationProps) => {
  /**
   * Don't render if no data was passed.
   */
  if (!props?.data) {
    return null;
  }
  
  /**
   * Memo-izes the "data" prop as JSON.
   */
  const data = useMemo(() => JSON.parse(props.data), [props.data]);

  /**
   * Memo-izes the events and sets the "date" attribute.
   */
  const events = useMemo(() => _.map(data.events, (event) => ({
    ...event,
    date: TypesenseUtils.getDate(event)
  })), [data]);

  return (
    <VisualizationContainer
      title={props.title}
    >
      <Timeline
        events={events}
        range={{ min: data.min, max: data.max }}
      />
    </VisualizationContainer>
  );
};

export default TimelineVisualization;