import type { Id } from './common.js';
import type { Destination } from './destination.js';
import type { VenuePosition } from './position.js';

export type SearchResultKind = 'destination' | 'exhibitor' | 'event';

export interface SearchContext {
  venueId: Id;
  /** If provided, results can include distance + ETA. */
  origin?: VenuePosition;
  /** Max results, default 20. */
  limit?: number;
  categoryFilter?: string;
}

export interface SearchResult {
  kind: SearchResultKind;
  destination: Destination;
  score: number;
  distanceMeters?: number;
  etaSec?: number;
  /** Which fields matched, for UI highlighting. */
  matchedFields: Array<'name' | 'tag' | 'description' | 'booth' | 'exhibitor' | 'event'>;
}
