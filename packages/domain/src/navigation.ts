import type { Id } from './common.js';
import type { Route } from './route.js';

export type NavigationState =
  | 'idle'
  | 'previewing'
  | 'navigating'
  | 'rerouting'
  | 'paused'
  | 'off_route'
  | 'arrived'
  | 'cancelled';

export interface NavigationSession {
  id: Id;
  route: Route;
  state: NavigationState;
  currentStepIndex: number;
  startedAt: number;
  lastUpdatedAt: number;
  remainingDistanceMeters: number;
  remainingDurationSec: number;
  offRoute: boolean;
  rerouteCount: number;
  /**
   * MOCKED: advanced deterministically by the mock routing provider.
   * Production: derived from live position stream.
   */
  progressAlongRoute: number;
}
