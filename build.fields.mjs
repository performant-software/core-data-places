import fs from 'fs';
import config from './config.json' assert { type: 'json' };

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

/**
 * Pull in fields/labels from "/projects/:project_id/descriptors".
 *
 * @returns {Promise<void>}
 */
const init = async () => {
  const fields = {};

  for (const projectId of config.core_data.project_ids) {
    const url = `${config.core_data.url}/core_data/public/v1/projects/${projectId}/descriptors`;
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