import type {
  LocationStatus,
  PermissionStatus,
  Route,
  Unsubscribe,
  UserPosition,
} from '@javits/domain';
import type { LocationProvider } from '../interfaces/LocationProvider.js';

/**
 * MOCK — scripted path simulator.
 *
 * Two modes:
 *  1. Idle at a fixed "entrance" position (default).
 *  2. Following an active route: position interpolates along the route's
 *     summary polyline at a configurable walking speed. Optionally triggers
 *     a scripted off-route deviation for reroute testing.
 *
 * The production LocationProvider will be a React Native bridge to the Cisco
 * Spaces Wayfinding native SDK. This class is NEVER used in production.
 */
export interface MockLocationOptions {
  initial: UserPosition;
  walkingSpeedMps?: number;
  tickMs?: number;
  scriptedDeviation?: {
    atProgress: number; // 0..1 along route
    offsetMeters: number;
  };
}

export class MockLocationProvider implements LocationProvider {
  private status: LocationStatus = 'idle';
  private permission: PermissionStatus = 'undetermined';
  private current: UserPosition;
  private readonly listeners = new Set<(p: UserPosition) => void>();
  private readonly statusListeners = new Set<(s: LocationStatus) => void>();

  private readonly walkingSpeedMps: number;
  private readonly tickMs: number;
  private deviation: MockLocationOptions['scriptedDeviation'];

  private activeRoute: Route | null = null;
  private progress = 0; // 0..1
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(opts: MockLocationOptions) {
    this.current = opts.initial;
    this.walkingSpeedMps = opts.walkingSpeedMps ?? 1.2;
    this.tickMs = opts.tickMs ?? 200;
    if (opts.scriptedDeviation) {
      this.deviation = opts.scriptedDeviation;
    }
  }

  async start(): Promise<void> {
    this.permission = 'granted';
    this.setStatus('active');
  }

  async stop(): Promise<void> {
    this.stopFollowing();
    this.setStatus('idle');
  }

  async getCurrentPosition(): Promise<UserPosition | null> {
    return this.current;
  }

  subscribe(listener: (p: UserPosition) => void): Unsubscribe {
    this.listeners.add(listener);
    // Fire-and-forget current snapshot so consumers don't wait a tick.
    queueMicrotask(() => listener(this.current));
    return () => {
      this.listeners.delete(listener);
    };
  }

  subscribeStatus(listener: (s: LocationStatus) => void): Unsubscribe {
    this.statusListeners.add(listener);
    queueMicrotask(() => listener(this.status));
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  getStatus(): LocationStatus {
    return this.status;
  }

  async getPermissionStatus(): Promise<PermissionStatus> {
    return this.permission;
  }

  async requestPermission(): Promise<PermissionStatus> {
    // Mock always grants. Real impl will surface an OS dialog.
    this.permission = 'granted';
    return this.permission;
  }

  setMockPosition(pos: UserPosition): void {
    this.current = pos;
    this.emit();
  }

  /**
   * Prototype-only: begin advancing the user along the given route.
   * Called by the mock routing provider when a navigation session starts.
   */
  followRoute(route: Route): void {
    this.stopFollowing();
    this.activeRoute = route;
    this.progress = 0;
    this.timer = setInterval(() => this.tick(), this.tickMs);
  }

  stopFollowing(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.activeRoute = null;
    this.progress = 0;
  }

  /** Simulate a user tapping "I'm on Level N" to acknowledge a floor change. */
  confirmFloorTransition(toFloorId: string): void {
    this.current = { ...this.current, floorId: toFloorId };
    this.emit();
  }

  private tick(): void {
    if (!this.activeRoute) return;
    const dt = this.tickMs / 1000;
    const advance = this.walkingSpeedMps * dt;
    const total = Math.max(this.activeRoute.totalDistanceMeters, 1);
    this.progress = Math.min(1, this.progress + advance / total);

    const base = positionAtProgress(this.activeRoute, this.progress);
    let pos = base;

    if (this.deviation && this.progress >= this.deviation.atProgress && this.progress < this.deviation.atProgress + 0.08) {
      // Scripted off-route wobble, centered on the deviation window.
      const phase = (this.progress - this.deviation.atProgress) / 0.08;
      const wobble = Math.sin(phase * Math.PI) * this.deviation.offsetMeters;
      pos = { ...base, x: base.x + wobble, y: base.y };
    }

    this.current = {
      ...pos,
      accuracyMeters: 3,
      timestamp: Date.now(),
      source: 'mock',
    };
    this.emit();

    if (this.progress >= 1) {
      this.stopFollowing();
    }
  }

  private emit(): void {
    for (const l of this.listeners) l(this.current);
  }

  private setStatus(s: LocationStatus): void {
    if (this.status === s) return;
    this.status = s;
    for (const l of this.statusListeners) l(s);
  }
}

function positionAtProgress(route: Route, t: number): UserPosition {
  const line = route.summaryPolyline;
  if (line.length === 0) {
    return {
      buildingId: route.origin.buildingId,
      floorId: route.origin.floorId,
      x: route.origin.x,
      y: route.origin.y,
      accuracyMeters: 3,
      timestamp: Date.now(),
      source: 'mock',
    };
  }
  // Walk the polyline accumulating distance.
  const targetDist = route.totalDistanceMeters * t;
  let acc = 0;
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1]!;
    const b = line[i]!;
    // Floor changes are zero-length joiners in summary polyline.
    if (a.floorId !== b.floorId) {
      if (acc >= targetDist) {
        return toPos(a, route);
      }
      continue;
    }
    const seg = Math.hypot(b.x - a.x, b.y - a.y);
    if (acc + seg >= targetDist) {
      const remaining = targetDist - acc;
      const f = seg === 0 ? 0 : remaining / seg;
      return {
        buildingId: route.origin.buildingId,
        floorId: a.floorId,
        x: a.x + (b.x - a.x) * f,
        y: a.y + (b.y - a.y) * f,
        accuracyMeters: 3,
        timestamp: Date.now(),
        source: 'mock',
      };
    }
    acc += seg;
  }
  const last = line[line.length - 1]!;
  return toPos(last, route);
}

function toPos(
  p: { x: number; y: number; floorId: string },
  route: Route
): UserPosition {
  return {
    buildingId: route.origin.buildingId,
    floorId: p.floorId,
    x: p.x,
    y: p.y,
    accuracyMeters: 3,
    timestamp: Date.now(),
    source: 'mock',
  };
}
