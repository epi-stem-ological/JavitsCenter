import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { createMockRegistry, type ProviderRegistry } from '@javits/providers';

const Ctx = createContext<ProviderRegistry | null>(null);

/**
 * Wires the mock provider registry into the React tree.
 *
 * MOCK-ONLY. To integrate real Cisco providers, swap `createMockRegistry()`
 * with `createProductionRegistry(config)` at build time behind a feature
 * flag. Never mix mock and production providers in the same session.
 */
export function ProvidersProvider({ children }: { children: React.ReactNode }) {
  const registry = useMemo(() => createMockRegistry(), []);

  useEffect(() => {
    registry.analytics.track({ name: 'app_opened', properties: { source: 'cold' } });
    registry.location.start().catch(() => {});
    return () => {
      registry.location.stop().catch(() => {});
    };
  }, [registry]);

  return <Ctx.Provider value={registry}>{children}</Ctx.Provider>;
}

export function useProviders(): ProviderRegistry {
  const v = useContext(Ctx);
  if (!v) throw new Error('useProviders must be used inside <ProvidersProvider>');
  return v;
}
