import Viewer from '@samvera/clover-iiif/viewer'

const MediaInsert = (props: any) => {
  return props?.media?.manifest_url && (
    <div className='mx-auto w-full'>
      <Viewer
        iiifContent={props?.media?.manifest_url}
      />
    </div>
  );
};

export default MediaInsert;