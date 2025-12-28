import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { updateOfferAfterParticipation } from '../lib/offerUpdates';

interface OfferData {
  id: string;
  originalId: string;
  name: string;
  description: string;
  originalPrice: number;
  groupPrice: number;
  savings: number;
  currentParticipants: number;
  totalQuantity: number;
  targetParticipants: number;
  deadline: string;
  image: string;
  supplier: string;
  category?: string;
  unitOfMeasure?: string;
  sellerLogo?: string | null;
  sellerName?: string | null;
  pricing_model?: 'fixed' | 'tiered';
  base_price?: number;
  pricing_tiers?: any[];
  current_price?: number;
  current_tier?: number;
}

async function fetchOffers(): Promise<OfferData[]> {
  const offersQuery = query(
    collection(db, 'offers'),
    where('status', '==', 'active')
  );

  const [offersSnap, categoriesSnap] = await Promise.all([
    getDocs(offersQuery),
    getDocs(collection(db, 'categories')),
  ]);

  const categoryMap = new Map<string, string>();
  categoriesSnap.forEach((d) => {
    const data = d.data() as any;
    categoryMap.set(d.id, data.name || '');
  });

  const transformedProducts: OfferData[] = [];

  for (const docSnap of offersSnap.docs) {
    const dbOffer = docSnap.data() as any;

    // Skip offers that haven't started yet
    if (dbOffer.start_date) {
      const startDate = new Date(dbOffer.start_date);
      const now = new Date();
      if (startDate > now) {
        continue;
      }
    }

    // Check if this offer references a product
    let productData = dbOffer;
    if (dbOffer.product_id) {
      try {
        const productDoc = await getDoc(doc(db, 'products', dbOffer.product_id));
        if (productDoc.exists()) {
          const productInfo = productDoc.data();
          productData = {
            ...productInfo,
            group_price: dbOffer.group_price,
            target_participants: dbOffer.target_participants,
            deadline: dbOffer.deadline,
            current_participants: dbOffer.current_participants || 0,
            original_price: dbOffer.original_price || productInfo.base_price || productInfo.original_price,
            category_id: productInfo.category_id || dbOffer.category_id,
          };
        }
      } catch (error) {
        console.error(`Error fetching product ${dbOffer.product_id}:`, error);
      }
    }

    // Fetch seller information
    let sellerLogo = null;
    let sellerName = null;
    if (dbOffer.seller_id) {
      try {
        const sellerProfileDoc = await getDoc(doc(db, 'profiles', dbOffer.seller_id));
        if (sellerProfileDoc.exists()) {
          const sellerData = sellerProfileDoc.data();
          sellerLogo = sellerData.logo_url || null;
          sellerName = sellerData.company_name || sellerData.responsible_name || null;
        }
      } catch (error) {
        console.error(`Error fetching seller profile ${dbOffer.seller_id}:`, error);
      }
    }

    const originalPrice = productData.original_price || productData.base_price || 0;
    const groupPrice = productData.group_price || 0;
    const targetParticipants = productData.target_participants || 0;
    const currentParticipants = productData.current_participants || 0;
    const totalQuantity = dbOffer.total_quantity || 0;

    let savings = 0;
    if (originalPrice > 0 && groupPrice > 0 && originalPrice > groupPrice) {
      savings = Math.round(((originalPrice - groupPrice) / originalPrice) * 100);
    }

    const numericId = parseInt(
      [...docSnap.id]
        .map((c) => c.charCodeAt(0).toString(16))
        .join('')
        .substring(0, 8),
      16
    );

    transformedProducts.push({
      id: numericId.toString(),
      originalId: docSnap.id,
      name: productData.name || 'Produit sans nom',
      description: productData.description || '',
      originalPrice: originalPrice,
      groupPrice: groupPrice,
      savings: savings,
      currentParticipants: currentParticipants,
      totalQuantity: totalQuantity,
      targetParticipants: targetParticipants,
      deadline: productData.deadline || new Date().toISOString(),
      image: productData.image_url || productData.image || "/placeholder.svg",
      supplier: productData.supplier || 'Fournisseur non spécifié',
      category: productData.category_id ? (categoryMap.get(productData.category_id) || productData.category_id) : undefined,
      unitOfMeasure: productData.unit_of_measure || 'pièces',
      sellerLogo: sellerLogo,
      sellerName: sellerName,
      pricing_model: dbOffer.pricing_model,
      base_price: dbOffer.base_price || originalPrice,
      pricing_tiers: dbOffer.pricing_tiers,
      current_price: dbOffer.current_price,
      current_tier: dbOffer.current_tier
    });
  }

  return transformedProducts;
}

export function useOffers() {
  const queryClient = useQueryClient();

  const { data: offers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['offers'],
    queryFn: fetchOffers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
  });

  const participateMutation = useMutation({
    mutationFn: async ({ offerId, quantity }: { offerId: string; quantity: number }) => {
      await updateOfferAfterParticipation(offerId, quantity);
    },
    onSuccess: () => {
      // Invalidate and refetch offers after participation
      queryClient.invalidateQueries({ queryKey: ['offers'] });
    },
  });

  return {
    offers,
    isLoading,
    error,
    refetch,
    participate: participateMutation.mutate,
    isParticipating: participateMutation.isPending,
  };
}
