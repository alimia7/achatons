
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCommunityOfferActions = (onOffersChange: () => void) => {
  const { toast } = useToast();

  const approveOffer = async (offerId: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ 
          status: 'active',
          created_by_admin: true // Mark as admin-approved
        })
        .eq('id', offerId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'offre a été approuvée et est maintenant visible publiquement.",
      });
      onOffersChange();
    } catch (error) {
      console.error('Error approving offer:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'approbation.",
        variant: "destructive",
      });
    }
  };

  const rejectOffer = async (offerId: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status: 'rejected' })
        .eq('id', offerId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "L'offre a été rejetée.",
      });
      onOffersChange();
    } catch (error) {
      console.error('Error rejecting offer:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du rejet.",
        variant: "destructive",
      });
    }
  };

  return {
    approveOffer,
    rejectOffer,
  };
};
