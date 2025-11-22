import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface OfferParticipation {
  id: string;
  offer_id: string;
  user_id?: string;
  user_name: string;
  user_phone: string;
  user_email?: string;
  user_address?: string;
  quantity: number;
  status: 'pending' | 'validated' | 'cancelled';
  payment_status?: 'pending' | 'paid' | 'refunded';
  amount?: number;
  created_at: string;
  updated_at?: string;
}

export const useOfferParticipations = (offerId: string | null) => {
  const [participations, setParticipations] = useState<OfferParticipation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParticipations = async () => {
    if (!offerId) {
      setParticipations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // First try with orderBy, if it fails (missing index), fetch without orderBy
      let snap;
      try {
        const q = query(
          collection(db, 'participations'),
          where('offer_id', '==', offerId),
          orderBy('created_at', 'desc')
        );
        snap = await getDocs(q);
      } catch (error: any) {
        // If index error, fetch without orderBy and sort client-side
        console.warn('Index missing, fetching without orderBy:', error);
        const q = query(
          collection(db, 'participations'),
          where('offer_id', '==', offerId)
        );
        snap = await getDocs(q);
      }
      
      const list: OfferParticipation[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<OfferParticipation, 'id'>),
      }));
      
      // Sort by created_at descending (client-side if needed)
      list.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });
      
      setParticipations(list);
    } catch (error) {
      console.error('Error fetching participations:', error);
      setParticipations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipations();
  }, [offerId]);

  return {
    participations,
    loading,
    fetchParticipations,
  };
};

