import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface SellerRequest {
  id: string;
  user_id: string;
  user_email: string;
  company_name: string;
  responsible_name: string;
  phone: string;
  email: string;
  address: string;
  activity_category: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export const useSellerRequests = () => {
  const [requests, setRequests] = useState<SellerRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      let snap;
      try {
        const q = query(
          collection(db, 'seller_requests'),
          orderBy('created_at', 'desc')
        );
        snap = await getDocs(q);
      } catch (error: any) {
        console.warn('Index missing, fetching without orderBy:', error);
        const q = query(collection(db, 'seller_requests'));
        snap = await getDocs(q);
      }

      const list: SellerRequest[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<SellerRequest, 'id'>),
      }));

      // Sort by created_at descending (client-side if needed)
      list.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });

      setRequests(list);
    } catch (error) {
      console.error('Error fetching seller requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'seller_requests', requestId), {
        status,
        updated_at: new Date().toISOString(),
      });
      await fetchRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    fetchRequests,
    updateRequestStatus,
  };
};




