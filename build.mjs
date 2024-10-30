import fs from 'fs';
import config from './public/config.json' assert { type: 'json' };
import { getProjectDescriptorsURL } from './src/helpers/core-data';

const CONTEXT_SEPARATOR = '->';

const getLabel = (field) => {
  const label = [];

  if (field.context) {
    label.push(field.context);
    label.push(CONTEXT_SEPARATOR);
  }

  label.push(field.label);

  return label.join(' ');
};

const init = async () => {
  const fields = {};

  for (const projectId in config.core_data.project_ids) {
    const url = getProjectDescriptorsURL(projectId)
    const payload = await fetch(url).then((response) => response.json());

    payload?.descriptors?.forEach((field) => {
      fields[field.identifier] = {
        tinaLabel: getLabel(field),
        defaultValue: field.label
      };
    });
  }

  const content = JSON.stringify(fields, null, 2);
  fs.writeFileSync('./src/i18n/userDefinedFields.json', content, 'utf8');
};

init();