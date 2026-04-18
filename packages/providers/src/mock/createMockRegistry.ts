import type { ProviderRegistry } from '../registry.js';
import type { UserPosition, Id } from '@javits/domain';
import { MockBuildingProvider } from './MockBuildingProvider.js';
import { MockDestinationProvider } from './MockDestinationProvider.js';
import { MockLocationProvider } from './MockLocationProvider.js';
import { MockRoutingProvider } from './MockRoutingProvider.js';
import { MockMapProvider } from './MockMapProvider.js';
import { ConsoleAnalyticsProvider } from '../analytics/ConsoleAnalyticsProvider.js';
import { seedVenues, seedInitialUserPosition } from '@javits/mock-data';

export interface MockRegistryConfig {
  venueId?: Id;
  initialPosition?: UserPosition;
  walkingSpeedMps?: number;
  /** Inject a scripted off-route deviation to exercise reroute UX. */
  scriptedDeviation?: { atProgress: number; offsetMeters: number };
  sessionId?: string;
  anonymousUserId?: string;
}

export function createMockRegistry(config: MockRegistryConfig = {}): ProviderRegistry {
  const venueId = config.venueId ?? seedVenues[0]!.id;
  const venue = seedVenues.find((v) => v.id === venueId) ?? seedVenues[0]!;
  const defaultBuilding = venue.buildings.find((b) => b.id === venue.defaultBuildingId) ?? venue.buildings[0]!;
  const defaultFloor = defaultBuilding.floors.find((f) => f.id === defaultBuilding.defaultFloorId) ?? defaultBuilding.floors[0]!;

  const initial: UserPosition = config.initialPosition ?? seedInitialUserPosition;

  const buildings = new MockBuildingProvider();
  const destinations = new MockDestinationProvider();
  const location = new MockLocationProvider({
    initial,
    walkingSpeedMps: config.walkingSpeedMps,
    ...(config.scriptedDeviation ? { scriptedDeviation: config.scriptedDeviation } : {}),
  });
  const routing = new MockRoutingProvider(location);
  const map = new MockMapProvider({
    center: { x: (defaultFloor.bounds.min.x + defaultFloor.bounds.max.x) / 2, y: (defaultFloor.bounds.min.y + defaultFloor.bounds.max.y) / 2 },
    zoom: 16,
    rotationDegrees: 0,
    pitchDegrees: 0,
    buildingId: defaultBuilding.id,
    floorId: defaultFloor.id,
  });
  const analytics = new ConsoleAnalyticsProvider({
    sessionId: config.sessionId ?? `sess_${Math.random().toString(36).slice(2, 10)}`,
    anonymousUserId: config.anonymousUserId ?? `anon_${Math.random().toString(36).slice(2, 10)}`,
  });

  return {
    kind: 'mock',
    buildings,
    destinations,
    location,
    routing,
    map,
    analytics,
  };
}
