import ManifestThumbnail, { type Collection } from '@apps/search/ManifestThumbnail';
import TranslationContext from '@apps/search/TranslationContext';
import UserDefinedFieldView from '@components/UserDefinedFieldView';
import {
  BaseService,
  CoreData as CoreDataUtils,
  KeyValueList,
  MediaGallery,
  RecordDetailPanel,
  useLoader
} from '@performant-software/core-data';
import { LocationMarkers } from '@performant-software/geospatial';
import { useCurrentRoute, useNavigate, useRuntimeConfig } from '@peripleo/peripleo';
import { getBoundingBoxOptions } from '@utils/map';
import { getNameView } from '@utils/people';
import { getCurrentId } from '@utils/router';
import clsx from 'clsx';
import React, {
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import _ from 'underscore';

interface Props {
  className?: string;
  icon?: string;
  name: string;
  renderItem?: (item: any) => JSX.Element;
  renderName?: (item: any) => string;
  resolveGeometry?: (item: any) => any;
  useServiceHook: () => typeof BaseService;
}

const INVERSE_SUFFIX = '_inverse';

const BasePanel = (props: Props) => {
  const [manifestUrl, setManifestUrl] = useState<string | undefined>();

  const Service = props.useServiceHook();
  const navigate = useNavigate();
  const config = useRuntimeConfig();
  const { t } = useContext(TranslationContext);

  const route = useCurrentRoute();
  const id = getCurrentId(route);

  /**
   * Transforms the passed list of items and groups them by the relationship ID.
   */
  const getRelatedRecords = useCallback((items, icon, transformItem) => {
    const transformedRecords = [];

    _.each(items, (item) => {
      const relationshipId = item.project_model_relationship_uuid;
      const inverse = item.project_model_relationship_inverse;
      const key = `${relationshipId}${inverse ? INVERSE_SUFFIX : ''}`;

      let groupedRecords = _.findWhere(transformedRecords, { relationshipId });

      if (!groupedRecords) {
        groupedRecords = {
          relationshipId,
          icon,
          items: [],
          title: t(key)
        }

        transformedRecords.push(groupedRecords);
      }

      groupedRecords.items.push(transformItem(item));
    });

    return transformedRecords;
  }, [t]);

  /**
   * Loads the base record from the Core Data API.
   */
  const onLoad = useCallback(() => Service.fetchOne(id), [id]);
  const { data } = useLoader(onLoad, null, [id]);

  /**
   * Loads the related events from the Core Data API.
   */
  const onLoadEvents = useCallback(() => Service.fetchRelatedEvents(id, { per_page: 0 }), [id]);
  const { data: { events = [] } = {} } = useLoader(onLoadEvents, null, [id]);

  /**
   * Loads the related instances from the Core Data API.
   */
  const onLoadInstances = useCallback(() => Service.fetchRelatedInstances(id, { per_page: 0 }), [id]);
  const { data: { instances = [] } = {} } = useLoader(onLoadInstances, null, [id]);

  /**
   * Loads the related items from the Core Data API.
   */
  const onLoadItems = useCallback(() => Service.fetchRelatedItems(id, { per_page: 0 }), [id]);
  const { data: { items = [] } = {} } = useLoader(onLoadItems, null, [id]);

  /**
   * Loads the related organizations from the Core Data API.
   */
  const onLoadOrganizations = useCallback(() => Service.fetchRelatedOrganizations(id, { per_page: 0 }), [id]);
  const { data: { organizations = [] } = {} } = useLoader(onLoadOrganizations, null, [id]);

  /**
   * Loads the IIIF collection manifest from the Core Data API.
   */
  const onLoadManifests = useCallback(() => Service.fetchRelatedManifests(id, { per_page: 0 }), [id]);
  const { data: collection = {} }: { collection: Collection } = useLoader(onLoadManifests, null, [id]);

  /**
   * Loads the related people from the Core Data API.
   */
  const onLoadPeople = useCallback(() => Service.fetchRelatedPeople(id, { per_page: 0}), [id]);
  const { data: { people = [] } = {} } = useLoader(onLoadPeople, null, [id]);

  /**
   * Loads the related place records from the Core Data API.
   */
  const onLoadPlaces = useCallback(() => Service.fetchRelatedPlaces(id, { per_page: 0 }), [id]);
  const { data: { places = [] } = {} } = useLoader(onLoadPlaces, null, [id]);

  /**
   * Loads the related taxonomies from the Core Data API.
   */
  const onLoadTaxonomies = useCallback(() => Service.fetchRelatedTaxonomies(id, { per_page: 0 }), [id]);
  const { data: { taxonomies = [] } = {} } = useLoader(onLoadTaxonomies, null, [id]);

  /**
   * Loads the related works from the Core Data API.
   */
  const onLoadWorks = useCallback(() => Service.fetchRelatedWorks(id, { per_page: 0 }), [id]);
  const { data: { works = [] } = {} } = useLoader(onLoadWorks, null, [id]);

  /**
   * Memo-izes the bounding box options.
   */
  const bboxOptions = useMemo(() => getBoundingBoxOptions(config.map.max_zoom), [config]);

  /**
   * Memo-izes the base record.
   */
  const item = useMemo(() => data && data[props.name], [data, props.name]);

  /**
   * Memo-izes the geometry.
   */
  const geometry = useMemo(() => {
    if (props.resolveGeometry && item) {
      return props.resolveGeometry(item);
    }

    return !_.isEmpty(places) && CoreDataUtils.toFeatureCollection(places);
  }, [item, places, props.resolveGeometry]);

  /**
   * Memo-izes the related media items.
   */
  const manifest = useMemo(() => {
    if (_.isEmpty(collection.items)) {
      return [];
    }

    const count = _.reduce(collection.items, (memo, item) => memo + item.item_count, 0);
    const title = t('relatedMedia', { count });

    return [{
      items: _.map(collection.items, (item) => item),
      renderItem: (item) => (
        <ManifestThumbnail
          className='py-2 px-6'
          itemCount={item.item_count}
          name={_.first(item.label?.en)}
          onClick={() => setManifestUrl(item.id)}
          thumbnail={item.thumbnail}
        />
      ),
      renderTitle: () => title,
      title
    }];
  }, [collection]);

  /**
   * Memo-izes the name.
   */
  const name = useMemo(() => (item && props.renderName && props.renderName(item)) || item?.name, [item]);

  /**
   * Transforms all the related records.
   */
  const relatedRecords = useMemo(() => [
    ...getRelatedRecords(events, 'date', (event) => ({
      name: event.name,
      onClick: () => navigate(`/events/${event.uuid}`)
    })),
    ...getRelatedRecords(instances, null, (instance) => ({
      name: instance.name,
      onClick: () => navigate(`/instances/${instance.uuid}`)
    })),
    ...getRelatedRecords(items, null, (item) => ({
      name: item.name,
      onClick: () => navigate(`/items/${item.uuid}`)
    })),
    ...manifest,
    ...getRelatedRecords(organizations, 'participants', (organization) => ({
      name: organization.name,
      onClick: () => navigate(`/organizations/${organization.uuid}`)
    })),
    ...getRelatedRecords(people, 'person', (person) => ({
      name: getNameView(person),
      onClick: () => navigate(`/people/${person.uuid}`)
    })),
    ...getRelatedRecords(places, 'location', (place) => ({
      name: place.name,
      onClick: () => navigate(`/places/${place.uuid}`)
    })),
    ...getRelatedRecords(taxonomies, null, (taxonomy) => ({
      name: taxonomy.name
    })),
    ...getRelatedRecords(works, null, (work) => ({
      name: work.name,
      onClick: () => navigate(`/works/${work.uuid}`)
    })),
  ], [
    events,
    instances,
    items,
    manifest,
    organizations,
    people,
    places,
    taxonomies,
    works,
    getRelatedRecords
  ]);

  /**
   * Renders the user-defined field value for the passed data type.
   */
  const renderUserDefined = useCallback((type: string, value: any) => (
    <UserDefinedFieldView
      type={type}
      value={value}
    />
  ), []);

  /**
   * Memo-izes user defined field values.
   *
   * @type {UserDefinedField[]|*[]}
   */
  const userDefined = useMemo(() => (
    _.chain(item?.user_defined || [])
      .values()
      .filter((u) => Boolean(u.value))
      .map(({ label, type, value }) => ({
        label,
        value: renderUserDefined(type, value)
      }))
      .value()
  ), [item, renderUserDefined]);

  return (
    <aside
      className={clsx(
        'flex',
        'flex-col',
        'bg-white/80',
        'backdrop-blur',
        'shadow',
        'overflow-y-auto',
        props.className
      )}
    >
      <RecordDetailPanel
        count
        icon={props.icon}
        onClose={() => navigate('/')}
        relations={relatedRecords}
        title={name}
      >
        { item && props.renderItem && props.renderItem(item) }
        { userDefined && (
          <KeyValueList
            items={userDefined}
          />
        )}
      </RecordDetailPanel>
      { geometry && (
        <LocationMarkers
          animate
          boundingBoxOptions={bboxOptions}
          fitBoundingBox={_.get(config.map, 'zoom_to_place', true)}
          data={geometry}
          layerId='current'
        />
      )}
      { manifestUrl && (
        <MediaGallery
          manifestUrl={manifestUrl}
          onClose={() => setManifestUrl(null)}
        />
      )}
    </aside>
  );
};

export default BasePanel;
