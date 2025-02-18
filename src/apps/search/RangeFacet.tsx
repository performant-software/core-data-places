import Facet from '@apps/search/Facet';
import { Slider } from '@performant-software/core-data';
import { useEffect, useState } from 'react';
import { useRange } from 'react-instantsearch';

interface Props {
  attribute: string,
  className?: string;
}

const RangeFacet = ({ attribute, className }: Props) => {
  const { start, range, refine } = useRange({ attribute });
  const { min, max } = range;

  const [value, setValue] = useState([min, max]);

  const from = Math.max(min, Number.isFinite(start[0]) ? start[0] : min);
  const to = Math.min(max, Number.isFinite(start[1]) ? start[1] : max);

  /**
   * Sets the value on the state when the from/to values change.
   */
  useEffect(() => {
    setValue([from, to]);
  }, [from, to]);

  return (
    <Facet
      attribute={attribute}
      className={className}
    >
      <Slider
        max={max}
        min={min}
        onValueChange={setValue}
        onValueCommit={refine}
        value={value}
      />
    </Facet>
  );
};

export default RangeFacet;