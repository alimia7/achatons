
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Offer {
  id: string;
  name: string;
  description: string;
  original_price: number;
  group_price: number;
  current_participants: number;
  target_participants: number;
  deadline: string;
  status: string;
  supplier: string;
  category_id?: string;
  categories?: {
    name: string;
  };
  created_by_admin: boolean;
  created_by_user_id?: string;
}

export const useOffers = () => {
  const { toast } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);

  const fetchOffers = async () => {
    try {
      console.log('Fetching offers...');
      const [offersSnap, categoriesSnap] = await Promise.all([
        getDocs(collection(db, 'offers')),
        getDocs(collection(db, 'categories')),
      ]);
      const categoryMap = new Map<string, string>();
      categoriesSnap.forEach((docSnap) => {
        const data = docSnap.data() as any;
        categoryMap.set(docSnap.id, data.name || '');
      });
      const result: Offer[] = offersSnap.docs.map((docSnap) => {
        const data = docSnap.data() as any;
        const categoryId = data.category_id || '';
        return {
          id: docSnap.id,
          name: data.name,
          description: data.description || '',
          original_price: data.original_price,
          group_price: data.group_price,
          current_participants: data.current_participants || 0,
          target_participants: data.target_participants,
          deadline: data.deadline,
          status: data.status,
          supplier: data.supplier || '',
          category_id: categoryId || undefined,
          categories: categoryId ? { name: categoryMap.get(categoryId) || '' } : undefined,
          created_by_admin: !!data.created_by_admin,
          created_by_user_id: data.created_by_user_id || undefined,
        };
      });
      console.log('Offers fetched:', result.length);
      setOffers(result);
    } catch (error) {
      console.error('Error fetching offers:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les offres.",
        variant: "destructive",
      });
    }
  };

  return {
    offers,
    fetchOffers,
  };
};
