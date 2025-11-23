import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export interface SellerNotification {
  id: string;
  participation_id: string;
  offer_id: string;
  offer_name: string;
  offer_price: number;
  user_name: string;
  quantity: number;
  created_at: string;
  status: 'pending' | 'validated' | 'cancelled';
}

export const useSellerNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<SellerNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user?.uid) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Get all offers from this seller
      const offersQuery = query(
        collection(db, 'offers'),
        where('seller_id', '==', user.uid)
      );
      const offersSnap = await getDocs(offersQuery);
      const offerIds = offersSnap.docs.map(d => d.id);
      const offerMap = new Map<string, { name: string; price: number }>();
      offersSnap.docs.forEach(doc => {
        const data = doc.data();
        offerMap.set(doc.id, {
          name: data.product_name || 'Produit',
          price: data.group_price || 0,
        });
      });

      if (offerIds.length === 0) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      // Get all pending participations for these offers
      const allNotifications: SellerNotification[] = [];
      
      // Firestore 'in' query limit is 10, so we need to batch
      for (let i = 0; i < offerIds.length; i += 10) {
        const batch = offerIds.slice(i, i + 10);
        const participationsQuery = query(
          collection(db, 'participations'),
          where('offer_id', 'in', batch),
          where('status', '==', 'pending')
        );
        const participationsSnap = await getDocs(participationsQuery);
        
        participationsSnap.docs.forEach(doc => {
          const data = doc.data();
          const offerInfo = offerMap.get(data.offer_id) || { name: 'Produit', price: 0 };
          allNotifications.push({
            id: doc.id,
            participation_id: doc.id,
            offer_id: data.offer_id,
            offer_name: offerInfo.name,
            offer_price: offerInfo.price,
            user_name: data.user_name || 'Client',
            quantity: data.quantity || 0,
            created_at: data.created_at || new Date().toISOString(),
            status: data.status || 'pending',
          });
        });
      }

      // Sort by created_at descending (newest first)
      allNotifications.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });

      setNotifications(allNotifications);
      setUnreadCount(allNotifications.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.uid]);

  return {
    notifications,
    unreadCount,
    loading,
    refreshNotifications: fetchNotifications,
  };
};

