import type { Id, Address } from './common.js';
import type { MapBounds } from './map.js';

export interface Venue {
  id: Id;
  slug: string;
  name: string;
  address: Address;
  timezone: string;
  defaultBuildingId: Id;
  buildings: Building[];
}

export interface VenueSummary {
  id: Id;
  slug: string;
  name: string;
  city: string;
}

export interface Building {
  id: Id;
  venueId: Id;
  name: string;
  shortCode: string;
  defaultFloorId: Id;
  floors: Floor[];
}

export interface Floor {
  id: Id;
  buildingId: Id;
  level: number;
  name: string;
  displayName: string;
  /**
   * URL or bundled asset key for a floor plan image.
   * MOCKED: placeholder SVGs in prototype.
   */
  mapImageUrl?: string;
  /**
   * Bounds in local floor coordinates (meters).
   */
  bounds: MapBounds;
  zones: Zone[];
}

export type ZoneType =
  | 'hall'
  | 'lobby'
  | 'concourse'
  | 'section'
  | 'meeting_area'
  | 'service';

export interface Zone {
  id: Id;
  floorId: Id;
  name: string;
  type: ZoneType;
  /** Optional outline in local floor coordinates (meters). */
  polygon?: Array<{ x: number; y: number }>;
}
