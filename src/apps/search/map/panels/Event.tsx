import BasePanel from '@apps/search/map/panels/BasePanel';
import EventsService from '@backend/api/coreData/events';
import TranslationContext from '@contexts/TranslationContext';
import { useRuntimeConfig } from '@peripleo/peripleo';
import { useCallback, useContext } from 'react';
import _ from 'underscore';
import { hasDetailPage } from '@utils/detailPagePaths';
import { renderEvent } from '@root/src/utils/models';

interface Props {
  className?: string;
}

const Event = (props: Props) => {
  const config = useRuntimeConfig();
  const { t, lang } = useContext(TranslationContext);

  const renderItem = useCallback((event: any) => renderEvent(event, t), [t]);

  /**
   * Resolves the URL for the detail page.
   */
  const resolveDetailPageUrl = useCallback((event) => {
    if (event && hasDetailPage('events')) {
      return `/${lang}/events/${event.uuid}`;
    }
  }, [lang]);

  return (
    <BasePanel
      className={props.className}
      icon='date'
      name='event'
      exclusions={config.result_filtering?.events?.exclude}
      renderItem={renderItem}
      resolveDetailPageUrl={resolveDetailPageUrl}
      service={EventsService}
    />
  );
};

export default Event;
