import ItemsService from '@backend/api/coreData/items';
import createTinaModelPickerField from './createTinaModelPickerField';

const TinaItemPicker = createTinaModelPickerField({
  fetchAll: (params) => ItemsService.fetchAll(params),
  responseKey: 'items'
});

export default TinaItemPicker;