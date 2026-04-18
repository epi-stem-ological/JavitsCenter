import { useEffect, useState } from 'react';
import type { UserPosition } from '@javits/domain';
import { useProviders } from '../providers/ProvidersContext';

export function useUserPosition(): UserPosition | null {
  const { location } = useProviders();
  const [pos, setPos] = useState<UserPosition | null>(null);
  useEffect(() => {
    const unsub = location.subscribe(setPos);
    return () => unsub();
  }, [location]);
  return pos;
}
