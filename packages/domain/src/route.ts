import type { Id } from './common.js';
import type { VenuePosition } from './position.js';

export type Maneuver =
  | 'depart'
  | 'straight'
  | 'turn_left'
  | 'turn_right'
  | 'slight_left'
  | 'slight_right'
  | 'sharp_left'
  | 'sharp_right'
  | 'uturn'
  | 'take_elevator'
  | 'take_escalator'
  | 'take_stairs'
  | 'enter_building'
  | 'exit_building'
  | 'arrive';

export type TransitionMethod = 'elevator' | 'escalator' | 'stairs' | 'bridge';

export interface FloorChange {
  method: TransitionMethod;
  fromFloorId: Id;
  toFloorId: Id;
  transitionNodeId: Id;
  isAccessible: boolean;
}

export interface RouteStep {
  id: Id;
  index: number;
  /** Human-readable instruction, e.g. "Turn right at Café 42". */
  instruction: string;
  maneuver: Maneuver;
  distanceMeters: number;
  durationSec: number;
  fromPosition: VenuePosition;
  toPosition: VenuePosition;
  /** Polyline (local floor coordinates) from `fromPosition` to `toPosition`. */
  polyline: Array<{ x: number; y: number; floorId: Id }>;
  floorChange?: FloorChange;
  landmarks?: string[];
}

export interface RouteOptions {
  /** Prefer step-free path (elevators over stairs/escalators). */
  accessible?: boolean;
  /** Units for instruction formatting; UI may also display both. */
  units?: 'metric' | 'imperial';
  /** Average walking speed (m/s) for ETA; prototype default 1.2. */
  walkingSpeedMps?: number;
}

export interface RouteRequest {
  origin: VenuePosition;
  destinationId: Id;
  options?: RouteOptions;
}

export interface Route {
  id: Id;
  origin: VenuePosition;
  destinationId: Id;
  destination: VenuePosition;
  steps: RouteStep[];
  totalDistanceMeters: number;
  estimatedDurationSec: number;
  hasFloorChange: boolean;
  crossesBuildings: boolean;
  /**
   * MOCKED: prototype returns the same geometry as `steps` concatenated.
   * Production may return a separate high-resolution polyline.
   */
  summaryPolyline: Array<{ x: number; y: number; floorId: Id }>;
  generatedAt: number;
}
