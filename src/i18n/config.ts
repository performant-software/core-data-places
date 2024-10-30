import i18n from './i18n.json';
import userDefinedFields from "./userDefinedFields.json";

const config = {
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
        routing: {
            prefixDefaultLocale: true
        }
    },
    ui: {
        ...i18n,
        ...userDefinedFields
    },
    featuredModel: {
        uuid: '146d2d39-e6b5-4f4f-aaba-0ffb69a038c1',
        labelField: '146d2d39-e6b5-4f4f-aaba-0ffb69a038c1.name.value'
    }
};

export default config;