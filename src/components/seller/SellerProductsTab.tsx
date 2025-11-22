import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useSellerProducts, SellerProduct } from './hooks/useSellerProducts';
import { useSellerOffers } from './hooks/useSellerOffers';
import SellerProductForm from './SellerProductForm';
import SellerOfferForm from './SellerOfferForm';
import { Plus, Search, Edit, Trash2, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LoadingState from '@/components/LoadingState';

const SellerProductsTab = () => {
  const { products, loading, createProduct, updateProduct, deleteProduct, toggleProductStatus } = useSellerProducts();
  const { createOffer } = useSellerOffers();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null);
  const [selectedProductForOffer, setSelectedProductForOffer] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleNewProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: SellerProduct) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(productId);
        toast({
          title: "Succès",
          description: "Le produit a été supprimé avec succès.",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite lors de la suppression.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = async (productData: any) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast({
          title: "Succès",
          description: "Le produit a été mis à jour avec succès.",
        });
      } else {
        await createProduct(productData);
        toast({
          title: "Succès",
          description: "Le produit a été créé avec succès.",
        });
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la sauvegarde.",
        variant: "destructive",
      });
    }
  };

  const handleCreateOffer = (productId: string) => {
    setSelectedProductForOffer(productId);
    setShowOfferForm(true);
  };

  const handleSaveOffer = async (offerData: any) => {
    try {
      await createOffer(offerData);
      toast({
        title: "Succès",
        description: "L'offre a été créée avec succès.",
      });
      setShowOfferForm(false);
      setSelectedProductForOffer(null);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la création de l'offre.",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl md:text-3xl font-semibold text-achatons-brown">
            Mes produits {products.length > 0 && `(${products.length})`}
          </CardTitle>
          <Button onClick={handleNewProduct} className="bg-achatons-orange hover:bg-achatons-brown">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un produit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-gray-600 border rounded-md bg-white">
              <p>Aucun produit trouvé.</p>
              <p className="text-sm text-gray-500 mt-2">
                {products.length === 0 
                  ? "Vous n'avez pas encore créé de produits. Cliquez sur 'Ajouter un produit' pour commencer."
                  : "Aucun produit ne correspond à votre recherche."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Prix de base</TableHead>
                    <TableHead>Unité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date d'ajout</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category_id || '-'}</TableCell>
                      <TableCell>{product.base_price.toLocaleString()} FCFA</TableCell>
                      <TableCell>{product.unit_of_measure}</TableCell>
                      <TableCell>
                        <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                          {product.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(product.created_at).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCreateOffer(product.id)}
                            disabled={product.status === 'inactive'}
                            title={product.status === 'inactive' ? 'Le produit doit être actif pour créer une offre' : 'Créer une offre'}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Offre
                          </Button>
                          <Switch
                            checked={product.status === 'active'}
                            onCheckedChange={() => toggleProductStatus(product.id, product.status)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
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
              {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
            </DialogTitle>
          </DialogHeader>
          <SellerProductForm
            product={editingProduct}
            onSaved={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showOfferForm} onOpenChange={setShowOfferForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-achatons-brown">
              Créer une offre groupée
            </DialogTitle>
          </DialogHeader>
          <SellerOfferForm
            offer={null}
            productId={selectedProductForOffer}
            products={products}
            onSaved={handleSaveOffer}
            onCancel={() => {
              setShowOfferForm(false);
              setSelectedProductForOffer(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerProductsTab;

