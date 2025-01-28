import RecordPanel from '@apps/search/panels/RecordPanel';
import { BaseService, CoreData as CoreDataUtils, useLoader } from '@performant-software/core-data';
import { useCurrentRoute, useNavigate } from '@peripleo/peripleo';
import { getPreviewImage } from '@utils/Media';
import { getCurrentId } from '@utils/router';
import React, { useCallback, useMemo } from 'react';
import _ from 'underscore';

interface Props {
  name: string;
  renderItem?: (item: any) => JSX.Element;
  renderName?: (item: any) => string;
  useServiceHook: () => typeof BaseService;
}

const BasePanel = (props: Props) => {
  const Service = props.useServiceHook();
  const navigate = useNavigate();

  const route = useCurrentRoute();
  const id = getCurrentId(route);

  /**
   * Loads the instance record from the Core Data API.
   */
  const onLoad = useCallback(() => Service.fetchOne(id), [id]);
  const { data } = useLoader(onLoad);

  const item = useMemo(() => data && data[props.name], [data, props.name]);

  /**
   * Loads the first related media record from the Core Data API.
   */
  const onLoadMedia = useCallback(() => Service.fetchRelatedMedia(id, { limit: 1 }), [id]);
  const { data: { media_contents: mediaContents = [] } = {} } = useLoader(onLoadMedia);

  /**
   * Loads the related place records from the Core Data API.
   */
  const onLoadPlaces = useCallback(() => Service.fetchRelatedPlaces(id), [id]);
  const { data: { places = [] } = {} } = useLoader(onLoadPlaces);

  /**
   * Memo-izes the geometry.
   */
  const geometry = useMemo(() => !_.isEmpty(places) && CoreDataUtils.toFeatureCollection(places), [places]);

  /**
   * Memo-izes the image.
   */
  const image = useMemo(() => getPreviewImage(mediaContents), [mediaContents]);

  /**
   * Memo-izes the name.
   */
  const name = useMemo(() => (item && props.renderName && props.renderName(item)) || item?.name, [item]);

  return (
    <RecordPanel
      geometry={geometry}
      id={id}
      image={image}
      name={name}
      onClose={() => navigate('/')}
      onLoadMedia={() => Service.fetchRelatedManifests(id)}
      onLoadOrganizations={() => Service.fetchRelatedOrganizations(id)}
      onLoadPeople={() => Service.fetchRelatedPeople(id)}
      onLoadPlaces={() => Service.fetchRelatedPlaces(id)}
      onLoadTaxonomies={() => Service.fetchRelatedTaxonomies(id)}
      userDefined={item?.user_defined}
    >
      { item && props.renderItem && props.renderItem(item) }
    </RecordPanel>
  )
};

export default BasePanel;
