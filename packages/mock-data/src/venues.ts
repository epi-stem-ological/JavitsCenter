import type { Venue } from '@javits/domain';

/**
 * Seed venue: Jacob K. Javits Convention Center — SAMPLE DATA.
 *
 * Floor/hall names are inspired by the real venue (Crystal Palace, Hall 3A/3B,
 * River Pavilion, Room 409) so demos read believably, but geometry, layout,
 * and the Javits North wing here are simplified fictions. Coordinates are
 * meters in a local frame per floor. Do not treat as a real venue survey.
 *
 * Production replaces this with the venue export from the indoor-mapping
 * onboarding pipeline (see docs/05-adapter-integration.md).
 */
export const seedVenues: Venue[] = [
  {
    id: 'venue_javits',
    slug: 'javits-center',
    name: 'Javits Center',
    address: {
      line1: '429 11th Ave',
      city: 'New York',
      region: 'NY',
      postalCode: '10001',
      countryCode: 'US',
    },
    timezone: 'America/New_York',
    defaultBuildingId: 'bldg_main',
    buildings: [
      {
        id: 'bldg_main',
        venueId: 'venue_javits',
        name: 'Main Building',
        shortCode: 'M',
        defaultFloorId: 'floor_main_l1',
        floors: [
          {
            id: 'floor_main_l1',
            buildingId: 'bldg_main',
            level: 1,
            name: 'L1',
            displayName: 'Level 1 — Crystal Palace & Registration',
            bounds: { min: { x: -120, y: -80 }, max: { x: 120, y: 80 } },
            zones: [
              { id: 'zone_crystal_palace', floorId: 'floor_main_l1', name: 'Crystal Palace Lobby', type: 'lobby' },
              { id: 'zone_l1_registration', floorId: 'floor_main_l1', name: 'Registration', type: 'concourse' },
              { id: 'zone_l1_transport', floorId: 'floor_main_l1', name: 'Ground Transportation', type: 'concourse' },
            ],
          },
          {
            id: 'floor_main_l3',
            buildingId: 'bldg_main',
            level: 3,
            name: 'L3',
            displayName: 'Level 3 — Exhibition Halls',
            bounds: { min: { x: -120, y: -80 }, max: { x: 120, y: 80 } },
            zones: [
              { id: 'zone_hall_3a', floorId: 'floor_main_l3', name: 'Hall 3A', type: 'hall' },
              { id: 'zone_hall_3b', floorId: 'floor_main_l3', name: 'Hall 3B', type: 'hall' },
              { id: 'zone_l3_services', floorId: 'floor_main_l3', name: 'Exhibitor Services', type: 'service' },
            ],
          },
          {
            id: 'floor_main_l4',
            buildingId: 'bldg_main',
            level: 4,
            name: 'L4',
            displayName: 'Level 4 — River Pavilion & Meeting Rooms',
            bounds: { min: { x: -120, y: -80 }, max: { x: 120, y: 80 } },
            zones: [
              { id: 'zone_river_pavilion', floorId: 'floor_main_l4', name: 'River Pavilion', type: 'hall' },
              { id: 'zone_l4_meetings', floorId: 'floor_main_l4', name: 'Meeting Rooms 401–415', type: 'meeting_area' },
            ],
          },
        ],
      },
      {
        id: 'bldg_north',
        venueId: 'venue_javits',
        name: 'Javits North',
        shortCode: 'N',
        defaultFloorId: 'floor_north_l1',
        floors: [
          {
            id: 'floor_north_l1',
            buildingId: 'bldg_north',
            level: 1,
            name: 'L1',
            displayName: 'Level 1 — Operations (Staff)',
            bounds: { min: { x: -120, y: -80 }, max: { x: 120, y: 80 } },
            zones: [
              { id: 'zone_n_ops', floorId: 'floor_north_l1', name: 'Operations & Freight', type: 'service' },
            ],
          },
        ],
      },
    ],
  },
];
