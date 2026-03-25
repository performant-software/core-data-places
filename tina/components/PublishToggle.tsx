import { Switch } from "@headlessui/react";
import { useCMS } from "tinacms";
import { getUserRole } from '../utils/getUserRole';


const PublishToggle = (props) => {
  const cms = useCMS();
  const { isAdmin } = getUserRole(cms);

  return ( 
    <div>
      {
        isAdmin && ( 
          <div className='flex flex-col gap-3 mb-5 p-2'>
            <p className='font-semibold text-sm'>Published</p>
            <Switch
              className={`${
                props.input.value ? '!bg-blue-600' : '!bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              defaultChecked={props.input.value}
              onChange={(e) => props.input.onChange(e)}
            >
              <span
                className={`${
                  props.input.value ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        )
      }

      {
        !isAdmin && ( 
          <div className='flex flex-col gap-3 p-2 mb-5 text-sm'>
            <p className='font-bold'>
              {
                props.input.value ? 'Published' : 'Unpublished'
              }
            </p>
            {
              props.input.value && ( 
                <p className='italic'>Note: Edits to published posts cannot be saved.</p>
              )
            }
          </div>
        )
      }
    </div>
  )
}

export default PublishToggle;