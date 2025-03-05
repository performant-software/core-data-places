import Facet from '@apps/search/Facet';
import { Slider } from '@performant-software/core-data';
import { useEffect, useMemo, useState } from 'react';
import { useRange } from 'react-instantsearch';
import config from '@config';

interface Props {
  attribute: string,
  className?: string;
  icon?: string;
}

const RangeFacet = ({ attribute, className, icon }: Props) => {
  const { canRefine, start, range, refine } = useRange({ attribute });
  const { min, max } = range;
  const isDate = useMemo(() => (config.search.date_facets?.includes(attribute)), [attribute]);

  const getDisplayValue = (_value: number, _isDate: boolean) => (
    _isDate ? (new Date(_value*1000)).getFullYear() : _value
  );

  const getValue = (_display: number, _isDate: boolean) => (
    _isDate ? Math.round((new Date(_display, 5)).getTime()/1000) : _display
  );

  const displayMin = useMemo(() => (
    getDisplayValue(min, isDate)
  ), [isDate, range]);

  const displayMax = useMemo(() => (
    getDisplayValue(max, isDate)
  ), [isDate, range])

  const [value, setValue] = useState([displayMin, displayMax]);

  const from = Math.max(displayMin, Number.isFinite(start[0]) ? getDisplayValue(start[0], isDate) : displayMin);
  const to = Math.min(displayMax, Number.isFinite(start[1]) ? getDisplayValue(start[1], isDate) : displayMax);

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
        max={displayMax}
        min={displayMin}
        onValueChange={setValue}
        onValueCommit={(value) => refine([getValue(value[0], isDate), getValue(value[1], isDate)])}
        value={value}
      />
    </Facet>
  );
};

export default RangeFacet;