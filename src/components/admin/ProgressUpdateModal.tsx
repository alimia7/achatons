
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Offer {
  id: string;
  name: string;
  current_participants: number;
  target_participants: number;
  unit_of_measure?: string;
}

interface ProgressUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer | null;
  onUpdate: () => void;
}

const ProgressUpdateModal = ({ isOpen, onClose, offer, onUpdate }: ProgressUpdateModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [newParticipants, setNewParticipants] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offer) return;

    setLoading(true);
    try {
      const participants = parseInt(newParticipants);
      
      if (isNaN(participants) || participants < 0) {
        toast({
          title: "Erreur",
          description: "Veuillez entrer un nombre valide de participants.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('offers')
        .update({ current_participants: participants })
        .eq('id', offer.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La progression de l'offre a été mise à jour.",
      });

      onUpdate();
      setNewParticipants('');
      onClose();
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!offer) return null;

  const currentProgress = (offer.current_participants / offer.target_participants) * 100;
  const newProgress = newParticipants ? 
    (parseInt(newParticipants) / offer.target_participants) * 100 : currentProgress;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier la progression</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{offer.name}</h3>
            <p className="text-sm text-gray-600">
              Objectif: {offer.target_participants} {offer.unit_of_measure || 'pièces'}
            </p>
          </div>

          <div>
            <Label>Progression actuelle</Label>
            <div className="mt-2">
              <Progress value={currentProgress} className="h-2" />
              <p className="text-sm text-gray-600 mt-1">
                {offer.current_participants} / {offer.target_participants} ({Math.round(currentProgress)}%)
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="participants">Nouveau nombre de participants *</Label>
              <Input
                id="participants"
                type="number"
                value={newParticipants}
                onChange={(e) => setNewParticipants(e.target.value)}
                placeholder={offer.current_participants.toString()}
                min="0"
                max={offer.target_participants}
                required
              />
            </div>

            {newParticipants && (
              <div>
                <Label>Nouvelle progression</Label>
                <div className="mt-2">
                  <Progress value={newProgress} className="h-2" />
                  <p className="text-sm text-gray-600 mt-1">
                    {newParticipants} / {offer.target_participants} ({Math.round(newProgress)}%)
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="bg-achatons-orange hover:bg-achatons-brown"
                disabled={loading || !newParticipants}
              >
                {loading ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressUpdateModal;
