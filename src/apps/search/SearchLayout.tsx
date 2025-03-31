import MapView from '@apps/search/MapView';
import Facets from '@apps/search/Facets';
import Header, { Views } from '@apps/search/Header';
import ListView from '@apps/search/ListView';
import SearchContext from '@apps/search/SearchContext';
import SearchRoutes from '@apps/search/SearchRoutes';
import TableView from '@apps/search/TableView';
import { useCurrentRoute } from '@peripleo/peripleo';
import { getCurrentId, getCurrentPath } from '@utils/router';
import clsx from 'clsx';
import {
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

const DEFAULT_MAX_ZOOM = 14;

const DEFAULT_PADDING_TOP = 80;
const DEFAULT_PADDING_BOTTOM = 100;
const DEFAULT_PADDING_LEFT = 120;
const DEFAULT_PADDING_RIGHT = 120;

const PADDING_BOTTOM_TABLE = 380;
const PADDING_LEFT_FILTERS = 270;
const PADDING_RIGHT_DETAIL = 380;
const PADDING_LEFT_FILTERS_TABLE = 620;
const PADDING_LEFT_TABLE = 380;

const PATH_SELECT = 'select';

const SearchLayout = () => {
  const [filters, setFilters] = useState<boolean>(false);
  const [view, setView] = useState<string>(Views.list);

  const { searchConfig: config, setBoundingBoxOptions, setControlsClass } = useContext(SearchContext);

  const route = useCurrentRoute();
  const id = getCurrentId(route);
  const path = getCurrentPath(route);

  /**
   * Memo-izes the left padding.
   */
  const left = useMemo(() => {
    if (filters && view === Views.list) {
      return PADDING_LEFT_FILTERS_TABLE;
    }

    if (view === Views.list) {
      return PADDING_LEFT_TABLE;
    }

    if (filters) {
      return PADDING_LEFT_FILTERS;
    }

    return DEFAULT_PADDING_LEFT;
  }, [filters, view]);

  /**
   * Sets the variable to `true` if the record detail panel or selection panel is open.
   */
  const rightOpen = useMemo(() => id || path === PATH_SELECT, [id, path]);

  /**
   * Updates the bounding box padding based on the layout configuration.
   */
  useEffect(() => setBoundingBoxOptions({
    padding: {
      top: DEFAULT_PADDING_TOP,
      bottom: view === Views.table ? PADDING_BOTTOM_TABLE : DEFAULT_PADDING_BOTTOM,
      left,
      right: rightOpen ? PADDING_RIGHT_DETAIL: DEFAULT_PADDING_RIGHT
    },
    maxZoom: config.map.max_zoom || DEFAULT_MAX_ZOOM
  }), [config, left, rightOpen, view]);

  /**
   * Updates the class to apply to the map controls container.
   */
  useEffect(() => setControlsClass(rightOpen ? 'me-[350px]' : null), [rightOpen]);

  return (
    <>
      <div
        className='absolute left-0 right-0 bottom-0 top-[64px]'
      >
        <MapView />
      </div>
      <Header
        className='h-[64px]'
        filters={filters}
        onFiltersChange={setFilters}
        onViewChange={setView}
        view={view}
      />
      <div
        className='flex flex-grow h-[calc(100vh-160px)]'
      >
        <div
          className={clsx('flex', { 'flex-grow': view === Views.list })}
        >
          <div
            className='flex flex-col'
          >
            <Facets
              className={clsx(
                'w-[240px]',
                { 'hidden': !filters }
              )}
            />
          </div>
          { view === Views.list && (
            <div
              className='flex flex-col'
            >
              <ListView
                className='w-[350px]'
              />
            </div>
          )}
        </div>
        { view === Views.table && (
          <div
            className='flex flex-grow items-end'
          >
            <TableView
              className='h-[350px]'
            />
          </div>
        )}
        <div
          className='flex justify-end'
        >
          <SearchRoutes
            className='w-[350px]'
          />
        </div>
      </div>
    </>
  );
};

export default SearchLayout;