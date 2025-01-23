import RelatedRecords from '@apps/search/RelatedRecords';
import RecordPanel from '@apps/search/RecordPanel';
import { CoreData as CoreDataUtils, useLoader, useOrganizationsService } from '@performant-software/core-data';
import { useCurrentRoute, useNavigate } from '@peripleo/peripleo';
import { getCurrentId } from '@utils/router';
import React, { useCallback, useMemo } from 'react';

const Organization = () => {
  const OrganizationsService = useOrganizationsService();
  const navigate = useNavigate();

  const route = useCurrentRoute();
  const id = getCurrentId(route);

  /**
   * Loads the organization record from the Core Data API.
   */
  const onLoad = useCallback(() => OrganizationsService.fetchOne(id), [id]);
  const { data: { organization = null } = {} } = useLoader(onLoad);

  /**
   * Loads the related place records from the Core Data API.
   */
  const onLoadPlaces = useCallback(() => OrganizationsService.fetchRelatedPlaces(id), [id]);
  const { data: { places = [] } = {} } = useLoader(onLoadPlaces);

  /**
   * Memo-izes the geometry.
   */
  const geometry = useMemo(() => CoreDataUtils.toFeatureCollection(places), [places]);

  return (
    <RecordPanel
      geometry={geometry}
      item={organization}
      onClose={() => navigate('/')}
    >
      <RelatedRecords
        key={`related-${id}`}
        onLoadMedia={() => OrganizationsService.fetchRelatedManifests(id)}
        onLoadOrganizations={() => OrganizationsService.fetchRelatedOrganizations(id)}
        onLoadPeople={() => OrganizationsService.fetchRelatedPeople(id)}
        onLoadPlaces={() => OrganizationsService.fetchRelatedPlaces(id)}
        onLoadTaxonomies={() => OrganizationsService.fetchRelatedTaxonomies(id)}
      />
    </RecordPanel>
  )
};

export default Organization;
