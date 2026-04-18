import type { Id } from './common.js';

/**
 * A position pinned to a specific floor in a specific building.
 * Coordinates are meters from the floor's local origin.
 * `lat`/`lng` are optional and only used for overlays on real-world maps.
 */
export interface VenuePosition {
  buildingId: Id;
  floorId: Id;
  x: number;
  y: number;
  lat?: number;
  lng?: number;
}

export type PositionSource =
  | 'mock'
  | 'cisco-wayfinding'
  | 'gps'
  | 'manual'
  | 'unknown';

/**
 * A live user position, with accuracy and heading.
 * In the prototype, all positions have `source === 'mock'`.
 */
export interface UserPosition extends VenuePosition {
  accuracyMeters: number;
  headingDegrees?: number;
  speedMetersPerSec?: number;
  timestamp: number;
  source: PositionSource;
}

export type LocationStatus =
  | 'idle'
  | 'acquiring'
  | 'active'
  | 'degraded'
  | 'unavailable';
