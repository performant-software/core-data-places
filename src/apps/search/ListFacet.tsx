import Facet from '@apps/search/Facet';
import TranslationContext from '@apps/search/TranslationContext';
import { Checkbox, Icon } from '@performant-software/core-data';
import { useContext } from 'react';
import { useRefinementList } from 'react-instantsearch';
import _ from 'underscore';

interface Props {
  attribute: string,
  className?: string;
}

const ListFacet = ({ attribute, className }: Props) => {
  const {
    canToggleShowMore,
    isShowingMore,
    items,
    refine,
    toggleShowMore
  } = useRefinementList({ attribute, limit: 5, showMore: true, showMoreLimit: 25 });

  const { t } = useContext(TranslationContext);

  if (_.isEmpty(items)) {
    return null;
  }

  return (
    <Facet
      attribute={attribute}
      className={className}
    >
      <ul>
        { _.map(items, (item, index) => (
          <li
            className='flex justify-between items-center hover:bg-secondary'
            key={index}
            title={item.label}
          >
            <div
              className='flex items-center'
            >
              <Checkbox
                ariaLabel={item.label}
                id={`${attribute}-${item.value}`}
                checked={item.isRefined}
                onClick={() => refine(item.value)}
              />
              <label
                className='px-1 truncate w-[120px]'
                htmlFor={`${attribute}-${item.value}`}
              >
                { item.label }
              </label>
            </div>
            <span
              className='text-xs font-semibold px-3'
            >
              { item.count }
            </span>
          </li>
        ))}
      </ul>
      { canToggleShowMore && (
        <button
          className='flex items-center gap-x-1 mt-1'
          onClick={toggleShowMore}
          type='button'
        >
          <Icon
            name={isShowingMore ? 'zoom_out' : 'zoom_in'}
          />
          <span
            className='py-1'
          >
            { isShowingMore ? t('showLess') : t('showMore') }
          </span>
        </button>
      )}
    </Facet>
  );
};

export default ListFacet;