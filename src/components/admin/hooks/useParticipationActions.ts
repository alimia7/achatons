
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { recalculateOfferStats } from '@/lib/offerUpdates';

export const useParticipationActions = (onParticipationsChange: () => void) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  const handleValidateParticipation = async (participationId: string) => {
    if (isUpdating[participationId]) return;

    setIsUpdating(prev => ({ ...prev, [participationId]: true }));

    try {
      console.log('Validating participation:', participationId);

      // Get participation to find offer_id
      const participationDoc = await getDoc(doc(db, 'participations', participationId));
      if (!participationDoc.exists()) {
        throw new Error('Participation not found');
      }

      const participationData = participationDoc.data();
      const offerId = participationData.offer_id;

      // Update participation status
      await updateDoc(doc(db, 'participations', participationId), {
        status: 'validated',
        updated_at: new Date().toISOString(),
      });

      // Recalculate offer stats based on all validated participations
      let tierUnlocked = false;
      let newTierNumber = 0;
      let newPrice = 0;

      if (offerId) {
        try {
          const result = await recalculateOfferStats(offerId);
          tierUnlocked = result.tierUnlocked;
          newTierNumber = result.newTierNumber;
          newPrice = result.newPrice;
        } catch (err) {
          console.error('Error recalculating offer stats:', err);
        }
      }

      console.log('Participation validated successfully');

      // Show celebration toast if tier unlocked
      if (tierUnlocked) {
        toast({
          title: `🎉 Nouveau palier débloqué !`,
          description: `Félicitations ! Le Palier ${newTierNumber} vient d'être débloqué. Le prix vient de baisser à ${new Intl.NumberFormat('fr-FR').format(newPrice)} FCFA pour tout le monde !`,
          duration: 7000,
          className: "bg-achatons-green text-white border-achatons-green",
        });
      } else {
        toast({
          title: "Succès",
          description: "La participation a été validée avec succès.",
        });
      }

      // Call refresh
      onParticipationsChange();
    } catch (error) {
      console.error('Validation error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de valider la participation.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(prev => ({ ...prev, [participationId]: false }));
    }
  };

  const handleCancelParticipation = async (participationId: string) => {
    if (isUpdating[participationId]) return;

    if (!confirm('Êtes-vous sûr de vouloir annuler cette participation ?')) return;

    setIsUpdating(prev => ({ ...prev, [participationId]: true }));

    try {
      console.log('Cancelling participation:', participationId);

      // Get participation to find offer_id
      const participationDoc = await getDoc(doc(db, 'participations', participationId));
      if (!participationDoc.exists()) {
        throw new Error('Participation not found');
      }

      const participationData = participationDoc.data();
      const offerId = participationData.offer_id;

      // Update participation status
      await updateDoc(doc(db, 'participations', participationId), {
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      });

      // Recalculate offer stats if the participation was validated
      if (offerId && participationData.status === 'validated') {
        try {
          await recalculateOfferStats(offerId);
        } catch (err) {
          console.error('Error recalculating offer stats:', err);
        }
      }

      console.log('Participation cancelled successfully');

      toast({
        title: "Succès",
        description: "La participation a été annulée avec succès.",
      });

      // Call refresh
      onParticipationsChange();
    } catch (error) {
      console.error('Cancellation error:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la participation.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(prev => ({ ...prev, [participationId]: false }));
    }
  };

  const handleReactivateParticipation = async (participationId: string, newStatus: 'pending' | 'validated' = 'pending') => {
    if (isUpdating[participationId]) return;

    setIsUpdating(prev => ({ ...prev, [participationId]: true }));

    try {
      console.log('Reactivating participation:', participationId, 'to status:', newStatus);

      // Get participation to find offer_id
      const participationDoc = await getDoc(doc(db, 'participations', participationId));
      if (!participationDoc.exists()) {
        throw new Error('Participation not found');
      }

      const participationData = participationDoc.data();
      const offerId = participationData.offer_id;

      // Update participation status
      await updateDoc(doc(db, 'participations', participationId), {
        status: newStatus,
        updated_at: new Date().toISOString(),
      });

      // Recalculate offer stats if validating
      // For pending, we don't need to update the stats
      if (offerId && newStatus === 'validated') {
        try {
          await recalculateOfferStats(offerId);
        } catch (err) {
          console.error('Error recalculating offer stats:', err);
        }
      }

      console.log('Participation reactivated successfully');

      toast({
        title: "Succès",
        description: `La participation a été ${newStatus === 'validated' ? 'validée' : 'réactivée'} avec succès.`,
      });

      // Call refresh
      onParticipationsChange();
    } catch (error) {
      console.error('Reactivation error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de réactiver la participation.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(prev => ({ ...prev, [participationId]: false }));
    }
  };

  return {
    isUpdating,
    handleValidateParticipation,
    handleCancelParticipation,
    handleReactivateParticipation,
  };
};
