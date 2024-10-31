import { useContext, useMemo } from 'react';
import _ from 'underscore';
import config from '../../../public/config.json';
import TranslationContext from './TranslationContext';

interface Props {
  className?: string;

  hit?: any;

  prefix?: boolean;
}

const RelatedModel = (props: Props) => {
  const { t } = useContext(TranslationContext);

  const value = useMemo(() => {
    let value = [];

    if (config.typesense.related_model) {
      const path = config.typesense.related_model.split('.');
      const relationshipId = _.first(path);

      if (props.prefix) {
        value.push(`${ t(relationshipId) }:`);
      }

      value.push(_.get(props.hit, path));

      if (props.hit[relationshipId] && props.hit[relationshipId].length > 1) {
        value.push(t('andCountMore', { count: props.hit[relationshipId]?.length - 1 }));
      }
    }

    return value.join(' ');
  }, [props.hit, t]);

  if (_.isEmpty(value)) {
    return null;
  }

  return (
    <div
      className={props.className}
    >
      { value }
    </div>
  )
};

export default RelatedModel;