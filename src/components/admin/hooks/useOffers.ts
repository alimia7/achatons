
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          categories (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Offers fetched:', data?.length);
      setOffers(data || []);
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
