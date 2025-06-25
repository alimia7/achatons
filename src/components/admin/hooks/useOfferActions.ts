
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useOfferActions = (onOffersChange: () => void) => {
  const { toast } = useToast();

  const deleteOffer = async (offerId: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offerId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'offre a été supprimée avec succès.",
      });
      onOffersChange();
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression.",
        variant: "destructive",
      });
    }
  };

  return {
    deleteOffer,
  };
};
