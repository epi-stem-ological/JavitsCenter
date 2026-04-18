import type {
  FloorplanAsset,
  Id,
  MapMarker,
  MapViewport,
  Route,
  Unsubscribe,
  UserPosition,
} from '@javits/domain';
import type { MapProvider } from '../interfaces/MapProvider.js';
import { seedFloorplanAssets } from '@javits/mock-data';

/**
 * MOCK — an in-memory map state holder. The actual map rendering happens in
 * the app layer (a React component reads viewport/markers via this provider).
 * Production: a thin wrapper over Cisco's native map renderer OR
 * MapLibre/Mapbox. This class is never used in production.
 */
export class MockMapProvider implements MapProvider {
  private viewport: MapViewport;
  private readonly viewportListeners = new Set<(v: MapViewport) => void>();
  private readonly markers = new Map<Id, MapMarker>();
  private userPos: UserPosition | null = null;
  private readonly userListeners = new Set<(p: UserPosition | null) => void>();

  constructor(initial: MapViewport) {
    this.viewport = initial;
  }

  async getFloorplanAsset(floorId: Id): Promise<FloorplanAsset> {
    const asset = seedFloorplanAssets.find((a) => a.floorId === floorId);
    if (!asset) throw new Error(`No floorplan for floor ${floorId}`);
    return asset;
  }

  getViewport(): MapViewport {
    return this.viewport;
  }

  setViewport(vp: Partial<MapViewport>): void {
    this.viewport = { ...this.viewport, ...vp };
    for (const l of this.viewportListeners) l(this.viewport);
  }

  subscribeViewport(listener: (v: MapViewport) => void): Unsubscribe {
    this.viewportListeners.add(listener);
    queueMicrotask(() => listener(this.viewport));
    return () => {
      this.viewportListeners.delete(listener);
    };
  }

  fitRoute(route: Route): void {
    if (route.summaryPolyline.length === 0) return;
    const first = route.summaryPolyline[0]!;
    this.setFloor(first.floorId);
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const p of route.summaryPolyline) {
      if (p.floorId !== first.floorId) continue;
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }
    if (minX === Infinity) return;
    this.setViewport({
      center: { x: (minX + maxX) / 2, y: (minY + maxY) / 2 },
      zoom: zoomForExtent(maxX - minX, maxY - minY),
      rotationDegrees: 0,
    });
  }

  setFloor(floorId: Id): void {
    if (this.viewport.floorId === floorId) return;
    this.setViewport({ floorId });
  }

  addMarker(marker: MapMarker): Id {
    this.markers.set(marker.id, marker);
    return marker.id;
  }

  updateMarker(id: Id, patch: Partial<MapMarker>): void {
    const m = this.markers.get(id);
    if (!m) return;
    this.markers.set(id, { ...m, ...patch });
  }

  removeMarker(id: Id): void {
    this.markers.delete(id);
  }

  clearMarkers(): void {
    this.markers.clear();
  }

  setUserPosition(pos: UserPosition | null): void {
    this.userPos = pos;
    for (const l of this.userListeners) l(pos);
  }

  // ---------- prototype-only helpers consumed by the map component ----------

  getMarkers(): MapMarker[] {
    return Array.from(this.markers.values());
  }

  getUserPosition(): UserPosition | null {
    return this.userPos;
  }

  subscribeUserPosition(listener: (p: UserPosition | null) => void): Unsubscribe {
    this.userListeners.add(listener);
    queueMicrotask(() => listener(this.userPos));
    return () => {
      this.userListeners.delete(listener);
    };
  }
}

function zoomForExtent(w: number, h: number): number {
  const max = Math.max(w, h, 10);
  // Rough heuristic mapping meters-extent to a 0..22 zoom-like scale.
  return Math.max(0, 22 - Math.log2(max));
}
