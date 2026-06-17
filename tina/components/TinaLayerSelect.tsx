import { wrapFieldsWithMeta } from 'tinacms';
import { useMemo } from 'react';
import config from '@config';

const TinaLayerSelect = wrapFieldsWithMeta((props) => {
  const options = useMemo(() => {
    const layers = config.layers || [];

    let result = []

    layers.forEach(l => {
      if (l.overlay) {
        result.push({
          label: l.name,
          value: l.url
        })
      }
    })

    return result;
  }, [])

  return (
    <select
      value={props.input.value || ''}
      onChange={(event) => props.input.onChange(event.target.value || undefined)}
      className='w-full rounded border border-gray-200 px-3 py-2'
    >
      <option value=''>No overlay</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
});

export default TinaLayerSelect;