import type { BuildingProvider } from './interfaces/BuildingProvider.js';
import type { DestinationProvider } from './interfaces/DestinationProvider.js';
import type { LocationProvider } from './interfaces/LocationProvider.js';
import type { RoutingProvider } from './interfaces/RoutingProvider.js';
import type { MapProvider } from './interfaces/MapProvider.js';
import type { AnalyticsProvider } from './interfaces/AnalyticsProvider.js';

/**
 * The single object screens consume. Apps pick exactly one registry
 * (mock or production) at bootstrap — never mix.
 */
export interface ProviderRegistry {
  readonly kind: 'mock' | 'production';
  readonly buildings: BuildingProvider;
  readonly destinations: DestinationProvider;
  readonly location: LocationProvider;
  readonly routing: RoutingProvider;
  readonly map: MapProvider;
  readonly analytics: AnalyticsProvider;
}
