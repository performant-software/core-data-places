import Viewer from '@samvera/clover-iiif/viewer';
import clsx from 'clsx';

const MediaInsert = (props: any) => {
  return (
    <div
      className={clsx(
        'mx-auto w-full',
        props.ratio || 'clover-21'
      )}
    >
      <Viewer
        iiifContent={props?.media?.manifest_url}
      />
    </div>
  );
};

export default MediaInsert;
