import Hits from "@apps/search/list/Hits";
import { SearchBox } from "react-instantsearch";
import Facets from "@apps/search/Facets";
import { useSearchConfig } from "@apps/search/SearchConfigContext";
import Pagination from "@apps/search/list/Pagination";
import { useContext } from "react";
import TranslationContext from "@contexts/TranslationContext";

interface Props {
  lang: string;
}

const ListLayout = (props: Props) => {
  const config = useSearchConfig();

  const { t } = useContext(TranslationContext);

  return (
    <div className="flex flex-row bg-neutral-50">
      <div className="w-[300px]">
        <SearchBox
          placeholder={t('search')}
          classNames={{
            root: 'p-4',
            form: 'relative',
            input: 'block w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
            submit: 'absolute inset-y-0 right-0 flex items-center pr-3',
            reset: 'absolute inset-y-0 right-8 flex items-center',
            loadingIndicator: 'absolute inset-y-0 right-16 flex items-center'
          }}
        />
        <Facets
          className="px-6 py-0"
          config={config}
          open
        />
      </div>
      <div className="flex-1 p-6">
        <Pagination />
        <Hits lang={props.lang} />
        <Pagination />
      </div>
    </div>
  );
};

export default ListLayout;
