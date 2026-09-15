import InstancesService from '@backend/api/coreData/instances';
import createTinaModelPickerField from './createTinaModelPickerField';

const TinaInstancePicker = createTinaModelPickerField({
  fetchAll: (params) => InstancesService.fetchAll(params),
  responseKey: 'instances'
});

export default TinaInstancePicker;
