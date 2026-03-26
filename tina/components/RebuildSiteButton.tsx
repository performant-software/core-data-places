import { useState } from 'react';
import { useCMS } from 'tinacms';

const RebuildSiteButton = () => {
  const [message, setMessage] = useState<string | null>(null);
  const { api } = useCMS();

  const onClick = async () => {
    setMessage(null);

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
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <button
        className='inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white disabled:opacity-50'
        type='button'
        onClick={onClick}
      >
        Rebuild site
      </button>

      {message && <p className='text-sm text-gray-600'>{message}</p>}
    </div>
  );
}

export default RebuildSiteButton;