import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import type { GapAnalysis, StreakAnalysis, RepeatAnalysis, QuadTripleWatch, GameStats } from '@shared/schema';

type GameType = 'pick3' | 'pick4';

interface LotteryStore {
  gameType: GameType;
  setGameType: (gameType: GameType) => void;
}

const useLotteryStore = create<LotteryStore>((set) => ({
  gameType: 'pick4',
  setGameType: (gameType) => set({ gameType }),
}));

export function useLotteryData() {
  const { gameType, setGameType } = useLotteryStore();

  const gapsQuery = useQuery<GapAnalysis[]>({
    queryKey: ['/api/gaps', gameType],
    enabled: !!gameType,
  });

  const streaksQuery = useQuery<StreakAnalysis[]>({
    queryKey: ['/api/streaks', gameType],
    enabled: !!gameType,
  });

  const repeatsQuery = useQuery<RepeatAnalysis[]>({
    queryKey: ['/api/repeats', gameType],
    enabled: !!gameType,
  });

  const watchQuery = useQuery<QuadTripleWatch[]>({
    queryKey: ['/api/watch', gameType],
    enabled: !!gameType,
  });

  const statsQuery = useQuery<GameStats>({
    queryKey: ['/api/stats', gameType],
    enabled: !!gameType,
  });

  const searchNumbers = async (query: string) => {
    if (!query.trim()) return { gaps: [], streaks: [], repeats: [] };
    
    const response = await fetch(`/api/search/${gameType}?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Search failed');
    }
    return response.json();
  };

  return {
    gameType,
    setGameType,
    gaps: gapsQuery.data || [],
    streaks: streaksQuery.data || [],
    repeats: repeatsQuery.data || [],
    watchNumbers: watchQuery.data || [],
    stats: statsQuery.data,
    isLoading: gapsQuery.isLoading || streaksQuery.isLoading || repeatsQuery.isLoading || watchQuery.isLoading || statsQuery.isLoading,
    searchNumbers,
  };
}
