import JsonUpload from './JsonUpload';
import { wrapFieldsWithMeta } from 'tinacms';

const SearchResultsInput = wrapFieldsWithMeta((props) => {
  return (
    <JsonUpload
      onChange={(value) => props.input.onChange(value)}
      value={props.input.value}
    />
  );
});

export default SearchResultsInput;