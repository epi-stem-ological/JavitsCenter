import type { Id } from './common.js';

/**
 * Discriminated union of wayfinding analytics events.
 * This shape is the contract; the transport (console, Segment, warehouse)
 * is a separate concern in `packages/providers/src/analytics/`.
 */
export type WayfindingEvent =
  | { name: 'app_opened'; properties: { source: 'cold' | 'warm' | 'deep_link'; deepLinkPath?: string } }
  | { name: 'search_query'; properties: { query: string; resultCount: number; venueId: Id } }
  | { name: 'destination_viewed'; properties: { destinationId: Id; source: string } }
  | { name: 'route_previewed'; properties: { destinationId: Id; distanceMeters: number; durationSec: number; floorChanges: number } }
  | { name: 'navigation_started'; properties: { sessionId: Id; destinationId: Id } }
  | { name: 'navigation_step_advanced'; properties: { sessionId: Id; stepIndex: number } }
  | { name: 'navigation_rerouted'; properties: { sessionId: Id; reason: string } }
  | { name: 'navigation_arrived'; properties: { sessionId: Id; destinationId: Id; durationSec: number } }
  | { name: 'navigation_cancelled'; properties: { sessionId: Id; stepIndex: number } }
  | { name: 'permission_requested'; properties: { permission: 'location' | 'bluetooth'; result: string } }
  | { name: 'deep_link_opened'; properties: { path: string; resolvedDestinationId?: Id } };

export interface AnalyticsEnvelope<E extends WayfindingEvent = WayfindingEvent> {
  event: E;
  timestamp: number;
  sessionId: Id;
  anonymousUserId: Id;
}
