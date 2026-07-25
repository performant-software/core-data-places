import { wrapFieldsWithMeta } from 'tinacms';
import _ from 'underscore';

const EditHistory = wrapFieldsWithMeta((props: any) => {
  return (
    <div>
      {
        !props.input.value?.length && (
          <p className='italic'>None yet.</p>
        )
      }
      {
        props.input.value && props.input.value.length > 0 && _.map(props.input.value, (entry: any) => (
          <div className='w-full flex flex-row justify-between'>
            <p>{entry.user_email}</p>
            <p>{new Date(entry.timestamp).toLocaleString()}</p>
          </div>
        ))
      }
    </div>
  )
});

export default EditHistory;