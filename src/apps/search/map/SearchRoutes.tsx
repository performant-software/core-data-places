import Event from '@apps/search/map/panels/Event';
import Instance from '@apps/search/map/panels/Instance';
import Item from '@apps/search/map/panels/Item';
import Organization from '@apps/search/map/panels/Organization';
import Person from '@apps/search/map/panels/Person';
import Place from '@apps/search/map/panels/Place';
import Selection from '@apps/search/map/Selection';
import Work from '@apps/search/map/panels/Work';
import { Route, Routes } from '@peripleo/peripleo';

interface Props {
  className?: string;
}

const SearchRoutes = (props: Props) => (
  <Routes>
    <Route
      match='/events/'
      element={<Event className={props.className} />}
    />
    <Route
      match='/instances/'
      element={<Instance className={props.className} />}
    />
    <Route
      match='/items/'
      element={<Item className={props.className} />}
    />
    <Route
      match='/organizations/'
      element={<Organization className={props.className} />}
    />
    <Route
      match='/people/'
      element={<Person className={props.className} />}
    />
    <Route
      match='/places/'
      element={<Place className={props.className} />}
    />
    <Route
      match='/works/'
      element={<Work className={props.className} />}
    />
    <Route
      match='/select'
      element={<Selection className={props.className} />}
    />
  </Routes>
);

export default SearchRoutes;