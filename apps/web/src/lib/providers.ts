import 'server-only';
import { createMockRegistry, type ProviderRegistry } from '@javits/providers';

/**
 * Server-side provider registry for the web app. Mock-only.
 * Never mix mock and production providers in the same session.
 *
 * Note: LocationProvider and RoutingProvider are available in this registry
 * but the web UI does NOT expose a live blue dot — browsers can't reliably
 * do indoor positioning. The web app only uses building + destination data.
 */
let cached: ProviderRegistry | null = null;

export function getProviders(): ProviderRegistry {
  if (!cached) cached = createMockRegistry();
  return cached;
}
