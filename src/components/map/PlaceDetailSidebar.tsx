import config from '../../../public/config.json';
import { CoreDataContextProvider, PlaceDetails } from '@performant-software/core-data';

export interface PlaceDetailSidebarProps {
    placeId: string;
    onClose: () => void;
}

const PlaceDetailSidebar = (props: PlaceDetailSidebarProps) => {

    return (
        <aside
          className='flex flex-col absolute z-10 h-full w-[350px] bg-white shadow overflow-y-auto flex-grow'
        >
            <CoreDataContextProvider
              baseUrl={config.core_data.url}
              projectIds={config.core_data.project_ids}
            >
                <PlaceDetails
                  id={props.placeId}
                />
            </CoreDataContextProvider>
        </aside>
      );
};

export default PlaceDetailSidebar;