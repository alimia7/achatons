import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, orderBy, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export interface SellerDelivery {
  id: string;
  offer_id: string;
  offer_name?: string;
  packages_count: number;
  scheduled_date: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  carrier?: string;
  tracking_code?: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
}

export const useSellerDeliveries = () => {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<SellerDelivery[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      const q = query(
        collection(db, 'deliveries'),
        where('seller_id', '==', user.uid),
        orderBy('scheduled_date', 'desc')
      );
      const snap = await getDocs(q);
      const list: SellerDelivery[] = [];
      
      for (const d of snap.docs) {
        const data = d.data();
        // Fetch offer name if offer_id exists
        let offerName = '';
        if (data.offer_id) {
          try {
            const offerDoc = await getDoc(doc(db, 'offers', data.offer_id));
            if (offerDoc.exists()) {
              const offerData = offerDoc.data();
              // Try to get name from offer or product
              if (offerData.name) {
                offerName = offerData.name;
              } else if (offerData.product_id) {
                const productDoc = await getDoc(doc(db, 'products', offerData.product_id));
                if (productDoc.exists()) {
                  offerName = productDoc.data().name || 'Offre';
                }
              } else {
                offerName = 'Offre';
              }
            }
          } catch (e) {
            console.error('Error fetching offer name:', e);
          }
        }
        
        list.push({
          id: d.id,
          ...data,
          offer_name: offerName,
        } as SellerDelivery);
      }
      
      setDeliveries(list);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDelivery = async (deliveryData: Omit<SellerDelivery, 'id' | 'seller_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.uid) throw new Error('User not authenticated');
    
    const newDelivery = {
      ...deliveryData,
      seller_id: user.uid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const docRef = await addDoc(collection(db, 'deliveries'), newDelivery);
    await fetchDeliveries();
    return docRef.id;
  };

  const updateDelivery = async (deliveryId: string, updates: Partial<SellerDelivery>) => {
    await updateDoc(doc(db, 'deliveries', deliveryId), {
      ...updates,
      updated_at: new Date().toISOString(),
    });
    await fetchDeliveries();
  };

  useEffect(() => {
    fetchDeliveries();
  }, [user?.uid]);

  return {
    deliveries,
    loading,
    fetchDeliveries,
    createDelivery,
    updateDelivery,
  };
};

