import type { Id } from './common.js';
import type { VenuePosition } from './position.js';

export interface MapBounds {
  min: { x: number; y: number };
  max: { x: number; y: number };
}

export interface MapViewport {
  center: { x: number; y: number };
  zoom: number;
  rotationDegrees: number;
  pitchDegrees: number;
  buildingId: Id;
  floorId: Id;
}

export type MapMarkerKind =
  | 'user'
  | 'origin'
  | 'destination'
  | 'waypoint'
  | 'transition'
  | 'category';

export interface MapMarker {
  id: Id;
  kind: MapMarkerKind;
  position: VenuePosition;
  label?: string;
  iconKey?: string;
}

/**
 * An asset descriptor for rendering a floor plan.
 * MOCKED: in prototype, `kind === 'svg'` and `uri` points to a bundled
 * placeholder. Production: vector tiles or native map renderer.
 */
export interface FloorplanAsset {
  floorId: Id;
  kind: 'svg' | 'png' | 'mvt' | 'native';
  uri: string;
  bounds: MapBounds;
}
