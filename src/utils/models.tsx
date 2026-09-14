import _ from "underscore";
import { Models } from "../types";
import { FuzzyDate as FuzzyDateUtils } from '@performant-software/shared-components';

// Helper for automatically pluralizing a model name; currently the only
// irregular one is person/people, but obviously this would need to be
// updated if new irregular model names are added.
export const pluralizeModel = (model: Models) => {
  return model === 'person' ? 'people' : model + 's';
};

// Helpers for rendering different models in the context of detail panels
// or post inserts

export const renderEvent = (event: any, t: any): JSX.Element => {
  const renderDate = (date: any, label: string) => {
    if (_.isEmpty(date)) {
      return null;
    }

    return (
      <div
        className='py-1'
      >
        <div
          className='py-1 text-muted'
        >
          { label }
        </div>
        <div
          className='font-medium overflow-hidden text-ellipsis'
        >
          { FuzzyDateUtils.getDateView(date) }
        </div>
      </div>
    );
  };

  const getStartDateLabel = (event: any) => event.end_date ? t('start_date') : t('date');

  return (
    <div
      className='text-sm'
    >
      { renderDate(event.start_date, getStartDateLabel(event)) }
      { renderDate(event.end_date, t('end_date')) }
      { event.description && (
        <p
          className='py-2'
        >
          { event.description }
        </p>
      )}
    </div>
  )
};

export const renderOrganization = (organization: any) => (
  <p
    className='text-sm'
  >
    { organization.description }
  </p>
)