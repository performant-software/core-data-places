import RelatedRecords from '@apps/search/RelatedRecords';
import { EventDetails, useEventsService } from '@performant-software/core-data';
import React from 'react';

type Props = {
  uuid: string
};

const Event = (props: Props) => {
  const EventsService = useEventsService();

  return (
    <>
      <EventDetails
        className='px-3 py-3'
        id={props.uuid}
      />
      <RelatedRecords
        key={props.uuid}
        onLoadMedia={() => EventsService.fetchRelatedManifests(props.uuid)}
        onLoadOrganizations={() => EventsService.fetchRelatedOrganizations(props.uuid)}
        onLoadPeople={() => EventsService.fetchRelatedPeople(props.uuid)}
        onLoadPlaces={() => EventsService.fetchRelatedPlaces(props.uuid)}
        onLoadTaxonomies={() => EventsService.fetchRelatedTaxonomies(props.uuid)}
      />
    </>
  );
};

export default Event;
