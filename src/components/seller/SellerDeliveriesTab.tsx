import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSellerDeliveries, SellerDelivery } from './hooks/useSellerDeliveries';
import { useSellerOffers } from './hooks/useSellerOffers';
import SellerDeliveryForm from './SellerDeliveryForm';
import { Plus, Edit, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LoadingState from '@/components/LoadingState';

const SellerDeliveriesTab = () => {
  const { deliveries, loading, createDelivery, updateDelivery } = useSellerDeliveries();
  const { offers } = useSellerOffers();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<SellerDelivery | null>(null);

  const handleNewDelivery = () => {
    setEditingDelivery(null);
    setShowForm(true);
  };

  const handleEdit = (delivery: SellerDelivery) => {
    setEditingDelivery(delivery);
    setShowForm(true);
  };

  const handleSave = async (deliveryData: any) => {
    try {
      if (editingDelivery) {
        await updateDelivery(editingDelivery.id, deliveryData);
        toast({
          title: "Succès",
          description: "La livraison a été mise à jour avec succès.",
        });
      } else {
        await createDelivery(deliveryData);
        toast({
          title: "Succès",
          description: "La livraison a été créée avec succès.",
        });
      }
      setShowForm(false);
      setEditingDelivery(null);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la sauvegarde.",
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID Livraison', 'Offre', 'Nombre de colis', 'Date prévue', 'Statut', 'Transporteur', 'Code de suivi'];
    const rows = deliveries.map(delivery => [
      delivery.id,
      delivery.offer_name || 'N/A',
      delivery.packages_count.toString(),
      new Date(delivery.scheduled_date).toLocaleDateString('fr-FR'),
      delivery.status,
      delivery.carrier || '-',
      delivery.tracking_code || '-',
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `livraisons_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'default';
      case 'in_transit':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'in_transit':
        return 'En cours';
      case 'delivered':
        return 'Livré';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl md:text-3xl font-semibold text-achatons-brown">Livraisons</CardTitle>
          <div className="flex gap-2">
            <Button onClick={handleExportCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter (CSV)
            </Button>
            <Button onClick={handleNewDelivery} className="bg-achatons-orange hover:bg-achatons-brown">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle livraison
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {deliveries.length === 0 ? (
            <div className="text-center py-16 text-gray-600 border rounded-md bg-white">
              <p>Aucune livraison enregistrée.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Livraison</TableHead>
                    <TableHead>Offre associée</TableHead>
                    <TableHead>Nombre de colis</TableHead>
                    <TableHead>Date prévue</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Transporteur</TableHead>
                    <TableHead>Code de suivi</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-mono text-sm">{delivery.id.slice(0, 8)}...</TableCell>
                      <TableCell>{delivery.offer_name || 'N/A'}</TableCell>
                      <TableCell>{delivery.packages_count}</TableCell>
                      <TableCell>{new Date(delivery.scheduled_date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(delivery.status)}>
                          {getStatusLabel(delivery.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{delivery.carrier || '-'}</TableCell>
                      <TableCell className="font-mono text-sm">{delivery.tracking_code || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(delivery)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-achatons-brown">
              {editingDelivery ? 'Modifier la livraison' : 'Créer une livraison'}
            </DialogTitle>
          </DialogHeader>
          <SellerDeliveryForm
            delivery={editingDelivery}
            offers={offers}
            onSaved={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingDelivery(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerDeliveriesTab;

