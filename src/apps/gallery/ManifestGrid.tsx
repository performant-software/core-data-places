import { memo, useCallback, useEffect, useState } from 'react';
import Viewer from '@samvera/clover-iiif/viewer';
import { Modal } from '@performant-software/core-data';
import { fetchJson } from '@utils/galleries';

interface Props {
  items: any[]
}

interface ManifestState {
  url: string;
  loading: boolean;
  contentWarning: false;
}

const ManifestGrid: React.FC<Props> = (props) => {
  const [selected, setSelected] = useState<ManifestState | null>(null);

  const onSetManifest = useCallback((url: string) => {
    setSelected({ url, loading: true, contentWarning: false });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selected?.url && !selected.loading) {
        const data = await fetchJson(selected.url);

        const contentWarning = data.items.some(i => {
          return i.metadata.some(m => m.label === 'Content Warning' && m.value === 'true');
        })

        setSelected(prev => ({
          ...prev,
          loading: false,
          contentWarning
        }));
      }
    }

    fetchData();
  }, [selected]);

  console.log(selected);

  return (
    <>
      <div className='grid grid-cols-2 xl:grid-cols-3 gap-8 my-10'>
        { props.items.map((item) => (
          <button
            className='rounded-md overflow-hidden relative cursor-pointer bg-white'
            onClick={() => onSetManifest(item.id)}
            type='button'
          >
            <img
              alt={item.label}
              className='h-[460px] object-cover w-full'
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
        className='h-[80vh] w-[80vw] relative'
        centered
        onClose={() => setSelected(null)}
        open={!!selected}
      >
        {selected && (
          <MemoizedViewer
            iiifContent={selected?.url}
            options={{
              canvasHeight: '50vh'
            }}
          />
        )}
      </Modal>
    </>
  );
};

const MemoizedViewer = memo(Viewer);

export default ManifestGrid;
