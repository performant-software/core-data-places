import { useContext } from "react";
import { RefinementList } from "react-instantsearch";
import fields from './fields'

const Search = () => {
  return (
    <div>
      {Object.entries(fields).filter(f => f[1].facet).map((f) => (
        <div className="p-2 bg-slate-100" key={f[0]}>
          <h2>{f[1].displayLabel}</h2>
          <RefinementList attribute={f[0]} key={f[0]} />
        </div>
      ))}
    </div>
  );
};

export default Search;
