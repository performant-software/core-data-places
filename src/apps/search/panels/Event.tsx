import BasePanel from '@apps/search/panels/BasePanel';
import { useTranslations } from '@i18n/client';
import { useEventsService } from '@performant-software/core-data';
import { FuzzyDate as FuzzyDateUtils } from '@performant-software/shared-components';
import React, { useCallback } from 'react';
import _ from 'underscore';

const Event = () => {
  const { t } = useTranslations();

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
      <div>
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
      name='event'
      renderItem={(event) => (
        <>
          { renderDate(event.start_date, getStartDateLabel(event)) }
          { renderDate(event.end_date, t('endDate')) }
          { event.description && (
            <p
              className='py-2'
            >
              { event.description }
            </p>
          )}
        </>
      )}
      useServiceHook={useEventsService}
    />
  );
};

export default Event;
