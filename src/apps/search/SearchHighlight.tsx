import TranslationContext from '@contexts/TranslationContext';
import Badge from '@components/Badge';
import { useContext, useMemo } from 'react';
import { Highlight } from 'react-instantsearch';

interface Props {
  attribute: string;
  badge?: boolean;
  className?: string;
  hit: any;
}

const SearchHighlight = (props: Props) => {
  const { t } = useContext(TranslationContext);

  /**
   * Memo-izes the count if the passed attribute is a nested array.
   */
  const count = useMemo(() => {
    let value = 0;

    const path = props.attribute.split('.');
    if (path && path.length > 1 && props.hit) {
      const [relationshipId, ] = path;
      value = props.hit[relationshipId]?.length - 1;
    }

    return value;
  }, [props.attribute, props.hit]);

  return (
    <div>
      <Highlight
        attribute={props.attribute}
        className={props.className}
        hit={props.hit}
      />
      { props.badge && count > 1 && (
        <Badge
          className='ms-2 text-white bg-primary'
          content={t('plusCount', { count })}
        />
      )}
    </div>
  );
};

export default SearchHighlight;