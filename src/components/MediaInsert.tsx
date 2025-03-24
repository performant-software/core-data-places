import Viewer from '@samvera/clover-iiif/viewer'

const MediaInsert = (props: any) => {
  return (
    <div className='mx-auto w-full'>
      <Viewer
        iiifContent={props?.media?.manifest_url}
      />
    </div>
  );
};

export default MediaInsert;