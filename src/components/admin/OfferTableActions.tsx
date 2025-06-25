
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OfferTableActionsProps {
  onNewOffer: () => void;
  onManageCategories: () => void;
}

const OfferTableActions = ({ onNewOffer, onManageCategories }: OfferTableActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={onManageCategories}
        variant="outline"
        size="sm"
      >
        Gérer les catégories
      </Button>
      <Button 
        onClick={onNewOffer}
        className="bg-achatons-orange hover:bg-achatons-brown"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nouvelle offre
      </Button>
    </div>
  );
};

export default OfferTableActions;
