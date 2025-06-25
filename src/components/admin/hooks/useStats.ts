
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  totalOffers: number;
  activeOffers: number;
  totalParticipations: number;
  pendingParticipations: number;
  totalRevenue: number;
}

export const useStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalOffers: 0,
    activeOffers: 0,
    totalParticipations: 0,
    pendingParticipations: 0,
    totalRevenue: 0,
  });

  const calculateStats = async () => {
    try {
      console.log('Calculating stats...');
      const { data: offersData } = await supabase
        .from('offers')
        .select('*');

      const { data: participationsData } = await supabase
        .from('participations')
        .select('quantity, status');

      const totalOffers = offersData?.length || 0;
      const activeOffers = offersData?.filter(offer => offer.status === 'active').length || 0;
      const totalParticipations = participationsData?.length || 0;
      const pendingParticipations = participationsData?.filter(p => p.status === 'pending').length || 0;
      const totalRevenue = participationsData?.reduce((sum, p) => sum + (p.quantity * 1000), 0) || 0;

      console.log('Stats calculated:', { totalOffers, activeOffers, totalParticipations, pendingParticipations });

      setStats({
        totalOffers,
        activeOffers,
        totalParticipations,
        pendingParticipations,
        totalRevenue,
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  return {
    stats,
    calculateStats,
  };
};
