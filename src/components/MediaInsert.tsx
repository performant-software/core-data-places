import Viewer from '@samvera/clover-iiif/viewer'

const MediaInsert = (props: any) => {
  const ratioClass = props.ratio || 'clover-21';

  return (
    <div className={`mx-auto w-full ${ratioClass}`}>
      <Viewer
        iiifContent={props?.media?.manifest_url}
      />
    </div>
  );
};

export default MediaInsert;
