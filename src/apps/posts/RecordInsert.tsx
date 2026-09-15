import Viewer from '@samvera/clover-iiif/viewer';
import { KeyValueList } from '@performant-software/core-data';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { pluralizeModel } from '@root/src/utils/models';
import UserDefinedFieldView from '@components/UserDefinedFieldView';
import _ from 'underscore';
import PlacesMap from '@components/PlacesMap';
import TranslationContext from '@contexts/TranslationContext';
import { hasDetailPage } from '@root/src/utils/detailPagePaths';

interface RecordInsertProps {
  exclusions?: string[];
  uuid: string;
  media?: boolean;
  map?: boolean; 
  model: string;
  renderItem?: (item: any) => JSX.Element;
  renderName?: (item: any) => string;
  service: any;
};

const RecordInsert = (props: RecordInsertProps) => {
  const { exclusions = [], uuid, renderItem, media = false, map = false, service, model, renderName } = props;
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ item, setItem ] = useState<any>(null);

  const { lang, t } = useContext(TranslationContext);

  useEffect(() => {
    const loadItem = async () => {
      setLoading(true);
      try {
        const resp = await service.fetchOne(uuid);
        if (resp && resp[model]) {
          const data = {
            ..._.omit(resp[model], ...exclusions),
            user_defined: _.omit(resp[model].user_defined, ...exclusions)
          };

          if (map) {
            const placesResp = await service.fetchRelatedPlaces(uuid, { per_page: 0 });
            if (placesResp?.places?.length) {
              data.places = _.map(placesResp.places, (place: any) => (place.uuid));
            }
          }
          setItem(data);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        throw error;
      }
    };

    if (uuid) {
      loadItem();
    }
  }, [uuid, map]);

  const iiifURL = useMemo(() => (
    uuid && `${window.location.origin}/api/${pluralizeModel(model)}/${uuid}/manifests.json`
  ), [uuid, model, window.location.origin]);

  const detailUrl = useMemo(() => {
    if (!hasDetailPage(pluralizeModel(model))) {
      return null;
    }
    return `/${lang}/${pluralizeModel(model)}/${uuid}`;
  }, [lang, model, uuid])

  /**
   * Renders the user-defined field value for the passed data type.
   */
  const renderUserDefined = useCallback((type: string, value: any) => (
    <UserDefinedFieldView
      type={type}
      value={value}
    />
  ), []);

  const userDefined = useMemo(() => (
    _.chain(item?.user_defined || [])
      .values()
      .filter((u: any) => Boolean(u.value))
      .map((field: any) => ({
        label: field.label,
        value: renderUserDefined(field.type, field.value)
      }))
      .value()
  ), [item, renderUserDefined]);

  return (
    item && !loading && (
      <div className="lg:w-[80%] mx-auto border rounded-lg shadow-md not-prose">
        <div className="p-6 lg:p-12">
          <h4 className="text-lg font-semibold">{renderName ? renderName(item) : item?.name}</h4>
          {
            item && renderItem && renderItem(item)
          }
          {
            detailUrl && ( 
              <a href={detailUrl} className="mt-4 px-3 py-2 border border-black rounded-md flex items-center justify-center hover:bg-gray-100 w-max">
                {t('viewDetails')}
              </a>
            )
          }
          { !_.isEmpty(userDefined) && (
            <KeyValueList
              items={userDefined}
            />
          )}
        </div>
        {
          media && iiifURL && ( 
            <Viewer 
              iiifContent={iiifURL} 
              options={{
                informationPanel: {
                  open: false
                }
              }} 
            />
          )
        }
        {
          map && item?.places && ( 
            <div
              className='h-100 w-full flex mx-auto pt-6'
            >
              <PlacesMap
                mapId={uuid}
                placeIds={item.places}
              />
            </div>
          )
        }
      </div>
    )
  ) 
};

export default RecordInsert;