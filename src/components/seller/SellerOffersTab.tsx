import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSellerOffers, SellerOffer } from './hooks/useSellerOffers';
import { useSellerProducts } from './hooks/useSellerProducts';
import SellerOfferForm from './SellerOfferForm';
import OfferParticipantsList from './OfferParticipantsList';
import { Plus, Eye, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LoadingState from '@/components/LoadingState';

const SellerOffersTab = () => {
  const { offers, loading, createOffer, updateOffer, toggleOfferStatus, fetchOffers } = useSellerOffers();
  const { products } = useSellerProducts();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<SellerOffer | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [viewingOffer, setViewingOffer] = useState<SellerOffer | null>(null);

  const handleNewOffer = (productId?: string) => {
    setSelectedProductId(productId || null);
    setEditingOffer(null);
    setShowForm(true);
  };

  const handleEdit = (offer: SellerOffer) => {
    setSelectedProductId(offer.product_id);
    setEditingOffer(offer);
    setShowForm(true);
  };

  const handleView = (offer: SellerOffer) => {
    setViewingOffer(offer);
  };

  const handleParticipationsChange = () => {
    // Refresh offers to update participant counts
    fetchOffers();
  };

  const handleSave = async (offerData: any) => {
    try {
      if (editingOffer) {
        await updateOffer(editingOffer.id, offerData);
        toast({
          title: "Succès",
          description: "L'offre a été mise à jour avec succès.",
        });
      } else {
        await createOffer(offerData);
        toast({
          title: "Succès",
          description: "L'offre a été créée avec succès.",
        });
      }
      setShowForm(false);
      setEditingOffer(null);
      setSelectedProductId(null);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la sauvegarde.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl md:text-3xl font-semibold text-achatons-brown">Mes offres</CardTitle>
          <Button onClick={() => handleNewOffer()} className="bg-achatons-orange hover:bg-achatons-brown">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle offre
          </Button>
        </CardHeader>
        <CardContent>
          {offers.length === 0 ? (
            <div className="text-center py-16 text-gray-600 border rounded-md bg-white">
              <p>Aucune offre créée.</p>
              <p className="text-sm text-gray-500 mt-2">
                Créez une offre depuis l'onglet "Produits" ou cliquez sur "Nouvelle offre".
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit / Offre</TableHead>
                    <TableHead>Prix groupé</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Date début</TableHead>
                    <TableHead>Date limite</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">{offer.product_name || 'Produit'}</TableCell>
                      <TableCell>{offer.group_price.toLocaleString()} FCFA</TableCell>
                      <TableCell>{offer.current_participants} / {offer.target_participants}</TableCell>
                      <TableCell>{new Date(offer.start_date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{new Date(offer.deadline).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <Badge variant={offer.status === 'active' ? 'default' : 'secondary'}>
                          {offer.status === 'active' ? 'Active' : offer.status === 'completed' ? 'Terminée' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(offer)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(offer)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-achatons-brown">
              {editingOffer ? 'Modifier l\'offre' : 'Créer une offre groupée'}
            </DialogTitle>
          </DialogHeader>
          <SellerOfferForm
            offer={editingOffer}
            productId={selectedProductId}
            products={products}
            onSaved={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingOffer(null);
              setSelectedProductId(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {viewingOffer && (
        <Dialog open={!!viewingOffer} onOpenChange={() => setViewingOffer(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-achatons-brown">Détails de l'offre</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-achatons-brown mb-2">Résumé</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Produit</p>
                    <p className="font-medium">{viewingOffer.product_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Prix groupé</p>
                    <p className="font-medium">{viewingOffer.group_price.toLocaleString()} FCFA</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Participants</p>
                    <p className="font-medium">{viewingOffer.current_participants} / {viewingOffer.target_participants}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Statut</p>
                    <Badge variant={viewingOffer.status === 'active' ? 'default' : 'secondary'}>
                      {viewingOffer.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-achatons-brown mb-4">Participants</h3>
                <OfferParticipantsList 
                  offerId={viewingOffer.id} 
                  onParticipationsChange={handleParticipationsChange}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SellerOffersTab;

