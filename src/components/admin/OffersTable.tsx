
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import OfferForm from '../OfferForm';
import CategoryManager from '../CategoryManager';
import ProgressUpdateModal from './ProgressUpdateModal';
import OfferTableHeader from './OfferTableHeader';
import OfferTableRow from './OfferTableRow';
import OfferTableActions from './OfferTableActions';
import { useOfferTableState } from './hooks/useOfferTableState';
import { useOfferActions } from './hooks/useOfferActions';

interface Offer {
  id: string;
  name: string;
  description: string;
  original_price: number;
  group_price: number;
  current_participants: number;
  target_participants: number;
  deadline: string;
  status: string;
  supplier: string;
  category_id?: string;
  categories?: {
    name: string;
  };
  unit_of_measure?: string;
  created_by_admin: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface OffersTableProps {
  offers: Offer[];
  categories: Category[];
  onOffersChange: () => void;
  onCategoriesChange: () => void;
}

const OffersTable = ({ offers, categories, onOffersChange, onCategoriesChange }: OffersTableProps) => {
  const {
    showOfferForm,
    setShowOfferForm,
    showCategoryManager,
    setShowCategoryManager,
    showProgressModal,
    setShowProgressModal,
    editingOffer,
    selectedOfferForProgress,
    handleNewOffer,
    handleEdit,
    handleOfferSaved,
    handleProgressUpdate,
    handleManageCategories,
  } = useOfferTableState();

  const { deleteOffer } = useOfferActions(onOffersChange);

  const handleOfferSavedComplete = () => {
    handleOfferSaved();
    onOffersChange();
  };

  const handleProgressUpdateComplete = () => {
    onOffersChange();
  };

  // Filter only admin-created offers
  const adminOffers = offers.filter(offer => offer.created_by_admin);

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestion des offres (Admin)</CardTitle>
          <OfferTableActions
            onNewOffer={handleNewOffer}
            onManageCategories={handleManageCategories}
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <OfferTableHeader />
              <TableBody>
                {adminOffers.map((offer) => (
                  <OfferTableRow
                    key={offer.id}
                    offer={offer}
                    onEdit={handleEdit}
                    onDelete={deleteOffer}
                    onProgressUpdate={handleProgressUpdate}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showOfferForm} onOpenChange={setShowOfferForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingOffer ? 'Modifier l\'offre' : 'Créer une nouvelle offre'}
            </DialogTitle>
          </DialogHeader>
          <OfferForm
            offer={editingOffer}
            onSaved={handleOfferSavedComplete}
            onCancel={() => setShowOfferForm(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showCategoryManager} onOpenChange={setShowCategoryManager}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Gestion des catégories</DialogTitle>
          </DialogHeader>
          <CategoryManager
            onSaved={onCategoriesChange}
          />
        </DialogContent>
      </Dialog>

      <ProgressUpdateModal
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        offer={selectedOfferForProgress}
        onUpdate={handleProgressUpdateComplete}
      />
    </>
  );
};

export default OffersTable;
