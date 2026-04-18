import type {
  LocationStatus,
  PermissionStatus,
  Unsubscribe,
  UserPosition,
} from '@javits/domain';

/**
 * Live indoor user position.
 *
 * Production integration seam: **Cisco Spaces Wayfinding native SDK** (iOS +
 * Android). A React Native bridge will wrap the native SDK and emit
 * `UserPosition` events. See `docs/05-adapter-integration.md`.
 *
 * Prototype: scripted path simulator advancing along the active route.
 */
export interface LocationProvider {
  /** Begin streaming positions. Safe to call multiple times. */
  start(): Promise<void>;
  /** Stop streaming. Providers must release hardware in prod impl. */
  stop(): Promise<void>;

  /** Latest known position, or null if none yet. */
  getCurrentPosition(): Promise<UserPosition | null>;

  /** Subscribe to position updates. Returns an unsubscribe function. */
  subscribe(listener: (pos: UserPosition) => void): Unsubscribe;

  /** Subscribe to status changes (e.g. degraded, unavailable). */
  subscribeStatus(listener: (s: LocationStatus) => void): Unsubscribe;

  getStatus(): LocationStatus;
  getPermissionStatus(): Promise<PermissionStatus>;
  requestPermission(): Promise<PermissionStatus>;

  /**
   * Prototype-only convenience: force a position, e.g. to simulate entering
   * from a given entrance. Production impls may throw.
   */
  setMockPosition?(pos: UserPosition): void;
}
