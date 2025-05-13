import ManifestThumbnail, { type Collection } from '@apps/search/ManifestThumbnail';
import SearchContext, { useSearchConfig } from '@apps/search/SearchContext';
import Base from '@backend/api/coreData/base';
import UserDefinedFieldView from '@components/UserDefinedFieldView';
import TranslationContext from '@contexts/TranslationContext';
import {
  CoreData as CoreDataUtils,
  KeyValueList,
  MediaGallery,
  RecordDetailPanel,
  useLoader
} from '@performant-software/core-data';
import { LocationMarkers } from '@performant-software/geospatial';
import { useSelection } from '@peripleo/maplibre';
import { useCurrentRoute, useNavigate } from '@peripleo/peripleo';
import { getNameView } from '@utils/people';
import { getCurrentId } from '@utils/router';
import clsx from 'clsx';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import _ from 'underscore';

interface Props {
  className?: string;
  icon?: string;
  name: string;
  exclusions?: string[];
  panelHistory?: any[];
  renderItem?: (item: any) => JSX.Element;
  renderName?: (item: any) => string;
  resolveDetailPageUrl?: (item: any) => string;
  resolveGeometry?: (item: any) => any;
  service: Base;
  setPanelHistory?: any;
}

const INVERSE_SUFFIX = '_inverse';

