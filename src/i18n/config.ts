import userDefinedFields from "./userDefinedFields";

const config = {
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
        routing: {
            prefixDefaultLocale: false
        }
    },
    ui: {
        map: {
            tinaLabel: "Map"
        },
        home: {
            tinaLabel: "Home"
        },
        about: {
            tinaLabel: "About"
        },
        paths: {
            tinaLabel: "Paths"
        },
        posts: {
            tinaLabel: "Posts"
        },
        // add in non-user-defined core data fields here
        title: {
            tinaLabel: "Name"
        },
        root: {
            tinaLabel: "Root"
        },
        ...userDefinedFields
    },
    featuredModel: {
        uuid: '146d2d39-e6b5-4f4f-aaba-0ffb69a038c1',
        labelField: '146d2d39-e6b5-4f4f-aaba-0ffb69a038c1.name.value'
    }
};

export default config;