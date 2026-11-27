import { useCMS, wrapFieldsWithMeta } from 'tinacms';
import _ from 'underscore';
import { getUserRole } from '../utils/getUserRole';
import { useState } from 'react';

const EditHistory = wrapFieldsWithMeta((props: any) => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const cms = useCMS();
  const { isAdmin } = getUserRole(cms);

  return (
    <div>
      {
        !isAdmin && (
          <p className='italic'>Unavailable</p>
        )
      }
      {
        isAdmin && !props.input.value?.length && (
          <p className='italic'>None yet.</p>
        )
      }
      {
        isAdmin && props.input.value && props.input.value.length > 0 && (
          <>
           { _.map(props.input.value.slice(0,5), (entry: any) => (
            <div className='w-full flex flex-row justify-between'>
              <p>{entry.user_email}</p>
              <p>{new Date(entry.timestamp).toLocaleString()}</p>
            </div>
            )) }
            { showMore && _.map(props.input.value.slice(5,), (entry: any) => (
              <div className='w-full flex flex-row justify-between'>
                <p>{entry.user_email}</p>
                <p>{new Date(entry.timestamp).toLocaleString()}</p>
              </div>
            ))}
            { props.input.value.length > 5 && (
              <button 
                className='px-3 py-2 rounded-lg bg-white hover:bg-gray-200 border border-gray-600 my-2 flex items-center justify-center cursor-pointer'
                onClick={() => setShowMore(current => !current)}
              >
                <p>{ showMore ? 'Show Less' : 'Show More' }</p>
              </button>
            )}
          </>
        )
      }
    </div>
  )
});

export default EditHistory;