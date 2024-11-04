import TranslationContext from '@apps/search/TranslationContext';
import {
  RelatedItem,
  RelatedItemsList,
  RelatedMedia,
  RelatedOrganizations,
  RelatedPeople, RelatedPlaces, RelatedTaxonomies
} from '@performant-software/core-data';
import React, { useCallback, useContext, useState } from 'react';
import _ from 'underscore';

type Props = {
  onLoadMedia: () => Promise<any>,
  onLoadOrganizations: () => Promise<any>,
  onLoadPeople: () => Promise<any>,
  onLoadPlaces: () => Promise<any>,
  onLoadTaxonomies: () => Promise<any>
};

type CallbackFunction = (count: number) => void;

const RelatedRecords = (props: Props) => {
  const [mediaLoading, setMediaLoading] = useState<boolean>(!!props.onLoadMedia);
  const [organizationsLoading, setOrganizationsLoading] = useState<boolean>(!!props.onLoadOrganizations);
  const [peopleLoading, setPeopleLoading] = useState<boolean>(!!props.onLoadPeople);
  const [placesLoading, setPlacesLoading] = useState<boolean>(!!props.onLoadPlaces);
  const [taxonomiesLoading, setTaxonomiesLoading] = useState<boolean>(!!props.onLoadTaxonomies);

  const [mediaCount, setMediaCount] = useState<number>();
  const [organizationsCount, setOrganizationsCount] = useState<number>();
  const [peopleCount, setPeopleCount] = useState<number>();
  const [placesCount, setPlacesCount] = useState<number>();
  const [taxonomiesCount, setTaxonomiesCount] = useState<number>();

  const { t } = useContext(TranslationContext);

  /**
   * Sets the count of records returned from the passed response.
   */
  const setRelatedCount = useCallback((response: any, callback: CallbackFunction) => {
    const { count } = response.list || {};
    callback(count);

    return response;
  }, []);

  /**
   * Sets the count of media records returned from the passed response.
   */
  const setRelatedMediaCount = useCallback((response: any) => {
    const count = _.reduce(_.pluck(response.items, 'item_count')) || 0;
    setMediaCount(count);

    return response;
  }, []);

  return (
    <RelatedItemsList>
      { props.onLoadMedia && (
        <RelatedItem
          count={mediaCount}
          id='media_contents'
          label={t('relatedMedia')}
          loading={mediaLoading}
        >
          <RelatedMedia
            className='p-3 pt-1 pb-4'
            emptyMessage={t('relatedMediaEmpty')}
            moreLabel={t('loadMore')}
            onLoad={() => (
              props.onLoadMedia()
                .then(setRelatedMediaCount)
                .finally(() => setMediaLoading(false))
            )}
          />
        </RelatedItem>
      )}
      { props.onLoadOrganizations && (
        <RelatedItem
          className='p-3 pt-1 pb-4'
          count={organizationsCount}
          id='organizations'
          label={t('relatedOrganizations')}
          loading={organizationsLoading}
        >
          <RelatedOrganizations
            className='p-3 pt-1 pb-4'
            emptyMessage={t('relatedOrganizationsEmpty')}
            moreLabel={t('loadMore')}
            onLoad={() => (
              props.onLoadOrganizations()
                .then((resp: any) => setRelatedCount(resp, setOrganizationsCount))
                .finally(() => setOrganizationsLoading(false))
            )}
          />
        </RelatedItem>
      )}
      { props.onLoadPeople && (
        <RelatedItem
          count={peopleCount}
          id='people'
          label={t('relatedPeople')}
          loading={peopleLoading}
        >
          <RelatedPeople
            className='p-3 pt-1 pb-4'
            emptyMessage={t('relatedPeopleEmpty')}
            moreLabel={t('loadMore')}
            onLoad={() => (
              props.onLoadPeople()
                .then((resp: any) => setRelatedCount(resp, setPeopleCount))
                .finally(() => setPeopleLoading(false))
            )}
          />
        </RelatedItem>
      )}
      { props.onLoadPlaces && (
        <RelatedItem
          count={placesCount}
          id='places'
          label={t('relatedPlaces')}
          loading={placesLoading}
        >
          <RelatedPlaces
            className='p-3 pt-1 pb-4'
            emptyMessage={t('relatedPlacesEmpty')}
            moreLabel={t('loadMore')}
            onLoad={() => (
              props.onLoadPlaces()
                .then((resp: any) => setRelatedCount(resp, setPlacesCount))
                .finally(() => setPlacesLoading(false))
            )}
          />
        </RelatedItem>
      )}
      { props.onLoadTaxonomies && (
        <RelatedItem
          className='p-3 pt-1 pb-4'
          count={taxonomiesCount}
          id='taxomonies'
          label={t('relatedTaxonomies')}
          loading={taxonomiesLoading}
        >
          <RelatedTaxonomies
            emptyMessage={t('relatedTaxonomiesEmpty')}
            moreLabel={t('loadMore')}
            onLoad={() => (
              props.onLoadTaxonomies()
                .then((resp: any) => setRelatedCount(resp, setTaxonomiesCount))
                .finally(() => setTaxonomiesLoading(false))
            )}
          />
        </RelatedItem>
      )}
    </RelatedItemsList>
  );
};

RelatedRecords.defaultProps = {
  media: true,
  organizations: true,
  people: true,
  places: true,
  taxonomies: true
};

export default RelatedRecords;
