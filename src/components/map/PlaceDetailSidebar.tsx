import PlaceDetail from "../PlaceDetail";

export interface PlaceDetailSidebarProps {
    placeId: string;
    onClose: () => void;
}

const PlaceDetailSidebar = (props: PlaceDetailSidebarProps) => {

    return (
        <aside
          className='flex flex-col absolute z-10 h-full w-[350px] bg-white shadow overflow-y-auto flex-grow'
        >
            <PlaceDetail
                placeId={props.placeId}
                onClose={props.onClose}
            />
        </aside>
      );
};

export default PlaceDetailSidebar;