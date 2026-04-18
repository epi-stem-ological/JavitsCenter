import type {
  Building,
  Floor,
  Id,
  Venue,
  VenueSummary,
} from '@javits/domain';

/**
 * Static venue data. In production this is backed by the venue export from
 * the Cisco onboarding pipeline or an internal CMS. In the prototype it reads
 * from `@javits/mock-data` seed JSON.
 */
export interface BuildingProvider {
  listVenues(): Promise<VenueSummary[]>;
  getVenue(venueId: Id): Promise<Venue>;
  getBuilding(buildingId: Id): Promise<Building>;
  getFloor(floorId: Id): Promise<Floor>;
  /** Floors in display order (descending level, e.g. L4, L3, L2, L1, B1). */
  listFloors(buildingId: Id): Promise<Floor[]>;
}
