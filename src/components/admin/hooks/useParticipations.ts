
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
      const { data, error } = await supabase
        .from('participations')
        .select(`
          *,
          offers (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Participations fetched:', data?.length);
      setParticipations(data || []);
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
