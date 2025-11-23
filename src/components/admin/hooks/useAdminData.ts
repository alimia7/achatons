
import { useEffect } from 'react';
import { useStats } from './useStats';

export const useAdminData = () => {
  const { stats, calculateStats } = useStats();

  useEffect(() => {
    calculateStats();
  }, []);

  return {
    stats,
    refreshStats: calculateStats,
  };
};
