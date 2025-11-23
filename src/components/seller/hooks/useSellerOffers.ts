import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, orderBy, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export interface SellerOffer {
  id: string;
  product_id: string;
  product_name?: string;
  product_image?: string;
  group_price: number;
  target_participants: number;
  current_participants: number;
  start_date: string;
  deadline: string;
  status: 'active' | 'inactive' | 'completed' | 'cancelled';
  seller_id: string;
  created_at: string;
  updated_at: string;
}

export const useSellerOffers = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState<SellerOffer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOffers = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // First try with orderBy, if it fails (missing index), fetch without orderBy
      let snap;
      try {
        const q = query(
          collection(db, 'offers'),
          where('seller_id', '==', user.uid),
          orderBy('created_at', 'desc')
        );
        snap = await getDocs(q);
      } catch (error: any) {
        // If index error, fetch without orderBy and sort client-side
        console.warn('Index missing, fetching without orderBy:', error);
        const q = query(
          collection(db, 'offers'),
          where('seller_id', '==', user.uid)
        );
        snap = await getDocs(q);
      }
      
      const list: SellerOffer[] = [];
      
      for (const d of snap.docs) {
        const data = d.data();
        // Fetch product info if product_id exists
        let productName = '';
        let productImage = '';
        if (data.product_id) {
          try {
            const productDoc = await getDoc(doc(db, 'products', data.product_id));
            if (productDoc.exists()) {
              const productData = productDoc.data();
              productName = productData.name;
              productImage = productData.image_url || '';
            }
          } catch (e) {
            console.error('Error fetching product info:', e);
          }
        }
        
        list.push({
          id: d.id,
          ...data,
          product_name: productName,
          product_image: productImage,
        } as SellerOffer);
      }
      
      // Sort by created_at descending (client-side if needed)
      list.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });
      
      console.log(`Fetched ${list.length} offers for seller ${user.uid}`);
      setOffers(list);
    } catch (error: any) {
      console.error('Error fetching offers:', error);
      if (error.code === 'permission-denied') {
        console.error('Permission denied - check Firestore rules');
      } else if (error.code === 'failed-precondition') {
        console.error('Index required - create composite index for offers collection');
      }
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const createOffer = async (offerData: Omit<SellerOffer, 'id' | 'seller_id' | 'created_at' | 'updated_at' | 'current_participants'>) => {
    if (!user?.uid) throw new Error('User not authenticated');
    
    const newOffer = {
      ...offerData,
      seller_id: user.uid,
      current_participants: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    console.log('Creating offer with data:', newOffer);
    const docRef = await addDoc(collection(db, 'offers'), newOffer);
    console.log('Offer created with ID:', docRef.id);
    await fetchOffers();
    return docRef.id;
  };

  const updateOffer = async (offerId: string, updates: Partial<SellerOffer>, skipRefresh = false) => {
    await updateDoc(doc(db, 'offers', offerId), {
      ...updates,
      updated_at: new Date().toISOString(),
    });
    if (!skipRefresh) {
      await fetchOffers();
    }
  };

  const toggleOfferStatus = async (offerId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    // Update in Firestore
    await updateDoc(doc(db, 'offers', offerId), {
      status: newStatus as any,
      updated_at: new Date().toISOString(),
    });
    // Update local state immediately without reloading
    setOffers(prevOffers => 
      prevOffers.map(offer => 
        offer.id === offerId 
          ? { ...offer, status: newStatus as any }
          : offer
      )
    );
  };

  const updateParticipantCount = async (offerId: string, count: number) => {
    await updateOffer(offerId, { current_participants: count });
  };

  useEffect(() => {
    fetchOffers();
  }, [user?.uid]);

  return {
    offers,
    loading,
    fetchOffers,
    createOffer,
    updateOffer,
    toggleOfferStatus,
    updateParticipantCount,
  };
};

