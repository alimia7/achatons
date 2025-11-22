
import { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
      const [offersSnap, partsSnap] = await Promise.all([
        getDocs(collection(db, 'offers')),
        getDocs(collection(db, 'participations')),
      ]);
      const offersData = offersSnap.docs.map(d => d.data() as any);
      const participationsData = partsSnap.docs.map(d => d.data() as any);

      const totalOffers = offersData.length;
      const activeOffers = offersData.filter(offer => offer.status === 'active').length;
      const totalParticipations = participationsData.length;
      const pendingParticipations = participationsData.filter((p: any) => p.status === 'pending').length;
      const totalRevenue = participationsData.reduce((sum: number, p: any) => sum + ((p.quantity || 0) * 1000), 0);

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
