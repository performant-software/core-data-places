import SearchHighlight from '@apps/search/SearchHighlight';
import { type Feature, useNavigate } from '@peripleo/peripleo';
import { Typesense as TypesenseUtils, useCachedHits } from '@performant-software/core-data';
import { Building } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import config from '../../../public/config.json';

interface HitComponentProps {
  hit: any;
  isHovered: boolean;
  onClick(): void;
}

const HitComponent = (props: HitComponentProps) => {
  const { hit } = props;

  /**
   * Memo-izes the `div` class.
   */
  const className = useMemo(() => {
    const classNames = [
      'h-[5.5em]',
      'border-b',
      'flex',
      'flex-col',
      'justify-start'
    ];

    if (props.isHovered) {
      classNames.push('bg-teal-700/30')
    }

    return classNames.join(' ');
  }, [props.isHovered]);

  return (
    <div
      className={className}
    >
      <button
        className='flex-grow text-left flex flex-col justify-center rounded-none px-5'
        onClick={props.onClick}
      >
        <div
          className='flex items-center'
        >
          <div
            className='pe-3'
          >
            <Building
              strokeWidth={1}
            />
          </div>
          <div
            className='flex flex-col'
          >
            { config.search.result_card.title && (
              <SearchHighlight
                attribute={config.search.result_card.title}
                badge
                className='text-sm'
                hit={hit}
              />
            )}
            { config.search.result_card.subtitle && (
              <SearchHighlight
                attribute={config.search.result_card.subtitle}
                badge
                className='text-sm text-gray-500'
                hit={hit}
              />
            )}
          </div>
        </div>
      </button>
    </div>
  );
};

interface Props {
  hover?: Feature<{ id: string }>;
  onHoverChange?(hover?: Feature<{ id: string }>): void;
}

interface RowProps {
  index: number;
  style: any;
}

const SearchResultsList = (props: Props) => {
  const { hover, onHoverChange } = props;
  const hits = useCachedHits();

  const navigate = useNavigate();

  const Row = ({ index, style }: RowProps) => {
    const hit = hits[index];
    const id = parseInt(hit.record_id);

    const onPointEnter = useCallback(() => {
      if (onHoverChange) {
        onHoverChange(hover?.id === id ? hover : TypesenseUtils.toFeature(hit));
      }
    }, [hover, onHoverChange]);

    const onPointLeave = useCallback(() => {
      if (onHoverChange) {
        onHoverChange(undefined);
      }
    }, [hover, onHoverChange])

    return (
      <div
        style={style}
        onPointerEnter={onPointEnter}
        onPointerLeave={onPointLeave}
      >
        <HitComponent
          hit={hit}
          isHovered={hover?.id === parseInt(hit?.record_id)}
          onClick={() => navigate(`/places/${hit.uuid}`)}
        />
      </div>
    )
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          height={height}
          itemCount={hits.length}
          itemSize={88}
          width={width}
        >
          { Row }
        </FixedSizeList>
      )}
    </AutoSizer>
  );
};

export default SearchResultsList;
