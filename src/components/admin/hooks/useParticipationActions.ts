
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const useParticipationActions = (onParticipationsChange: () => void) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  const updateOfferParticipantCount = async (offerId: string) => {
    try {
      // Fetch all participations for this offer
      const participationsQuery = query(
        collection(db, 'participations'),
        where('offer_id', '==', offerId)
      );
      const participationsSnap = await getDocs(participationsQuery);
      
      // Calculate sum of quantities for validated participations
      let totalValidated = 0;
      participationsSnap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.status === 'validated') {
          totalValidated += data.quantity || 0;
        }
      });
      
      // Update the offer's current_participants
      await updateDoc(doc(db, 'offers', offerId), {
        current_participants: totalValidated,
        updated_at: new Date().toISOString(),
      });
      
      console.log(`Updated offer ${offerId} current_participants to ${totalValidated}`);
    } catch (error) {
      console.error('Error updating offer participant count:', error);
    }
  };

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
      
      // Update participation status immediately
      await updateDoc(doc(db, 'participations', participationId), { 
        status: 'validated',
        updated_at: new Date().toISOString(),
      });

      // Update offer's current_participants count in background (non-blocking)
      if (offerId) {
        updateOfferParticipantCount(offerId).catch(err => {
          console.error('Error updating count in background:', err);
        });
      }

      console.log('Participation validated successfully');
      
      toast({
        title: "Succès",
        description: "La participation a été validée avec succès.",
      });

      // Call refresh immediately without waiting for count update
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
      
      // Update participation status immediately
      await updateDoc(doc(db, 'participations', participationId), { 
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      });

      // Update offer's current_participants count in background (non-blocking)
      if (offerId) {
        updateOfferParticipantCount(offerId).catch(err => {
          console.error('Error updating count in background:', err);
        });
      }

      console.log('Participation cancelled successfully');
      
      toast({
        title: "Succès",
        description: "La participation a été annulée avec succès.",
      });

      // Call refresh immediately without waiting for count update
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
      
      // Get participation to find offer_id and quantity
      const participationDoc = await getDoc(doc(db, 'participations', participationId));
      if (!participationDoc.exists()) {
        throw new Error('Participation not found');
      }
      
      const participationData = participationDoc.data();
      const offerId = participationData.offer_id;
      const quantity = participationData.quantity || 0;
      
      // Update participation status immediately
      await updateDoc(doc(db, 'participations', participationId), { 
        status: newStatus,
        updated_at: new Date().toISOString(),
      });

      // Update offer's current_participants count only if validating
      // For pending, we don't need to update the count
      if (offerId && newStatus === 'validated') {
        // Use a more efficient approach: update count in background
        updateOfferParticipantCount(offerId).catch(err => {
          console.error('Error updating count in background:', err);
        });
      }

      console.log('Participation reactivated successfully');
      
      toast({
        title: "Succès",
        description: `La participation a été ${newStatus === 'validated' ? 'validée' : 'réactivée'} avec succès.`,
      });

      // Call refresh immediately without waiting for count update
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
