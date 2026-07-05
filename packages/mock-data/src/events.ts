import type { VenueEvent } from '@javits/domain';

/**
 * SAMPLE EVENTS — fictional schedules for prototype demos only.
 * Names reference real event brands to make demos legible to Javits
 * stakeholders; do not present these as live schedules.
 */
export const seedEvents: VenueEvent[] = [
  {
    id: 'evt_nrf_2027',
    venueId: 'venue_javits',
    name: 'NRF 2027 (sample)',
    description: "Retail's Big Show — sample event data for prototype demos.",
    startAt: '2027-01-17T09:00:00-05:00',
    endAt: '2027-01-19T17:00:00-05:00',
    category: 'trade show',
    location: { id: 'dest_hall_3a', name: 'Hall 3A', floorId: 'floor_main_l3' },
  },
  {
    id: 'evt_auto_show',
    venueId: 'venue_javits',
    name: 'New York International Auto Show (sample)',
    description: 'Sample event data for prototype demos.',
    startAt: '2027-04-09T10:00:00-04:00',
    endAt: '2027-04-18T19:00:00-04:00',
    category: 'public show',
    location: { id: 'dest_hall_3b', name: 'Hall 3B', floorId: 'floor_main_l3' },
  },
  {
    id: 'evt_comic_expo',
    venueId: 'venue_javits',
    name: 'Empire City Comic Expo (sample)',
    description: 'Fictional comic-convention-style event for prototype demos.',
    startAt: '2027-10-08T10:00:00-04:00',
    endAt: '2027-10-11T18:00:00-04:00',
    category: 'fan convention',
    location: { id: 'dest_special_events_hall', name: 'Special Events Hall', floorId: 'floor_main_l4' },
  },
  {
    id: 'evt_medtech',
    venueId: 'venue_javits',
    name: 'MedTech East Expo (sample)',
    description: 'Fictional medical-technology expo for prototype demos.',
    startAt: '2027-06-02T08:00:00-04:00',
    endAt: '2027-06-04T17:00:00-04:00',
    category: 'trade show',
    location: { id: 'dest_river_pavilion', name: 'River Pavilion', floorId: 'floor_main_l4' },
  },
  {
    id: 'evt_internal_ops',
    venueId: 'venue_javits',
    name: 'Javits Internal Ops Briefing (sample)',
    description: 'Internal venue event — staff visibility only in production.',
    startAt: '2027-03-12T08:30:00-05:00',
    endAt: '2027-03-12T12:00:00-05:00',
    category: 'internal',
    location: { id: 'dest_room_409', name: 'Room 409', floorId: 'floor_main_l4' },
  },
];
