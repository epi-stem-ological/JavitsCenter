import type { UserPosition } from '@javits/domain';

/**
 * Default mock initial position — at the Crystal Palace Entrance, Level 1.
 * In the prototype this is where the simulated user "starts" each session.
 */
export const seedInitialUserPosition: UserPosition = {
  buildingId: 'bldg_main',
  floorId: 'floor_main_l1',
  x: -100,
  y: 0,
  accuracyMeters: 3,
  timestamp: Date.now(),
  source: 'mock',
};
