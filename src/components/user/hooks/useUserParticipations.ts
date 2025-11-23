import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, getDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export interface UserParticipation {
  id: string;
  participation_id: string;
  offer_id: string;
  offer_name: string;
  offer_image?: string;
  group_price: number;
  original_price?: number;
  quantity: number;
  total_amount: number;
  status: 'pending' | 'validated' | 'cancelled';
  payment_status?: 'pending' | 'paid' | 'refunded';
  created_at: string;
  updated_at?: string;
  deadline?: string;
  target_participants?: number;
  current_participants?: number;
  seller_name?: string;
  seller_logo?: string;
}

export const useUserParticipations = () => {
  const { user } = useAuth();
  const [participations, setParticipations] = useState<UserParticipation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParticipations = async () => {
    if (!user?.uid) {
      setParticipations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Get all participations for this user
      let snap;
      try {
        const q = query(
          collection(db, 'participations'),
          where('user_id', '==', user.uid),
          orderBy('created_at', 'desc')
        );
        snap = await getDocs(q);
      } catch (error: any) {
        // If index error, fetch without orderBy and sort client-side
        console.warn('Index missing, fetching without orderBy:', error);
        const q = query(
          collection(db, 'participations'),
          where('user_id', '==', user.uid)
        );
        snap = await getDocs(q);
      }

      const allParticipations: UserParticipation[] = [];

      for (const docSnap of snap.docs) {
        const data = docSnap.data();
        const offerId = data.offer_id;

        if (!offerId) continue;

        try {
          // Fetch offer details
          const offerDoc = await getDoc(doc(db, 'offers', offerId));
          if (!offerDoc.exists()) continue;

          const offerData = offerDoc.data();
          let productName = offerData.product_name || 'Produit';
          let productImage = offerData.product_image || '';
          let groupPrice = offerData.group_price || 0;
          let originalPrice = offerData.original_price || 0;
          let deadline = offerData.deadline || '';
          let targetParticipants = offerData.target_participants || 0;
          let currentParticipants = offerData.current_participants || 0;
          let sellerId = offerData.seller_id;

          // If offer references a product, fetch product details
          if (offerData.product_id) {
            try {
              const productDoc = await getDoc(doc(db, 'products', offerData.product_id));
              if (productDoc.exists()) {
                const productData = productDoc.data();
                productName = productData.name || productName;
                productImage = productData.image_url || productImage;
                originalPrice = productData.base_price || originalPrice;
              }
            } catch (error) {
              console.error('Error fetching product:', error);
            }
          }

          // Fetch seller information if available
          let sellerName = '';
          let sellerLogo = '';
          if (sellerId) {
            try {
              const sellerDoc = await getDoc(doc(db, 'profiles', sellerId));
              if (sellerDoc.exists()) {
                const sellerData = sellerDoc.data();
                sellerName = sellerData.company_name || sellerData.responsible_name || '';
                sellerLogo = sellerData.logo_url || '';
              }
            } catch (error) {
              console.error('Error fetching seller:', error);
            }
          }

          const quantity = data.quantity || 0;
          const amount = data.amount || (quantity * groupPrice);

          allParticipations.push({
            id: docSnap.id,
            participation_id: docSnap.id,
            offer_id: offerId,
            offer_name: productName,
            offer_image: productImage,
            group_price: groupPrice,
            original_price: originalPrice,
            quantity: quantity,
            total_amount: amount,
            status: data.status || 'pending',
            payment_status: data.payment_status,
            created_at: data.created_at || new Date().toISOString(),
            updated_at: data.updated_at,
            deadline: deadline,
            target_participants: targetParticipants,
            current_participants: currentParticipants,
            seller_name: sellerName,
            seller_logo: sellerLogo,
          });
        } catch (error) {
          console.error(`Error processing participation ${docSnap.id}:`, error);
        }
      }

      // Sort by created_at descending (client-side if needed)
      allParticipations.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });

      setParticipations(allParticipations);
    } catch (error) {
      console.error('Error fetching user participations:', error);
      setParticipations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipations();
  }, [user?.uid]);

  return {
    participations,
    loading,
    refreshParticipations: fetchParticipations,
  };
};

