import { wrapFieldsWithMeta } from 'tinacms';
import JsonUpload from './JsonUpload';

const MapInput = wrapFieldsWithMeta((props) => {
  return (
    <JsonUpload
      onChange={(value) => props.input.onChange(value)}
      value={props.input.value}
    />
  );
});

export default MapInput;