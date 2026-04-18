import type { UserPosition } from '@javits/domain';

/**
 * Default mock initial position — at the North Entrance on Level 1.
 * In the prototype this is where the simulated user "starts" each session.
 */
export const seedInitialUserPosition: UserPosition = {
  buildingId: 'bldg_north',
  floorId: 'floor_north_l1',
  x: -100,
  y: 0,
  accuracyMeters: 3,
  timestamp: Date.now(),
  source: 'mock',
};
