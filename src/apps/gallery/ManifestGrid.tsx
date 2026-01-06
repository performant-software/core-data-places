import { lazy, memo, Suspense, useCallback, useMemo, useState } from 'react';
import { Button, Modal } from '@performant-software/core-data';
import { fetchJson, getManifestLabel } from '@utils/galleries';
import clsx from 'clsx';

const Viewer = lazy(() => import('@samvera/clover-iiif/viewer'));
const MemoizedViewer = memo(Viewer);

interface Props {
  currentLocale: string;
  items: any[];
  labels: {
    contentWarning: string;
    yes: string;
    no: string;
  }
}

const ManifestGrid: React.FC<Props> = (props) => {
  const [manifest, setManifest] = useState<any | null>(null);
  const [warningAccepted, setWarningAccepted] = useState(false);

  const onFetchManifest = useCallback(async (manifestId: string) => {
    const data = await fetchJson(manifestId);

    setManifest(data);
  }, []);

  const showContentWarning = useMemo(() => {
    if (manifest && !warningAccepted) {
      return manifest.items.some((i) => {
        return i.metadata?.some((m) => m.label === 'Content Warning' && m.value === true);
      });
    }

    return false;
  }, [manifest, warningAccepted]);

  const showViewer = manifest && (warningAccepted || !showContentWarning);

  const viewerLabel = useMemo(() => {
    if (manifest) {
      return getManifestLabel(manifest, props.currentLocale);
    }

    return undefined;
  }, [manifest, props.currentLocale])

  return (
    <>
      <div className='grid grid-cols-2 xl:grid-cols-4 gap-8 my-10 w-full'>
        { props.items.map((item) => (
          <button
            className='rounded-md overflow-hidden relative cursor-pointer bg-white w-full block'
            onClick={() => onFetchManifest(item.id)}
            key={item.id}
            type='button'
          >
            <img
              alt={item.label}
              className='h-[380px] object-cover w-full'
              loading='lazy'
              src={item.thumbnail}
            />
            <div className='flex items-center justify-center h-[100px]'>
              <p className='text-xl font-semibold'>
                {item.label}
              </p>
            </div>
          </button>
        )) }
      </div>
      <Modal
        className={clsx(
          'relative',
          { 'h-[80vh] w-[80vw] px-10': !showContentWarning }
        )}
        centered
        onClose={() => setManifest(null)}
        open={!!manifest}
        title={viewerLabel}
      >
        { showContentWarning && (
          <div className='flex items-center justify-center flex-col max-w-200 m-auto gap-6 my-4'>
            <p className='text-lg'>{props.labels.contentWarning}</p>
            <div className='flex gap-4 items-center justify-end w-full'>
              <Button
                onClick={() => setManifest(null)}
                rounded='true'
              >
                {props.labels.no}
              </Button>
              <Button
                onClick={() => setWarningAccepted(true)}
                primary='true'
                rounded='true'
              >
                {props.labels.yes}
              </Button>
            </div>
          </div>
        ) }
        { showViewer && (
          <Suspense>
              <MemoizedViewer
                /* todo: upgrading to Clover 3 will allow us to pass the manifest JSON directly
                          so Clover won't refetch the manifest                                 */
                iiifContent={manifest.id}
                options={{
                  canvasHeight: '50vh',
                  informationPanel: {
                    open: false
                  },
                  showTitle: false
                }}
              />
          </Suspense>
        ) }
      </Modal>
    </>
  );
};

export default ManifestGrid;
