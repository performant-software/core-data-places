import { useState } from 'react';
import Viewer from '@samvera/clover-iiif/viewer';
import { Modal } from '@performant-software/core-data';

interface Props {
  items: any[]
}

const ManifestGrid: React.FC<Props> = (props) => {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <div className='grid grid-cols-2 xl:grid-cols-3 gap-8 my-10'>
        { props.items.map((item) => (
          <button
            className='rounded-md overflow-hidden relative cursor-pointer bg-white'
            onClick={() => setActive(item.id)}
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
        onClose={() => setActive(null)}
        open={!!active}
      >
        {active && (
          <Viewer
            iiifContent={active}
            options={{
              canvasHeight: '50vh'
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default ManifestGrid;
