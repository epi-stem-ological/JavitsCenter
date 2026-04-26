import type { VenueLocation, Route } from "@/types/models";
import type { WayfindingService } from "./types";
import { venues } from "@/data/seed";

/**
 * CiscoSpacesAdapter — mock v1.
 * --------------------------------
 * In production: calls the Cisco Spaces location API + BLE beacon network to
 * derive live positions and routes. For the prototype we serve seed data and
 * simulate a small latency so loading states render realistically in the demo.
 *
 * TODO:
 *  - wire to real Cisco Spaces OAuth + tenant
 *  - expose live presence counts per hall
 *  - subscribe to BLE location events for the "You are here" marker
 */
export class CiscoSpacesAdapter implements WayfindingService {
  providerName() {
    return "Cisco Spaces (mock)";
  }

  async listLocations(): Promise<VenueLocation[]> {
    await delay(80);
    return venues;
  }

  async search(query: string): Promise<VenueLocation[]> {
    await delay(120);
    const q = query.trim().toLowerCase();
    if (!q) return venues;
    return venues.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.level.toLowerCase().includes(q)
    );
  }

  async getRoute(fromId: string, toId: string, accessible: boolean): Promise<Route> {
    await delay(140);
    const from = venues.find((v) => v.id === fromId);
    const to = venues.find((v) => v.id === toId);
    // Squared-distance placeholder so distances feel realistic on the demo floor plan
    const d = from && to ? Math.round(Math.hypot(from.xy[0] - to.xy[0], from.xy[1] - to.xy[1]) * 4) : 100;
    return {
      fromId,
      toId,
      distanceMeters: d,
      accessiblePath: accessible || !!(from?.accessible && to?.accessible),
      steps: [
        `Start at ${from?.name ?? "you"}.`,
        "Follow the main concourse toward the nearest escalator or elevator.",
        accessible
          ? "Take the elevator to reach the destination's level."
          : "Take the escalator or stairs to reach the destination's level.",
        `Arrive at ${to?.name ?? "destination"}.`,
      ],
    };
  }
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** App-wide singleton. Swap the implementation in one place. */
export const wayfinding: WayfindingService = new CiscoSpacesAdapter();
