import BasePanel from '@apps/search/map/panels/BasePanel';
import EventsService from '@backend/api/coreData/events';
import TranslationContext from '@contexts/TranslationContext';
import { FuzzyDate as FuzzyDateUtils } from '@performant-software/shared-components';
import { useRuntimeConfig } from '@peripleo/peripleo';
import { useCallback, useContext } from 'react';
import _ from 'underscore';

interface Props {
  className?: string;
}

const Event = (props: Props) => {
  const config = useRuntimeConfig();
  const { t, lang } = useContext(TranslationContext);

  /**
   * Returns the start date label for the passed event.
   */
  const getStartDateLabel = useCallback((event) => event.end_date ? t('start_date') : t('date'), [t]);

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

  /**
   * Resolves the URL for the detail page.
   */
  const resolveDetailPageUrl = useCallback((event) => {
    if (event && config.detail_pages && config.detail_pages.includes('events')) {
      return `/${lang}/events/${event.uuid}`;
    }
  }, [config, lang]);

  return (
    <BasePanel
      className={props.className}
      icon='date'
      name='event'
      exclusions={config.result_filtering?.events?.exclude}
      renderItem={(event) => (
        <div
          className='text-sm'
        >
          { renderDate(event.start_date, getStartDateLabel(event)) }
          { renderDate(event.end_date, t('end_date')) }
          { event.description && (
            <p
              className='py-2'
            >
              { event.description }
            </p>
          )}
        </div>
      )}
      resolveDetailPageUrl={resolveDetailPageUrl}
      service={EventsService}
    />
  );
};

export default Event;
