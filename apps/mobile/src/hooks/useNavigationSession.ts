import { useEffect, useState } from 'react';
import type { NavigationSession } from '@javits/domain';
import { useProviders } from '../providers/ProvidersContext';

export function useNavigationSession(sessionId: string | null): NavigationSession | null {
  const { routing } = useProviders();
  const [session, setSession] = useState<NavigationSession | null>(null);
  useEffect(() => {
    if (!sessionId) {
      setSession(null);
      return;
    }
    let cancelled = false;
    routing.getSession(sessionId).then((s) => {
      if (!cancelled) setSession(s);
    });
    const unsub = routing.subscribeToSession(sessionId, setSession);
    return () => {
      cancelled = true;
      unsub();
    };
  }, [routing, sessionId]);
  return session;
}
