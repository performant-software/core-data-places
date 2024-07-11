const fs = require('fs');

const getFields = async () => {
    const coreDataPayload = await fetch('https://app.coredata.cloud/core_data/public/v1/projects/5/descriptors').then((res) => {
        return res.json();
    });
    let coreDataFields = '';
    let enJson = {};
    coreDataPayload && coreDataPayload.descriptors && coreDataPayload.descriptors.forEach((field, idx) => {
            const label = `${field?.context ? `${field.context} -> ` : ''}${field.label}`;
            coreDataFields += `${idx > 0 ? ',\n\t': '\t'}"${field.identifier}": {\n\t\tcaption: m.${`t_${field.identifier.replaceAll('-', '').replaceAll(' ', '')}`}(),\n\t\ttinaLabel: "${label}"\n\t}`;
            enJson[`t_${field.identifier.replaceAll('-', '').replaceAll(' ', '')}`] = field.label;
    })
    // create new user defined field config file
    const userDefinedFields = `import * as m from "../paraglide/messages.js";\n\nconst userDefinedFields = {\n${coreDataFields}\n}\n\nexport default userDefinedFields;`
    fs.writeFileSync('./src/i18n/userDefinedFields.ts', userDefinedFields);
    console.log('New userDefinedFields file created!');

    // put initial English values in
    let en = JSON.parse(fs.readFileSync('./content/ui/en.json', 'utf8'));
    Object.keys(enJson).forEach((key) => {
        if (!Object.keys(en).includes(key)) {
            en[key] = enJson[key];
        }
    });
    fs.writeFileSync('./content/ui/en.json', JSON.stringify(en, null, '\t'));
    console.log('Default English values populated!');
}

getFields();
