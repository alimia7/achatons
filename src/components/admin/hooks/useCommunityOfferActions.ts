
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export const useCommunityOfferActions = (onOffersChange: () => void) => {
  const { toast } = useToast();

  const approveOffer = async (offerId: string) => {
    try {
      await updateDoc(doc(db, 'offers', offerId), { 
          status: 'active',
        created_by_admin: true
      });

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
      await updateDoc(doc(db, 'offers', offerId), { status: 'rejected' });

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
