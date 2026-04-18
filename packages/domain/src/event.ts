import type { Id, Iso8601 } from './common.js';
import type { DestinationRef } from './destination.js';

export interface VenueEvent {
  id: Id;
  venueId: Id;
  name: string;
  description?: string;
  startAt: Iso8601;
  endAt: Iso8601;
  category?: string;
  location: DestinationRef;
  speakers?: string[];
}
