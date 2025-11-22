import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SellerOffer } from './hooks/useSellerOffers';
import { SellerProduct } from './hooks/useSellerProducts';

interface SellerOfferFormProps {
  offer?: SellerOffer | null;
  productId?: string | null;
  products: SellerProduct[];
  onSaved: (offerData: any) => void;
  onCancel: () => void;
}

const SellerOfferForm = ({ offer, productId, products, onSaved, onCancel }: SellerOfferFormProps) => {
  const [formData, setFormData] = useState({
    product_id: '',
    group_price: '',
    target_participants: '',
    start_date: '',
    deadline: '',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    if (offer) {
      setFormData({
        product_id: offer.product_id,
        group_price: offer.group_price.toString(),
        target_participants: offer.target_participants.toString(),
        start_date: offer.start_date.split('T')[0],
        deadline: offer.deadline.split('T')[0],
        status: offer.status,
      });
    } else if (productId) {
      setFormData(prev => ({ ...prev, product_id: productId }));
    }
  }, [offer, productId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const offerData = {
      product_id: formData.product_id,
      group_price: parseFloat(formData.group_price),
      target_participants: parseInt(formData.target_participants),
      start_date: new Date(formData.start_date).toISOString(),
      deadline: new Date(formData.deadline).toISOString(),
      status: formData.status,
    };
    onSaved(offerData);
  };

  const selectedProduct = products.find(p => p.id === formData.product_id);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="product_id">Produit concerné *</Label>
        <Select 
          value={formData.product_id} 
          onValueChange={(value) => handleInputChange('product_id', value)}
          disabled={!!productId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un produit" />
          </SelectTrigger>
          <SelectContent>
            {products.filter(p => p.status === 'active').map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name} - {product.base_price.toLocaleString()} FCFA
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedProduct && (
          <p className="text-sm text-gray-600 mt-1">
            Prix de base: {selectedProduct.base_price.toLocaleString()} FCFA / {selectedProduct.unit_of_measure}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="group_price">Prix groupé (FCFA) *</Label>
          <Input
            id="group_price"
            type="number"
            value={formData.group_price}
            onChange={(e) => handleInputChange('group_price', e.target.value)}
            required
            placeholder="25000"
          />
        </div>
        <div>
          <Label htmlFor="target_participants">Nombre de participants requis *</Label>
          <Input
            id="target_participants"
            type="number"
            value={formData.target_participants}
            onChange={(e) => handleInputChange('target_participants', e.target.value)}
            required
            placeholder="100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_date">Date de début *</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => handleInputChange('start_date', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="deadline">Date limite *</Label>
          <Input
            id="deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => handleInputChange('deadline', e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="status">Statut</Label>
        <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button 
          type="submit" 
          className="bg-achatons-orange hover:bg-achatons-brown"
        >
          {offer ? "Mettre à jour" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
};

export default SellerOfferForm;

