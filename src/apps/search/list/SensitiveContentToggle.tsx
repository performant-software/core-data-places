import TranslationContext from "@contexts/TranslationContext";
import { Checkbox } from '@performant-software/core-data';
import { useContext } from "react";
import { useSearchConfig } from "../SearchConfigContext";
import { useToggleRefinement } from "react-instantsearch";

const SensitiveContentToggle = () => {
  const { t } = useContext(TranslationContext);
  const config = useSearchConfig();
  

  if (!(config.type === 'image')) {
    return null;
  }

  const { value, refine } = useToggleRefinement({
    attribute: 'content_warning',
    on: false
  });

  return (
    <div
      className='text-sm flex items-center'
    >
      <Checkbox
        ariaLabel={t('sensitiveContentFilter')}
        checked={value.isRefined}
        id='sensitiveContentFilter'
        onClick={(checked) => refine({ isRefined: !checked })} 
      />
      <label
        htmlFor='sensitiveContentFilter'
        className='px-1'
      >
        { t('sensitiveContentFilter') }
      </label>
    </div>
  );
}

export default SensitiveContentToggle;