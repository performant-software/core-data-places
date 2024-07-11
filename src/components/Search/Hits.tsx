import { useHits, type UseHitsProps } from 'react-instantsearch';
import type { Locale } from '../../helpers/types';

interface Props extends UseHitsProps {
  locale: Locale;
}

const Hits: React.FC<Props> = (props) => {
  const { hits } = useHits(props);

  return (
    <div className='flex gap-2 divide divide-y flex-col'>
      {hits.map((hit) => (
        <p>{hit.uuid}</p>
      ))}
    </div>
  )
}

export default Hits;
