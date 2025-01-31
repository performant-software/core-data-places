import '@apps/search/SearchFilters.css';
import SearchFilter from '@apps/search/SearchFilter';
import TranslationContext from '@apps/search/TranslationContext';
import { FacetListsGrouped, FacetStateContext, useGeoSearchToggle } from '@performant-software/core-data';
import { useRuntimeConfig } from '@peripleo/peripleo';
import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';
import { Settings2, X } from 'lucide-react';
import { useContext, useState } from 'react';

interface FacetStateContextType {
  attributes: string[];
}

const SearchFilters = () => {
  const [open, setOpen] = useState<boolean>(false);

  const config = useRuntimeConfig<any>();
  const { attributes } = useContext<FacetStateContextType>(FacetStateContext);
  const { filterByMapBounds, setFilterByMapBounds } = useGeoSearchToggle();
  const { t } = useContext(TranslationContext);

  return (
    <Dialog.Root
      onOpenChange={setOpen}
      open={open}
    >
      <Dialog.Trigger
        className='relative p-2 rounded-full bg-gray-1000 text-white h-full aspect-square flex justify-center items-center'
        onClick={() => setOpen((prevOpen) => !prevOpen)}
      >
        <Settings2 />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className='dialog-overlay'
        />
        <Dialog.Content
          className='search-filters dialog-content'
        >
          <Dialog.Title
            className='dialog-title'
          >
            <h1
              className='w-full items-center font-medium text-black'
            >
              <Settings2
                className='inline mb-0.5 pe-2'
              />
              { t('filters') }
            </h1>
          </Dialog.Title>
          { config.search?.geosearch && (
            <div
              className='flex items-center text-sm mt-5'
            >
              <Switch.Root
                checked={filterByMapBounds}
                className='switch-root'
                id='toggle-bounds-filter'
                onCheckedChange={(checked) => setFilterByMapBounds(checked)}
              >
                <Switch.Thumb
                  className='switch-thumb'
                />
              </Switch.Root>
              <label
                className='ml-2'
                htmlFor='toggle-bounds-filter'
              >
                { t('filterMapBounds') }
              </label>
            </div>
          )}
          <FacetListsGrouped
            attributes={attributes}
            renderList={(attribute: string) => (
              <SearchFilter
                attribute={attribute}
              />
            )}
            resolveLabel={(uuid: string) => t(uuid)}
          />
          <Dialog.Close
            asChild
          >
            <button
              className='dialog-close rounded-full'
            >
              <X
                className='h-7 w-7 p-1.5'
              />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SearchFilters;
