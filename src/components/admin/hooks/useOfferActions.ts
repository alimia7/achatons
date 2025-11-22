
import { useToast } from '@/hooks/use-toast';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const useOfferActions = (onOffersChange: () => void) => {
  const { toast } = useToast();

  const deleteOffer = async (offerId: string) => {
    try {
      await deleteDoc(doc(db, 'offers', offerId));

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