const BasePanel = (props: Props) => {
  const [manifestUrl, setManifestUrl] = useState<string | undefined>();
  const [coverUrl, setCoverUrl] = useState(null);
  const { panelHistory, setPanelHistory } = props;

  const navigate = useNavigate();
  const config = useSearchConfig();
  const { t } = useContext(TranslationContext);
  const { setSelected } = useSelection();

  const route = useCurrentRoute();
  const id = getCurrentId(route);

  const exclude = props.exclusions || [];

  const { boundingBoxOptions } = useContext(SearchContext);

  
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
  
  const onClose = useCallback(() => {
    navigate('/');
    setSelected(null);
    setPanelHistory([]);
  }, []);

  const onGoBack = useCallback(() => {
    history.back();
  }, []);
  
  /**
   * Loads the base record from the Core Data API.
  */
  const onLoad = () => props.service.fetchOne(id);
  const { data } = useLoader(onLoad, null, [id, props.service]);
  
  /**
   * Loads the related events from the Core Data API.
  */
  const onLoadEvents = () => props.service.fetchRelatedEvents(id, { per_page: 0 });
  const { data: { events = [] } = {}, loading: eventsLoading } = useLoader(onLoadEvents, null, [id, props.service]);

  /**
   * Loads the related instances from the Core Data API.
   */
  const onLoadInstances = () => props.service.fetchRelatedInstances(id, { per_page: 0 });
  const { data: { instances = [] } = {}, loading: instancesLoading } = useLoader(onLoadInstances, null, [id, props.service]);

  /**
   * Loads the related items from the Core Data API.
   */
  const onLoadItems = () => props.service.fetchRelatedItems(id, { per_page: 0 });
  const { data: { items = [] } = {}, loading: itemsLoading } = useLoader(onLoadItems, null, [id, props.service]);

  /**
   * Loads the related organizations from the Core Data API.
   */
  const onLoadOrganizations = () => props.service.fetchRelatedOrganizations(id, { per_page: 0 });
  const { data: { organizations = [] } = {}, loading: organizationsLoading } = useLoader(onLoadOrganizations, null, [id, props.service]);

  /**
   * Loads the media contents from the Core Data API.
   */
  const onLoadMediaContents = () => props.service.fetchRelatedMedia(id, { per_page: 0 });
  const { data: { mediaContents = [] } = {}, loading: mediaContentsLoading } = useLoader(onLoadMediaContents, null, [id, props.service]);

  /**
   * Loads the IIIF collection manifest from the Core Data API.
  */
 const onLoadManifests = () => props.service.fetchRelatedManifests(id, { per_page: 0 });
 const { data: collection = {}, loading: collectionLoading }: { collection: Collection, loading: boolean } = useLoader(onLoadManifests, null, [id, props.service]);
 
 /**
  * Loads the related people from the Core Data API.
 */
const onLoadPeople = () => props.service.fetchRelatedPeople(id, { per_page: 0});
const { data: { people = [] } = {}, loading: peopleLoading } = useLoader(onLoadPeople, null, [id, props.service]);

/**
 * Loads the related place records from the Astro API.
*/
  const onLoadPlaces = () => props.service.fetchRelatedPlaces(id, { per_page: 0 });
  const { data: { places = [] } = {}, loading: placesLoading } = useLoader(onLoadPlaces, null, [id, props.service]);

  /**
   * Loads the related taxonomies from the Core Data API.
   */
  const onLoadTaxonomies = () => props.service.fetchRelatedTaxonomies(id, { per_page: 0 });
  const { data: { taxonomies = [] } = {}, loading: taxonomiesLoading } = useLoader(onLoadTaxonomies, null, [id, props.service]);
  
  /**
   * Loads the related works from the Core Data API.
  */
  const onLoadWorks = () => props.service.fetchRelatedWorks(id, { per_page: 0 });
  const { data: { works = [] } = {}, loading: worksLoading } = useLoader(onLoadWorks, null, [id, props.service]);
  
  /**
   * Memo-izes the base record.
  */
 const item = useMemo(() => {
   let item;
   
   if (data) {
     item = {
       ..._.omit(data[props.name], ...exclude),
       user_defined: _.omit(data[props.name].user_defined, ...exclude)
      }
    }

    return item;
  },
  [data, props.name]);

  /**
   * Updates the cover URL when the record or loading states change.
  */
 useEffect(() => {
   setCoverUrl((prev) => {
     // include a placeholder if the previous record had a cover image
      // to avoid sudden content shifting.
      if (mediaContentsLoading && prev) {
        return '/placeholder.png'
      }
      
      if (mediaContents.length > 0) {
        return mediaContents[0].content_preview_url
      }

      return null
    })
  }, [item, mediaContentsLoading])
  
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
  const relatedManifest = useMemo(() => {
    if (_.isEmpty(collection.items)) {
      return [];
    }
    
    const count = _.reduce(collection.items, (memo, item) => memo + item.item_count, 0);
    const title = t('relatedMedia', { count });

    return [{
      horizontal: true,
      items: _.map(collection.items, (item) => item),
      renderItem: (item) => (
        <ManifestThumbnail
          className='ps-6 pe-6'
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
   * Updates the panel history array when the name is set or udpated.
   */
  useEffect(() => {
    if (name) {
      const ind = panelHistory.findIndex((item) => item === name);
      setPanelHistory((current) => (ind < 0 ? [...current, name] : [...current].slice(0,ind+1)));
    }
  }, [name]);

  /**
   * Transforms the related events.
   */
  const relatedEvents = useMemo(() => getRelatedRecords(events, 'date', (event) => ({
    name: event.name,
    onClick: () => navigate(`/events/${event.uuid}`)
  })), [getRelatedRecords, events]);

  /**
   * Transforms the related instances.
   */
  const relatedInstances = useMemo(() => getRelatedRecords(instances, null, (instance) => ({
    name: instance.name,
    onClick: () => navigate(`/instances/${instance.uuid}`)
  })), [getRelatedRecords, instances]);

  /**
   * Transforms the related items.
   */
  const relatedItems = useMemo(() => getRelatedRecords(items, null, (item) => ({
    name: item.name,
    onClick: () => navigate(`/items/${item.uuid}`)
  })), [getRelatedRecords, items]);

  /**
   * Transforms the related organizations.
   */
  const relatedOrganizations = useMemo(() => getRelatedRecords(organizations, 'occupation', (organization) => ({
    name: organization.name,
    onClick: () => navigate(`/organizations/${organization.uuid}`)
  })), [getRelatedRecords, organizations]);

  /**
   * Transforms the related people.
   */
  const relatedPeople = useMemo(() => getRelatedRecords(people, 'person', (person) => ({
    name: getNameView(person),
    onClick: () => navigate(`/people/${person.uuid}`)
  })), [getRelatedRecords, people]);

  /**
   * Transforms the related places.
   */
  const relatedPlaces = useMemo(() => getRelatedRecords(places, 'location', (place) => ({
    name: place.name,
    onClick: () => navigate(`/places/${place.uuid}`)
  })), [getRelatedRecords, places]);

  /**
   * Transforms the related taxonomies.
   */
  const relatedTaxonomies = useMemo(() => getRelatedRecords(taxonomies, null, (taxonomy) => ({
    name: taxonomy.name
  })), [getRelatedRecords, taxonomies]);

  /**
   * Transforms the related works.
   */
  const relatedWorks = useMemo(() => getRelatedRecords(works, null, (work) => ({
    name: work.name,
    onClick: () => navigate(`/works/${work.uuid}`)
  })), [getRelatedRecords, works]);

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


  /**
   * Memo-izes included relations
   */
  const relations = () => {
    let ret = [];

    if(!exclude.includes('relatedEvents')) ret = ret.concat(relatedEvents);
    if(!exclude.includes('relatedInstances')) ret = ret.concat(relatedInstances);
    if(!exclude.includes('relatedItems')) ret = ret.concat(relatedItems);
    if(!exclude.includes('relatedOrganizations')) ret = ret.concat(relatedOrganizations);
    if(!exclude.includes('relatedManifest')) ret = ret.concat(relatedManifest);
    if(!exclude.includes('relatedPeople')) ret = ret.concat(relatedPeople);
    if(!exclude.includes('relatedPlaces')) ret = ret.concat(relatedPlaces);
    if(!exclude.includes('relatedTaxonomies')) ret = ret.concat(relatedTaxonomies);
    if(!exclude.includes('relatedWorks')) ret = ret.concat(relatedWorks);

    return ret;
  };

  return (
    <aside
      className={clsx(
        'flex',
        'flex-col',
        'bg-white',
        'backdrop-blur-sm',
        'overflow-y-auto',
        props.className
      )}
    >
      <RecordDetailPanel
        breadcrumbs={panelHistory.length > 1 && panelHistory.slice(-2)}
        count
        coverUrl={coverUrl}
        icon={props.icon}
        loading={
          eventsLoading ||
          instancesLoading ||
          itemsLoading ||
          organizationsLoading ||
          mediaContentsLoading ||
          collectionLoading ||
          peopleLoading ||
          placesLoading ||
          taxonomiesLoading ||
          worksLoading
        }
        onClose={onClose}
        onGoBack={panelHistory.length > 1 && onGoBack}
        relations={relations()}
        title={name}
        detailPageUrl={props.resolveDetailPageUrl(item)}
      >
        { item && props.renderItem && props.renderItem(item) }
        { !_.isEmpty(userDefined) && (
          <KeyValueList
            items={userDefined}
          />
        )}
      </RecordDetailPanel>
      { geometry && (
        <LocationMarkers
          animate
          boundingBoxOptions={boundingBoxOptions}
          data={geometry}
          fitBoundingBox={_.get(config.map, 'zoom_to_place', true)}
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
