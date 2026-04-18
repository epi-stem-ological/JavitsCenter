import type { ProviderRegistry } from '../registry.js';

/**
 * Production registry stub.
 *
 * Every implementation here will be backed by either:
 *  - the Cisco Spaces Wayfinding native SDK (via RN bridge), OR
 *  - an internal CMS / search service for static data, OR
 *  - a server-side route planner operating on the Cisco-sourced venue graph.
 *
 * Until that work is done, every method throws. This is intentional —
 * it keeps the integration boundary discrete and testable, and prevents
 * accidental "works in dev, silently no-ops in prod" shipping.
 *
 * See `docs/05-adapter-integration.md` for the integration checklist.
 */
export interface ProductionConfig {
  venueId: string;
  apiBaseUrl: string;
  /** Placeholder — real config will include auth + SDK tier selection. */
  featureFlags?: Record<string, boolean>;
}

export function createProductionRegistry(_config: ProductionConfig): ProviderRegistry {
  const notImplemented = (name: string): never => {
    throw new Error(
      `[production] ${name} is not yet implemented. ` +
        `Wire the real provider before swapping registries. ` +
        `See docs/05-adapter-integration.md.`
    );
  };

  const stubLocation = {
    start: async () => notImplemented('LocationProvider.start'),
    stop: async () => notImplemented('LocationProvider.stop'),
    getCurrentPosition: async () => notImplemented('LocationProvider.getCurrentPosition'),
    subscribe: () => notImplemented('LocationProvider.subscribe'),
    subscribeStatus: () => notImplemented('LocationProvider.subscribeStatus'),
    getStatus: () => notImplemented('LocationProvider.getStatus'),
    getPermissionStatus: async () => notImplemented('LocationProvider.getPermissionStatus'),
    requestPermission: async () => notImplemented('LocationProvider.requestPermission'),
  };

  const stubRouting = {
    planRoute: async () => notImplemented('RoutingProvider.planRoute'),
    startNavigation: async () => notImplemented('RoutingProvider.startNavigation'),
    getSession: async () => notImplemented('RoutingProvider.getSession'),
    subscribeToSession: () => notImplemented('RoutingProvider.subscribeToSession'),
    reroute: async () => notImplemented('RoutingProvider.reroute'),
    cancelNavigation: async () => notImplemented('RoutingProvider.cancelNavigation'),
  };

  const stubBuildings = {
    listVenues: async () => notImplemented('BuildingProvider.listVenues'),
    getVenue: async () => notImplemented('BuildingProvider.getVenue'),
    getBuilding: async () => notImplemented('BuildingProvider.getBuilding'),
    getFloor: async () => notImplemented('BuildingProvider.getFloor'),
    listFloors: async () => notImplemented('BuildingProvider.listFloors'),
  };

  const stubDestinations = {
    listDestinations: async () => notImplemented('DestinationProvider.listDestinations'),
    getDestination: async () => notImplemented('DestinationProvider.getDestination'),
    listByCategory: async () => notImplemented('DestinationProvider.listByCategory'),
    listFeatured: async () => notImplemented('DestinationProvider.listFeatured'),
    search: async () => notImplemented('DestinationProvider.search'),
  };

  const stubMap = {
    getFloorplanAsset: async () => notImplemented('MapProvider.getFloorplanAsset'),
    getViewport: () => notImplemented('MapProvider.getViewport'),
    setViewport: () => notImplemented('MapProvider.setViewport'),
    subscribeViewport: () => notImplemented('MapProvider.subscribeViewport'),
    fitRoute: () => notImplemented('MapProvider.fitRoute'),
    setFloor: () => notImplemented('MapProvider.setFloor'),
    addMarker: () => notImplemented('MapProvider.addMarker'),
    updateMarker: () => notImplemented('MapProvider.updateMarker'),
    removeMarker: () => notImplemented('MapProvider.removeMarker'),
    clearMarkers: () => notImplemented('MapProvider.clearMarkers'),
    setUserPosition: () => notImplemented('MapProvider.setUserPosition'),
  };

  const stubAnalytics = {
    track: () => notImplemented('AnalyticsProvider.track'),
    flush: async () => notImplemented('AnalyticsProvider.flush'),
  };

  return {
    kind: 'production',
    buildings: stubBuildings as any,
    destinations: stubDestinations as any,
    location: stubLocation as any,
    routing: stubRouting as any,
    map: stubMap as any,
    analytics: stubAnalytics as any,
  };
}
