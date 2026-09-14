import PeopleService from '@backend/api/coreData/people';
import createTinaModelPickerField from './createTinaModelPickerField';
import { getNameView } from '@utils/people';

const TinaPersonPicker = createTinaModelPickerField({
  fetchAll: (params) => PeopleService.fetchAll(params),
  responseKey: 'people',
  transformItem: (person: any) => ({ name: getNameView(person), uuid: person.uuid })
});

export default TinaPersonPicker;
