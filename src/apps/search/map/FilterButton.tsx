import TranslationContext from "@contexts/TranslationContext";
import { Button, Icon } from "@performant-software/core-data";
import clsx from "clsx";
import { useContext } from "react";

interface FilterButtonProps {
  allowSearchChange: boolean;
  facetCount?: number;
  filters?: boolean;
  onFiltersChange: (filters: boolean) => void;
  classNames?: string;
}

const FilterButton = (props: FilterButtonProps) => {
  const { allowSearchChange, classNames, facetCount = 0, onFiltersChange } = props;
  const { t } = useContext(TranslationContext);
  return (
    <Button
      aria-label={t('filters')}
      className={clsx('relative', classNames)}
      disabled={!allowSearchChange}
      icon
      onClick={() => onFiltersChange(!props.filters)}
      primary={props.filters}
    >
      <Icon
        name='filters'
        size={24}
      />
      { facetCount > 0 && (
        <div
          className={`
            absolute
            flex
            items-center
            justify-center
            -top-1
            -right-2
            w-[20px]
            h-[20px]
            bg-red-600
            text-white
            text-xs
            rounded-full
          `}
        >
          { facetCount }
        </div>
      )}
    </Button>
  )
}

export default FilterButton;