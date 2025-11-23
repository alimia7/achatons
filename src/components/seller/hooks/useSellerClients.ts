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
      
      // Group participations by user_id or by unique identifier (name+phone+email)
      const clientMap = new Map<string, {
        user_id?: string;
        user_name?: string;
        user_phone?: string;
        user_email?: string;
        offers_count: number;
        total_spent: number;
        last_participation_date: string;
        participations: any[];
      }>();
      
      allParticipations.forEach(participation => {
        const data = participation;
        // Use user_id if available, otherwise create a unique key from name+phone+email
        const clientKey = data.user_id || `${data.user_name || ''}_${data.user_phone || ''}_${data.user_email || ''}`;
        
        if (!clientMap.has(clientKey)) {
          clientMap.set(clientKey, {
            user_id: data.user_id,
            user_name: data.user_name,
            user_phone: data.user_phone,
            user_email: data.user_email,
            offers_count: 0,
            total_spent: 0,
            last_participation_date: data.created_at || '',
            participations: [],
          });
        }
        
        const client = clientMap.get(clientKey)!;
        client.offers_count += 1;
        client.total_spent += (data.amount || (data.quantity || 0) * (data.group_price || 0));
        if (data.created_at > client.last_participation_date) {
          client.last_participation_date = data.created_at;
        }
        client.participations.push(data);
      });
      
      // Build clients list from participations data and profiles
      const clientsList: SellerClient[] = [];
      for (const [clientKey, clientData] of clientMap.entries()) {
        // If user_id exists, try to fetch profile
        if (clientData.user_id) {
          try {
            const profileDoc = await getDoc(doc(db, 'profiles', clientData.user_id));
            if (profileDoc.exists()) {
              const profile = profileDoc.data();
              clientsList.push({
                id: clientData.user_id,
                user_id: clientData.user_id,
                full_name: profile.full_name || clientData.user_name || 'Utilisateur',
                email: profile.email || clientData.user_email || '',
                phone: profile.phone || clientData.user_phone || '',
                offers_count: clientData.offers_count,
                total_spent: clientData.total_spent,
                status: 'active',
                last_participation_date: clientData.last_participation_date,
              });
            } else {
              // Profile doesn't exist, use participation data
              clientsList.push({
                id: clientKey,
                user_id: clientData.user_id,
                full_name: clientData.user_name || 'Utilisateur',
                email: clientData.user_email || '',
                phone: clientData.user_phone || '',
                offers_count: clientData.offers_count,
                total_spent: clientData.total_spent,
                status: 'active',
                last_participation_date: clientData.last_participation_date,
              });
            }
          } catch (e) {
            console.error('Error fetching profile for user:', clientData.user_id, e);
            // Fallback to participation data
            clientsList.push({
              id: clientKey,
              user_id: clientData.user_id,
              full_name: clientData.user_name || 'Utilisateur',
              email: clientData.user_email || '',
              phone: clientData.user_phone || '',
              offers_count: clientData.offers_count,
              total_spent: clientData.total_spent,
              status: 'active',
              last_participation_date: clientData.last_participation_date,
            });
          }
        } else {
          // No user_id, use participation data directly
          clientsList.push({
            id: clientKey,
            user_id: '',
            full_name: clientData.user_name || 'Utilisateur',
            email: clientData.user_email || '',
            phone: clientData.user_phone || '',
            offers_count: clientData.offers_count,
            total_spent: clientData.total_spent,
            status: 'active',
            last_participation_date: clientData.last_participation_date,
          });
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

