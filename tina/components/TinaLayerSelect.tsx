import { wrapFieldsWithMeta } from 'tinacms';
import { useEffect, useMemo, useState } from 'react';
import { client } from '@tina/client';

const TinaLayerSelect = wrapFieldsWithMeta((props) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    let active = true;
    client.queries
      .settings({ relativePath: 'config.json' })
      .then((res) => {
        if (active) {
          const layers = res.data?.settings?.layers || [];
          let result = []

          layers.forEach(l => {
            if (l.overlay) {
              result.push({
                label: l.name,
                value: l.url
              })
            }
          })

          setOptions(result);
        };
      })
      .catch((err) => console.error('Failed to load layer settings', err));
    return () => {
      active = false;
    };
  }, []);

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