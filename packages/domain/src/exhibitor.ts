import type { Id } from './common.js';

export interface Exhibitor {
  id: Id;
  venueId: Id;
  name: string;
  boothNumber: string;
  destinationId: Id;
  description?: string;
  logoUrl?: string;
  website?: string;
  category?: string;
  tags?: string[];
}
