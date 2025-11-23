import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface AdminNotification {
  id: string;
  type: 'seller_request';
  seller_request_id?: string;
  seller_request?: any;
  created_at: string;
  read: boolean;
}

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to seller requests with pending status
    let unsubscribe: (() => void) | null = null;

    const setupListener = async () => {
      try {
        const q = query(
          collection(db, 'seller_requests'),
          where('status', '==', 'pending')
        );
        
        unsubscribe = onSnapshot(q, (snapshot) => {
          const requests = snapshot.docs.map(doc => ({
            id: doc.id,
            type: 'seller_request' as const,
            seller_request_id: doc.id,
            seller_request: doc.data(),
            created_at: doc.data().created_at || new Date().toISOString(),
            read: false,
          }));

          setNotifications(requests);
          setUnreadCount(requests.length);
          setLoading(false);
        }, (error) => {
          console.error('Error listening to seller requests:', error);
          // Fallback: fetch without orderBy
          fetchRequestsWithoutOrderBy();
        });
      } catch (error: any) {
        console.warn('Error setting up listener, fetching without orderBy:', error);
        fetchRequestsWithoutOrderBy();
      }
    };

    const fetchRequestsWithoutOrderBy = async () => {
      try {
        const q = query(
          collection(db, 'seller_requests'),
          where('status', '==', 'pending')
        );
        const snap = await getDocs(q);
        
        const requests = snap.docs.map(doc => ({
          id: doc.id,
          type: 'seller_request' as const,
          seller_request_id: doc.id,
          seller_request: doc.data(),
          created_at: doc.data().created_at || new Date().toISOString(),
          read: false,
        }));

        requests.sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateB - dateA;
        });

        setNotifications(requests);
        setUnreadCount(requests.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching seller requests:', error);
        setLoading(false);
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
  };
};

