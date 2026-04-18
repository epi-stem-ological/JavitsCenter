import type {
  Id,
  NavigationSession,
  Route,
  RouteRequest,
  Unsubscribe,
} from '@javits/domain';

/**
 * Route planning and navigation session lifecycle.
 *
 * Production integration seam: **Cisco Spaces Wayfinding routing engine**,
 * either directly via native SDK or via a server-side route planner that
 * operates on the same venue graph. See `docs/05-adapter-integration.md`.
 *
 * Prototype: A* over a seed venue graph.
 */
export interface RoutingProvider {
  planRoute(request: RouteRequest): Promise<Route>;

  /** Optional: return up to N alternative routes. */
  alternatives?(request: RouteRequest, n: number): Promise<Route[]>;

  /** Begin a navigation session for an already-planned route. */
  startNavigation(route: Route): Promise<NavigationSession>;

  getSession(id: Id): Promise<NavigationSession | null>;

  /** Subscribe to session updates (progress, state changes). */
  subscribeToSession(id: Id, listener: (s: NavigationSession) => void): Unsubscribe;

  /**
   * Request a fresh route from the session's current position.
   * Returns the new route; also updates the session.
   */
  reroute(sessionId: Id): Promise<Route>;

  cancelNavigation(sessionId: Id): Promise<void>;
}
