import type { Venue } from '@javits/domain';

/**
 * Seed venue: one venue, two buildings, three floors in the North Building
 * and two in the South Building. Coordinates are in meters in a local frame
 * centered roughly on the middle of each floor.
 *
 * This data is shaped to be compatible with what a real Cisco venue export
 * would provide, but has not been validated against any real export. Do not
 * ship to production.
 */
export const seedVenues: Venue[] = [
  {
    id: 'venue_javits',
    slug: 'javits-center',
    name: 'Javits Center',
    address: {
      line1: '655 W 34th St',
      city: 'New York',
      region: 'NY',
      postalCode: '10001',
      countryCode: 'US',
    },
    timezone: 'America/New_York',
    defaultBuildingId: 'bldg_north',
    buildings: [
      {
        id: 'bldg_north',
        venueId: 'venue_javits',
        name: 'North Building',
        shortCode: 'N',
        defaultFloorId: 'floor_north_l1',
        floors: [
          {
            id: 'floor_north_l1',
            buildingId: 'bldg_north',
            level: 1,
            name: 'L1',
            displayName: 'Level 1 — Halls & Registration',
            bounds: { min: { x: -120, y: -80 }, max: { x: 120, y: 80 } },
            zones: [
              { id: 'zone_hall_a', floorId: 'floor_north_l1', name: 'Hall A', type: 'hall' },
              { id: 'zone_hall_b', floorId: 'floor_north_l1', name: 'Hall B', type: 'hall' },
              { id: 'zone_n_lobby', floorId: 'floor_north_l1', name: 'North Lobby', type: 'lobby' },
            ],
          },
          {
            id: 'floor_north_l2',
            buildingId: 'bldg_north',
            level: 2,
            name: 'L2',
            displayName: 'Level 2 — Food & Lounges',
            bounds: { min: { x: -120, y: -80 }, max: { x: 120, y: 80 } },
            zones: [
              { id: 'zone_l2_food', floorId: 'floor_north_l2', name: 'Food Court', type: 'concourse' },
              { id: 'zone_l2_lounge', floorId: 'floor_north_l2', name: 'Exhibitor Lounge', type: 'meeting_area' },
            ],
          },
          {
            id: 'floor_north_l4',
            buildingId: 'bldg_north',
            level: 4,
            name: 'L4',
            displayName: 'Level 4 — Meeting Rooms',
            bounds: { min: { x: -120, y: -80 }, max: { x: 120, y: 80 } },
            zones: [
              { id: 'zone_l4_meetings', floorId: 'floor_north_l4', name: 'Meeting Rooms 401–420', type: 'meeting_area' },
            ],
          },
        ],
      },
      {
        id: 'bldg_south',
        venueId: 'venue_javits',
        name: 'South Building',
        shortCode: 'S',
        defaultFloorId: 'floor_south_l1',
        floors: [
          {
            id: 'floor_south_l1',
            buildingId: 'bldg_south',
            level: 1,
            name: 'L1',
            displayName: 'Level 1 — South Hall',
            bounds: { min: { x: -120, y: -80 }, max: { x: 120, y: 80 } },
            zones: [
              { id: 'zone_hall_s', floorId: 'floor_south_l1', name: 'South Hall', type: 'hall' },
              { id: 'zone_s_lobby', floorId: 'floor_south_l1', name: 'South Lobby', type: 'lobby' },
            ],
          },
          {
            id: 'floor_south_l2',
            buildingId: 'bldg_south',
            level: 2,
            name: 'L2',
            displayName: 'Level 2 — Press & Services',
            bounds: { min: { x: -120, y: -80 }, max: { x: 120, y: 80 } },
            zones: [
              { id: 'zone_l2_press', floorId: 'floor_south_l2', name: 'Press Center', type: 'service' },
            ],
          },
        ],
      },
    ],
  },
];
