import type {
  FloorplanAsset,
  Id,
  MapMarker,
  MapViewport,
  Route,
  Unsubscribe,
  UserPosition,
} from '@javits/domain';

/**
 * Map rendering, viewport, markers, and user-dot orchestration.
 *
 * Production integration seam: Cisco's native map renderer OR
 * MapLibre/Mapbox configured with Cisco-provided floor geometry — to be
 * validated against current Cisco documentation. See
 * `docs/05-adapter-integration.md`.
 *
 * Prototype: renderer is a simple SVG/Canvas component; this interface wraps
 * imperative viewport operations it supports.
 */
export interface MapProvider {
  getFloorplanAsset(floorId: Id): Promise<FloorplanAsset>;

  getViewport(): MapViewport;
  setViewport(vp: Partial<MapViewport>): void;
  subscribeViewport(listener: (vp: MapViewport) => void): Unsubscribe;

  /** Fit camera to show the full route; may switch floor to origin floor. */
  fitRoute(route: Route): void;

  setFloor(floorId: Id): void;

  addMarker(marker: MapMarker): Id;
  updateMarker(id: Id, patch: Partial<MapMarker>): void;
  removeMarker(id: Id): void;
  clearMarkers(): void;

  /** Drives the blue dot. Pass `null` to hide. */
  setUserPosition(pos: UserPosition | null): void;
}
