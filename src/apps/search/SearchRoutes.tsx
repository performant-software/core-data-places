import Event from '@apps/search/panels/Event';
import Instance from '@apps/search/panels/Instance';
import Item from '@apps/search/panels/Item';
import Organization from '@apps/search/panels/Organization';
import Person from '@apps/search/panels/Person';
import Place from '@apps/search/panels/Place';
import Selection from '@apps/search/Selection';
import Work from '@apps/search/panels/Work';
import { Route, Routes } from '@peripleo/peripleo';

interface Props {
  className?: string;
  panelHistory?: any[];
  setPanelHistory?: any;
}

const SearchRoutes = (props: Props) => (
  <Routes>
    <Route
      match='/events/'
      element={<Event {...props} />}
    />
    <Route
      match='/instances/'
      element={<Instance {...props} />}
    />
    <Route
      match='/items/'
      element={<Item {...props} />}
    />
    <Route
      match='/organizations/'
      element={<Organization {...props} />}
    />
    <Route
      match='/people/'
      element={<Person {...props} />}
    />
    <Route
      match='/places/'
      element={<Place {...props} />}
    />
    <Route
      match='/works/'
      element={<Work {...props} />}
    />
    <Route
      match='/select'
      element={<Selection {...props} />}
    />
  </Routes>
);

export default SearchRoutes;