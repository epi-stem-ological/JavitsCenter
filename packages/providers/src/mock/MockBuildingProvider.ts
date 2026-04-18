import type {
  Building,
  Floor,
  Id,
  Venue,
  VenueSummary,
} from '@javits/domain';
import type { BuildingProvider } from '../interfaces/BuildingProvider.js';
import { seedVenues } from '@javits/mock-data';

/**
 * MOCK — reads from the in-repo seed venue. Safe to use in any environment
 * except production. Asynchronous shape is preserved to match the future
 * network/SDK-backed implementations.
 */
export class MockBuildingProvider implements BuildingProvider {
  private readonly venues: Venue[];

  constructor(venues: Venue[] = seedVenues) {
    this.venues = venues;
  }

  async listVenues(): Promise<VenueSummary[]> {
    return this.venues.map((v) => ({
      id: v.id,
      slug: v.slug,
      name: v.name,
      city: v.address.city,
    }));
  }

  async getVenue(venueId: Id): Promise<Venue> {
    const v = this.venues.find((x) => x.id === venueId);
    if (!v) throw new Error(`Venue not found: ${venueId}`);
    return v;
  }

  async getBuilding(buildingId: Id): Promise<Building> {
    for (const v of this.venues) {
      const b = v.buildings.find((x) => x.id === buildingId);
      if (b) return b;
    }
    throw new Error(`Building not found: ${buildingId}`);
  }

  async getFloor(floorId: Id): Promise<Floor> {
    for (const v of this.venues) {
      for (const b of v.buildings) {
        const f = b.floors.find((x) => x.id === floorId);
        if (f) return f;
      }
    }
    throw new Error(`Floor not found: ${floorId}`);
  }

  async listFloors(buildingId: Id): Promise<Floor[]> {
    const b = await this.getBuilding(buildingId);
    return [...b.floors].sort((a, b) => b.level - a.level);
  }
}
