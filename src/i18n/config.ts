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
    }
};

export default config;