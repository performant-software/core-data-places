import { useState } from 'react';
import { useCMS } from 'tinacms';

const RebuildSiteButton = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { api } = useCMS();

  const onClick = async () => {
    setMessage(null);
    setLoading(true);

    try {
      const { id_token } = await api.tina.authProvider.getToken();
      const response = await fetch('/api/rebuild', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${id_token}`,
          'Content-Type': 'application/json'
        },
      });

      const result = await response.json();
      setMessage(result?.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex gap-2 items-center justify-end w-full mx-2'>
      { loading && <p className='text-sm text-gray-600'>Loading...</p> }
      { message && <p className='text-sm text-gray-600'>{ message }</p> }
      <button
        className='inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white disabled:opacity-50'
        disabled={loading}
        type='button'
        onClick={onClick}
      >
        Rebuild site
      </button>
    </div>
  );
}

export default RebuildSiteButton;