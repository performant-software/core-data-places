import Event from '@apps/search/Event';
import { EventsList, FacetTimeline, Modal } from '@performant-software/core-data';
import { List } from 'lucide-react';
import React, { useState } from 'react';
import { useRange } from 'react-instantsearch';

interface Props {
  attribute: string;
}

const SearchTimeline = (props: Props) => {
  const [currentEvent, setCurrentEvent] = useState<any>();
  const [events, setEvents] = useState<Array<any>>();
  const [listView, setListView] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<any>();

  const { attribute } = props;
  const { range, refine, start } = useRange({ attribute });

  return (
    <footer
      className='fixed bottom-0 z-[2] w-[calc(100vw-350px)] ms-[350px] bg-gray-1000 text-white fill-white'
    >
      <FacetTimeline
        actions={[{
          label: 'Show List View',
          icon: (
            <List />
          ),
          onClick: () => setListView(true)
        }]}
        className='py-4 pt-20'
        classNames={{
          button: 'px-4',
          range: 'bg-white',
          thumb: 'bg-white',
          track: 'bg-gray-400',
          zoom: 'text-white'
        }}
        onClick={(event: any) => setCurrentEvent(event)}
        onLoad={(events: Array<any>) => setEvents(events)}
        range={range}
        refine={refine}
        start={start}
        zoom={10}
      />
      { currentEvent && (
        <Modal
          className='max-w-sm'
          onClose={() => setCurrentEvent(null)}
          open
        >
          <Event
            uuid={currentEvent.uuid}
          />
        </Modal>
      )}
      { listView && (
        <Modal
          onClose={() => setListView(false)}
          open
        >
          <div
            className='flex gap-4'
          >
            <div
              className='basis-full h-[80vh] overflow-auto'
            >
              <EventsList
                className='px-3 py-3'
                description
                events={events}
                isSelected={(event: any) => selectedEvent?.uuid === event.uuid}
                onClick={(event: any) => setSelectedEvent(event)}
              />
            </div>
            { selectedEvent && (
              <div
                className='basis-full'
              >
                <Event
                  uuid={selectedEvent.uuid}
                />
              </div>
            )}
          </div>
        </Modal>
      )}
    </footer>
  );
};

export default SearchTimeline;
