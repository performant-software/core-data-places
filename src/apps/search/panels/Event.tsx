import BasePanel from '@apps/search/panels/BasePanel';
import EventsService from '@backend/api/events';
import TranslationContext from '@contexts/TranslationContext';
import { FuzzyDate as FuzzyDateUtils } from '@performant-software/shared-components';
import React, { useCallback, useContext } from 'react';
import _ from 'underscore';

interface Props {
  className?: string;
}

const Event = (props: Props) => {
  const { t } = useContext(TranslationContext);

  /**
   * Returns the start date label for the passed event.
   */
  const getStartDateLabel = useCallback((event) => event.end_date ? t('startDate') : t('date'), [t]);

  /**
   * Renders the label and value for the passed date.
   */
  const renderDate = useCallback((date, label) => {
    if (_.isEmpty(date)) {
      return null;
    }

    return (
      <div
        className='py-1'
      >
        <div
          className='py-1 text-muted'
        >
          { label }
        </div>
        <div
          className='font-medium overflow-hidden text-ellipsis'
        >
          { FuzzyDateUtils.getDateView(date) }
        </div>
      </div>
    );
  }, []);

  return (
    <BasePanel
      className={props.className}
      icon='date'
      name='event'
      renderItem={(event) => (
        <div
          className='text-sm'
        >
          { renderDate(event.start_date, getStartDateLabel(event)) }
          { renderDate(event.end_date, t('endDate')) }
          { event.description && (
            <p
              className='py-2'
            >
              { event.description }
            </p>
          )}
        </div>
      )}
      service={EventsService}
    />
  );
};

export default Event;
