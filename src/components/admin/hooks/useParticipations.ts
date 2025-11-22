
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Participation {
  id: string;
  user_name: string;
  user_phone: string;
  user_email: string;
  quantity: number;
  status: string;
  created_at: string;
  offers: {
    name: string;
  };
}

export const useParticipations = () => {
  const { toast } = useToast();
  const [participations, setParticipations] = useState<Participation[]>([]);

  const fetchParticipations = async () => {
    try {
      console.log('Fetching participations...');
      const [partsSnap, offersSnap] = await Promise.all([
        getDocs(collection(db, 'participations')),
        getDocs(collection(db, 'offers')),
      ]);
      const offerNameById = new Map<string, string>();
      offersSnap.forEach((docSnap) => {
        const data = docSnap.data() as any;
        offerNameById.set(docSnap.id, data.name || '');
      });
      const result: Participation[] = partsSnap.docs.map((docSnap) => {
        const data = docSnap.data() as any;
        const offerId = data.offer_id;
        return {
          id: docSnap.id,
          user_name: data.user_name,
          user_phone: data.user_phone,
          user_email: data.user_email || '',
          quantity: data.quantity || 0,
          status: data.status || 'pending',
          created_at: data.created_at || '',
          offers: { name: offerNameById.get(offerId) || '' },
        };
      });
      console.log('Participations fetched:', result.length);
      setParticipations(result);
    } catch (error) {
      console.error('Error fetching participations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les participations.",
        variant: "destructive",
      });
    }
  };

  return {
    participations,
    fetchParticipations,
  };
};
