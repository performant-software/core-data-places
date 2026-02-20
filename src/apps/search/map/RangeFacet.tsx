import Facet from '@apps/search/Facet';
import { Slider } from '@performant-software/core-data';
import { useEffect, useState } from 'react';
import { useRange } from 'react-instantsearch';

interface Props {
  attribute: string,
  className?: string;
  icon?: string;
}

const RangeFacet = ({ attribute, className, icon }: Props) => {
  const { canRefine, start, range, refine } = useRange({ attribute });
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

  /**
   * Only display if the facet is available to refine.
   */
  if (!canRefine) {
    return null;
  }

  return (
    <Facet
      attribute={attribute}
      className={className}
      icon={icon}
    >
      <Slider
        classNames={{
          track: 'bg-neutral-200'
        }}
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