import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export interface SellerClient {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  offers_count: number;
  total_spent: number;
  status: 'active' | 'inactive';
  last_participation_date: string;
}

export const useSellerClients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<SellerClient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      // First, get all offers from this seller
      const offersQuery = query(
        collection(db, 'offers'),
        where('seller_id', '==', user.uid)
      );
      const offersSnap = await getDocs(offersQuery);
      const offerIds = offersSnap.docs.map(d => d.id);
      
      if (offerIds.length === 0) {
        setClients([]);
        setLoading(false);
        return;
      }
      
      // Then, get all participations for these offers
      // Firestore 'in' query limit is 10, so we need to batch
      const allParticipations: any[] = [];
      for (let i = 0; i < offerIds.length; i += 10) {
        const batch = offerIds.slice(i, i + 10);
        const participationsQuery = query(
          collection(db, 'participations'),
          where('offer_id', 'in', batch)
        );
        const participationsSnap = await getDocs(participationsQuery);
        allParticipations.push(...participationsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
      
      // Group participations by user_id
      const clientMap = new Map<string, {
        user_id: string;
        offers_count: number;
        total_spent: number;
        last_participation_date: string;
        participations: any[];
      }>();
      
      allParticipations.forEach(participation => {
        const data = participation;
        const userId = data.user_id;
        
        if (!clientMap.has(userId)) {
          clientMap.set(userId, {
            user_id: userId,
            offers_count: 0,
            total_spent: 0,
            last_participation_date: data.created_at || '',
            participations: [],
          });
        }
        
        const client = clientMap.get(userId)!;
        client.offers_count += 1;
        client.total_spent += data.amount || 0;
        if (data.created_at > client.last_participation_date) {
          client.last_participation_date = data.created_at;
        }
        client.participations.push(data);
      });
      
      // Fetch user profiles for each client
      const clientsList: SellerClient[] = [];
      for (const [userId, clientData] of clientMap.entries()) {
        try {
          const profileDoc = await getDoc(doc(db, 'profiles', userId));
          if (profileDoc.exists()) {
            const profile = profileDoc.data();
            clientsList.push({
              id: userId,
              user_id: userId,
              full_name: profile.full_name || 'Utilisateur',
              email: profile.email || '',
              phone: profile.phone || '',
              offers_count: clientData.offers_count,
              total_spent: clientData.total_spent,
              status: 'active',
              last_participation_date: clientData.last_participation_date,
            });
          }
        } catch (e) {
          console.error('Error fetching profile for user:', userId, e);
        }
      }
      
      setClients(clientsList.sort((a, b) => 
        new Date(b.last_participation_date).getTime() - new Date(a.last_participation_date).getTime()
      ));
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user?.uid]);

  return {
    clients,
    loading,
    fetchClients,
  };
};

