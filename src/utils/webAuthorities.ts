export const getAuthorityURL = (sourceType: string, identifier: string) => {
    switch (sourceType) {
        case 'wikidata':
            return `https://www.wikidata.org/wiki/${identifier}`;
        case 'viaf':
            return `https://viaf.org/en/viaf/${identifier}`;
        default:
            return null;
    }
}