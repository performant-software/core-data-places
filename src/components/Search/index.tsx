import { InstantSearch, SearchBox } from "react-instantsearch";
import Facets from "./Facets";
import Hits from './Hits'
import searchClient from './searchClient'

interface Props {
  locale: 'en' | 'fr'
}

const SearchContent: React.FC<Props> = ({ locale }) => {
  return (
    <InstantSearch
      indexName={import.meta.env.PUBLIC_TYPESENSE_INDEX_NAME}
      searchClient={searchClient}
    >
      <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4">
        <div>
          <SearchBox />
          <Facets />
        </div>
        <Hits locale={locale} />
      </div>
    </InstantSearch>
  );
};

export default SearchContent;
