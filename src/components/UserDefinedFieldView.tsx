import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid';
import {
  Date as DateUtils,
  FuzzyDate as FuzzyDateUtils,
  UserDefinedFields as UserDefinedFieldUtils
} from '@performant-software/shared-components';
import _ from 'underscore';
import './UserDefinedFieldView.css';

const { DataTypes } = UserDefinedFieldUtils;

interface Props {
  type: string;
  value?: any;
}

const UserDefinedFieldView = (props: Props) => {
  // TODO: Replace with our icons
  if (props.type === DataTypes.boolean) {
    return props.value
      ? <CheckIcon className='h-5 w-5' aria-hidden='true' />
      : <XMarkIcon className='h-5 w-5' aria-hidden='true' />;
  }

  if (props.type === DataTypes.date) {
    return props.value && DateUtils.formatDate(props.value);
  }

  if (props.type === DataTypes.fuzzyDate) {
    return FuzzyDateUtils.getDateView(props.value);
  }

  if (props.type === DataTypes.number) {
    return props.value?.toString();
  }

  if (props.type === DataTypes.richText) {
    return (
      <div
        className='user-defined-field-view rich-text'
        dangerouslySetInnerHTML={{ __html: props.value }}
      />
    );
  }

  if (props.type === DataTypes.select) {
    return _.isArray(props.value) ? props.value.join(', ') : props.value;
  }

  if (props.type === DataTypes.string) {
    return props.value;
  }

  if (props.type === DataTypes.text) {
    return props.value;
  }

  return null;
};

export default UserDefinedFieldView;