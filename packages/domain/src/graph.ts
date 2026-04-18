import type { Id } from './common.js';
import type { VenuePosition } from './position.js';
import type { TransitionMethod } from './route.js';

export type GraphNodeType =
  | 'waypoint'
  | 'junction'
  | 'destination'
  | 'transition'
  | 'entrance';

export interface GraphNode {
  id: Id;
  position: VenuePosition;
  type: GraphNodeType;
  destinationId?: Id;
  transition?: FloorTransition;
  landmark?: string;
}

export interface GraphEdge {
  id: Id;
  fromNodeId: Id;
  toNodeId: Id;
  distanceMeters: number;
  /** If false, router treats as blocked when `accessible: true`. */
  isAccessible: boolean;
  /** One-way edges are used for escalators. */
  isOneWay: boolean;
}

export interface FloorTransition {
  method: TransitionMethod;
  connectsFloorIds: Id[];
  isAccessible: boolean;
}

export interface VenueGraph {
  venueId: Id;
  nodes: GraphNode[];
  edges: GraphEdge[];
}
