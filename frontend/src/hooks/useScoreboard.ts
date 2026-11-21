import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { RatedCharacter, Stats } from '../lib/types';

export function useScoreboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [ranking, setRanking] = useState<RatedCharacter[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [newStats, newRanking] = await Promise.all([api.getStats(), api.getRanking(10)]);
      setStats(newStats);
      setRanking(newRanking);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { stats, ranking, error, refresh };
}
