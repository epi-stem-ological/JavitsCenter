import type { Id } from './common.js';
import type { VenuePosition } from './position.js';

export type DestinationCategory =
  | 'hall'
  | 'meeting_room'
  | 'registration'
  | 'help_desk'
  | 'restroom'
  | 'food'
  | 'coffee'
  | 'elevator'
  | 'stairs'
  | 'escalator'
  | 'entrance'
  | 'exit'
  | 'parking'
  | 'atm'
  | 'exhibitor_booth'
  | 'medical'
  | 'lost_and_found'
  | 'coat_check'
  | 'info'
  | 'other';

export interface OpeningHoursSpan {
  /** 0 = Sunday, 6 = Saturday */
  dayOfWeek: number;
  /** "HH:mm" 24-hour */
  opens: string;
  closes: string;
}

export interface Destination {
  id: Id;
  venueId: Id;
  buildingId: Id;
  floorId: Id;
  zoneId?: Id;
  name: string;
  category: DestinationCategory;
  /** Secondary categories for filtering/search. */
  tags: string[];
  description?: string;
  position: VenuePosition;
  iconKey?: string;
  openingHours?: OpeningHoursSpan[];
  isFeatured: boolean;
  /** Optional cross-link to event/exhibitor. */
  exhibitorId?: Id;
  eventId?: Id;
  /** Booth/room display code, e.g. "4512" or "W402". */
  displayCode?: string;
}

export interface DestinationFilter {
  buildingId?: Id;
  floorId?: Id;
  category?: DestinationCategory;
  tag?: string;
  featuredOnly?: boolean;
}

/**
 * Minimal reference to a destination for compact serialization.
 */
export interface DestinationRef {
  id: Id;
  name: string;
  floorId: Id;
}
