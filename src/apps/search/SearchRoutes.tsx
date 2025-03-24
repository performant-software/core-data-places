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
      match='/item/'
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
      match='/work/'
      element={<Work className={props.className} />}
    />
    <Route
      match='/select'
      element={<Selection className={props.className} />}
    />
  </Routes>
);

export default SearchRoutes;