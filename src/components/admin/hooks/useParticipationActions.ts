
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useParticipationActions = (onParticipationsChange: () => void) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  const handleValidateParticipation = async (participationId: string) => {
    if (isUpdating[participationId]) return;
    
    setIsUpdating(prev => ({ ...prev, [participationId]: true }));
    
    try {
      console.log('Validating participation:', participationId);
      
      const { error } = await supabase
        .from('participations')
        .update({ status: 'validated' })
        .eq('id', participationId);

      if (error) {
        console.error('Error validating participation:', error);
        throw error;
      }

      console.log('Participation validated successfully');
      
      toast({
        title: "Succès",
        description: "La participation a été validée avec succès.",
      });

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
      
      const { error } = await supabase
        .from('participations')
        .update({ status: 'cancelled' })
        .eq('id', participationId);

      if (error) {
        console.error('Error cancelling participation:', error);
        throw error;
      }

      console.log('Participation cancelled successfully');
      
      toast({
        title: "Succès",
        description: "La participation a été annulée avec succès.",
      });

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

  return {
    isUpdating,
    handleValidateParticipation,
    handleCancelParticipation,
  };
};
