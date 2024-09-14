import {
  FacetListsGrouped,
  FacetStateContext,
  useGeoSearchToggle,
  useCachedHits,
} from "@performant-software/core-data";
// import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from "@radix-ui/react-switch";
import { Settings2, X } from "lucide-react";
import React, {
  useContext,
  useState,
  Fragment,
  useEffect,
  useMemo,
} from "react";
import {
  RefinementList,
  useCurrentRefinements,
  useInstantSearch,
  useRefinementList,
} from "react-instantsearch";
import "../../styles/SearchFilters.css";
import { Dialog, Transition } from "@headlessui/react";
import * as m from "../../paraglide/messages";
import { t } from "../../i18n/utils";

interface FacetStateContextType {
  attributes: string[];
}

const SearchFilters = (props) => {
  const { attributes } = useContext<FacetStateContextType>(FacetStateContext);
  const { renderState } = useInstantSearch();
  const { items } = useCurrentRefinements();
  const refinementCount = useMemo(() => {
    if (!items || !items.length) {
      return 0;
    }
    let i = 0;
    items.forEach((item) => {
      i += item.refinements.length;
    });
    return i;
  }, [items]);

  const { filterByMapBounds, setFilterByMapBounds } = useGeoSearchToggle();
  const [open, setOpen] = useState<boolean>(false);
  const [filteredAttributes, setFilteredAttributes] = useState<
    { attribute: string; showMore: boolean; transform?: any }[]
  >([]);

  useEffect(() => {
    setFilterByMapBounds(true);
  }, []);

  useEffect(() => {
    if (
      renderState &&
      renderState[import.meta.env.PUBLIC_TYPESENSE_INDEX_NAME] &&
      renderState[import.meta.env.PUBLIC_TYPESENSE_INDEX_NAME].refinementList
    ) {
      setFilteredAttributes(
        attributes
          .filter(
            (att) =>
              renderState[import.meta.env.PUBLIC_TYPESENSE_INDEX_NAME]
                .refinementList[att].canRefine
          )
          ?.map((att) => {
            let transform: (_items: any) => any;
            if (!att.includes("date")) {
              transform = (items: any) => items;
            } else {
              transform = (items: any) =>
                items.map((item) => ({
                  ...item,
                  label: new Date(item.value * 1000).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      timeZone: "UTC",
                    }
                  ),
                }));
            }
            return {
              attribute: att,
              showMore:
                !renderState[import.meta.env.PUBLIC_TYPESENSE_INDEX_NAME]
                  .refinementList[att].hasExhaustiveItems,
              transform: transform,
            };
          })
      );
    }
  }, [renderState]);

  return (
    <>
      <div
        className="relative p-2 rounded-full bg-gray-1000 text-white h-full aspect-square flex justify-center items-center hover:bg-gray-200 hover:scale-105 cursor-pointer"
        onClick={() => setOpen((prevOpen) => !prevOpen)}
      >
        <Settings2 />
        {refinementCount > 0 ? (
          <div className="bg-blue-500 w-6 h-6 font-semibold rounded-full flex items-center justify-center text-white text-sm absolute -right-1 -bottom-1">
            {refinementCount}
          </div>
        ) : null}
      </div>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="w-full items-center font-medium text-black"
                  >
                    <Settings2 className="inline mb-0.5 pe-2" />
                    Filters
                  </Dialog.Title>
                  {/* <div
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
                    Filter by map bounds
                    </label>
                </div> */}
                  {renderState &&
                    renderState[import.meta.env.PUBLIC_TYPESENSE_INDEX_NAME] &&
                    renderState[import.meta.env.PUBLIC_TYPESENSE_INDEX_NAME]
                      .refinementList && (
                      <FacetListsGrouped
                        attributes={filteredAttributes.map(
                          (att) => att.attribute
                        )}
                        renderList={(attribute: string) => (
                          <RefinementList
                            attribute={attribute}
                            showMore={
                              filteredAttributes.find(
                                (att) => att.attribute == attribute
                              )?.showMore
                            }
                            showMoreLimit={100}
                            transformItems={
                              filteredAttributes.find(
                                (att) => att.attribute == attribute
                              )?.transform
                            }
                          />
                        )}
                        resolveLabel={(uuid: string) => {
                          return m[t(uuid)] ? m[t(uuid)]() : uuid;
                        }}
                      />
                    )}

                  <div className="mt-4">
                    <button
                      className="dialog-close rounded-full"
                      onClick={() => setOpen(false)}
                    >
                      <X className="h-7 w-7 p-1.5" />
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default SearchFilters;
