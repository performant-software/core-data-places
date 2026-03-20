import { Switch } from "@headlessui/react";
import { useCMS } from "tinacms";
import _ from "underscore";


const PublishToggle = (props) => {
  const tina = useCMS();
  const user = tina?.api?.tina?.authProvider?.clerk?.user; // TODO: this is very dependent on the exact clerk schema; should probably be factored out somehow?
  const userRole = _.find(user?.organizationMemberships, (org) => (org.organization.id === process.env.TINA_PUBLIC_CLERK_ORG_ID))?.role;

  
  const togglePublished = (e: any) => {
    const newData = {
      ...props.input.value,
      published: e
    };
    props.input.onChange(newData);
  };

  return ( 
    <div>
      {
        userRole === 'org:admin' && ( 
          <Switch
            className={`${
              props.input.value.published ? '!bg-blue-600' : '!bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
            defaultChecked={props.input.value.published}
            onChange={togglePublished}
          >
            <span
              className={`${
                props.input.value.published ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        )
      }

      {
        userRole !== 'org:admin' && ( 
          <p className='p-2 mb-5 text-sm font-bold'>
            {
              props.input.value.published ? 'Published' : 'Unpublished'
            }
          </p>
        )
      }
    </div>
  )
}

export default PublishToggle;