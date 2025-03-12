import Viewer from "@samvera/clover-iiif/viewer"

const CoreDataMedia = (props: any) => {
    return (
        <div className='mx-auto w-full'>
            <Viewer
                iiifContent={props?.media?.manifest_url}
            />
        </div>
    )
};

export default CoreDataMedia;