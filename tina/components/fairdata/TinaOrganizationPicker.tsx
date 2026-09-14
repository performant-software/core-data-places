import OrganizationsService from '@backend/api/coreData/organizations';
import createTinaModelPickerField from './createTinaModelPickerField';

const TinaOrganizationPicker = createTinaModelPickerField({
  fetchAll: (params) => OrganizationsService.fetchAll(params),
  responseKey: 'organizations'
});

export default TinaOrganizationPicker;
