import type { VenueLocation, Route } from "@/types/models";

/**
 * WayfindingService interface — adapter-based architecture.
 * --------------------------------
 * v1 implementation is CiscoSpacesAdapter (mocked). A future PointrAdapter
 * could be added behind the same interface when/if the contract closes — but
 * per the 2026-04-18 product call, we are NOT scaffolding Pointr stubs now.
 */
export interface WayfindingService {
  /** Return the full location catalog. */
  listLocations(): Promise<VenueLocation[]>;
  /** Find by fuzzy name — used for the search bar on /map. */
  search(query: string): Promise<VenueLocation[]>;
  /** Return a (mocked) route from A to B. Respects accessible flag. */
  getRoute(fromId: string, toId: string, accessible: boolean): Promise<Route>;
  /** Which provider is currently serving this service. */
  providerName(): string;
}
