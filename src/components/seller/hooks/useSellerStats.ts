import { useState, useEffect, useCallback } from 'react';
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

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  label: string;
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

      // Fetch participations and calculate revenue
      const offerIds = offersSnap.docs.map(d => d.id);
      const offerMap = new Map<string, any>();
      offersSnap.docs.forEach(doc => {
        offerMap.set(doc.id, doc.data());
      });
      
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
          let filteredParticipations = period
            ? participations.filter(p => new Date(p.created_at) >= startDate)
            : participations;
          
          // Only count validated participations for revenue
          const validatedParticipations = filteredParticipations.filter(p => p.status === 'validated');
          
          totalParticipants += filteredParticipations.length;
          
          // Calculate revenue: use amount if available, otherwise quantity * group_price
          validatedParticipations.forEach(p => {
            const offer = offerMap.get(p.offer_id);
            const groupPrice = offer?.group_price || 0;
            const quantity = p.quantity || 0;
            
            // Use amount if available, otherwise calculate from quantity * group_price
            if (p.amount) {
              totalRevenue += p.amount;
            } else {
              totalRevenue += quantity * groupPrice;
            }
          });
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

  const getHistoricalRevenue = useCallback(async (period: 'day' | 'week' | 'month' | 'year'): Promise<RevenueDataPoint[]> => {
    if (!user?.uid) return [];

    try {
      // Get all offers from this seller
      const offersQuery = query(
        collection(db, 'offers'),
        where('seller_id', '==', user.uid)
      );
      const offersSnap = await getDocs(offersQuery);
      const offerIds = offersSnap.docs.map(d => d.id);
      const offerMap = new Map<string, any>();
      offersSnap.docs.forEach(doc => {
        offerMap.set(doc.id, doc.data());
      });

      if (offerIds.length === 0) return [];

      // Get all validated participations
      const allParticipations: any[] = [];
      for (let i = 0; i < offerIds.length; i += 10) {
        const batch = offerIds.slice(i, i + 10);
        const participationsQuery = query(
          collection(db, 'participations'),
          where('offer_id', 'in', batch)
        );
        const participationsSnap = await getDocs(participationsQuery);
        const participations = participationsSnap.docs.map(d => d.data());
        allParticipations.push(...participations.filter(p => p.status === 'validated'));
      }

      // Group by period
      const revenueMap = new Map<string, number>();

      allParticipations.forEach(p => {
        const dateStr = p.created_at || p.updated_at;
        if (!dateStr) return; // Skip if no date
        
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return; // Skip if invalid date
        
        let key = '';
        let label = '';

        switch (period) {
          case 'day':
            key = date.toISOString().split('T')[0];
            label = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
            break;
          case 'week':
            const weekStart = new Date(date);
            const dayOfWeek = date.getDay();
            const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Monday as first day
            weekStart.setDate(diff);
            weekStart.setHours(0, 0, 0, 0);
            key = weekStart.toISOString().split('T')[0]; // Use Monday's date as key
            label = `Sem. ${weekStart.getDate()}/${weekStart.getMonth() + 1}`;
            break;
          case 'month':
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            label = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
            break;
          case 'year':
            key = String(date.getFullYear());
            label = String(date.getFullYear());
            break;
        }

        if (!revenueMap.has(key)) {
          revenueMap.set(key, 0);
        }

        const offer = offerMap.get(p.offer_id);
        const groupPrice = offer?.group_price || 0;
        const quantity = p.quantity || 0;
        const revenue = p.amount || (quantity * groupPrice);
        
        revenueMap.set(key, revenueMap.get(key)! + revenue);
      });

      // Convert to array and sort by date
      const dataPoints: RevenueDataPoint[] = Array.from(revenueMap.entries())
        .map(([key, revenue]) => {
          let label = '';
          let sortKey = key;
          
          // Generate label and sort key based on period
          switch (period) {
            case 'day':
              const dayDate = new Date(key);
              label = dayDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
              sortKey = key; // Already ISO date format
              break;
            case 'week':
              const weekDate = new Date(key);
              label = `Sem. ${weekDate.getDate()}/${weekDate.getMonth() + 1}`;
              sortKey = key; // Already ISO date format
              break;
            case 'month':
              // Key format: YYYY-MM
              const [year, month] = key.split('-');
              const monthDate = new Date(parseInt(year), parseInt(month) - 1, 1);
              label = monthDate.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
              sortKey = key; // Already sortable format
              break;
            case 'year':
              label = key; // Already year as string
              sortKey = key; // Already sortable format
              break;
          }

          return {
            date: key,
            revenue,
            label,
          };
        })
        .sort((a, b) => a.date.localeCompare(b.date));

      return dataPoints;
    } catch (error) {
      console.error('Error fetching historical revenue:', error);
      return [];
    }
  }, [user?.uid]);

  return {
    stats,
    loading,
    calculateStats,
    getHistoricalRevenue,
  };
};

