import EventsService from '@backend/api/coreData/events';
import createTinaModelPickerField from './createTinaModelPickerField';

const TinaEventPicker = createTinaModelPickerField({
  fetchAll: (params) => EventsService.fetchAll(params),
  responseKey: 'events'
});

export default TinaEventPicker;