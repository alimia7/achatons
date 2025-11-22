import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export interface SellerStats {
  totalProducts: number;
  activeProducts: number;
  totalOffers: number;
  activeOffers: number;
  totalParticipants: number;
  totalRevenue: number;
  conversionRate: number;
}

export const useSellerStats = (period?: 'day' | 'week' | 'month' | 'year') => {
  const { user } = useAuth();
  const [stats, setStats] = useState<SellerStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalOffers: 0,
    activeOffers: 0,
    totalParticipants: 0,
    totalRevenue: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  const calculateStats = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      // Get date filter
      const now = new Date();
      let startDate = new Date(0); // Beginning of time
      
      if (period) {
        switch (period) {
          case 'day':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
        }
      }

      // Fetch products
      const productsQuery = query(
        collection(db, 'products'),
        where('seller_id', '==', user.uid)
      );
      const productsSnap = await getDocs(productsQuery);
      const products = productsSnap.docs.map(d => d.data());
      const totalProducts = products.length;
      const activeProducts = products.filter(p => p.status === 'active').length;

      // Fetch offers
      const offersQuery = query(
        collection(db, 'offers'),
        where('seller_id', '==', user.uid)
      );
      const offersSnap = await getDocs(offersQuery);
      const offers = offersSnap.docs.map(d => d.data());
      const totalOffers = offers.length;
      const activeOffers = offers.filter(o => o.status === 'active').length;
      const completedOffers = offers.filter(o => o.status === 'completed').length;
      const conversionRate = totalOffers > 0 ? (completedOffers / totalOffers) * 100 : 0;

      // Fetch participations
      const offerIds = offersSnap.docs.map(d => d.id);
      let totalParticipants = 0;
      let totalRevenue = 0;

      if (offerIds.length > 0) {
        // Firestore 'in' query limit is 10, so we need to batch
        for (let i = 0; i < offerIds.length; i += 10) {
          const batch = offerIds.slice(i, i + 10);
          const participationsQuery = query(
            collection(db, 'participations'),
            where('offer_id', 'in', batch)
          );
          const participationsSnap = await getDocs(participationsQuery);
          const participations = participationsSnap.docs.map(d => d.data());
          
          // Filter by period if specified
          const filteredParticipations = period
            ? participations.filter(p => new Date(p.created_at) >= startDate)
            : participations;
          
          totalParticipants += filteredParticipations.length;
          totalRevenue += filteredParticipations.reduce((sum, p) => sum + (p.amount || 0), 0);
        }
      }

      setStats({
        totalProducts,
        activeProducts,
        totalOffers,
        activeOffers,
        totalParticipants,
        totalRevenue,
        conversionRate,
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateStats();
  }, [user?.uid, period]);

  return {
    stats,
    loading,
    calculateStats,
  };
};

