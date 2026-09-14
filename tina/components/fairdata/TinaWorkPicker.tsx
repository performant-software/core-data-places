import WorksService from '@backend/api/coreData/works';
import createTinaModelPickerField from './createTinaModelPickerField';

const TinaWorkPicker = createTinaModelPickerField({
  fetchAll: (params) => WorksService.fetchAll(params),
  responseKey: 'works'
});

export default TinaWorkPicker;
