import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TierBuilder } from './TierBuilder';
import { SellerOffer } from './hooks/useSellerOffers';
import { SellerProduct } from './hooks/useSellerProducts';
import type { PricingTier } from '../../types/pricing';

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
    pricing_model: 'tiered' as 'fixed' | 'tiered',
    group_price: '',
    target_participants: '',
    pricing_tiers: [] as PricingTier[],
    start_date: '',
    deadline: '',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    if (offer) {
      setFormData({
        product_id: offer.product_id,
        pricing_model: (offer as any).pricing_model || 'fixed',
        group_price: offer.group_price.toString(),
        target_participants: offer.target_participants.toString(),
        pricing_tiers: (offer as any).pricing_tiers || [],
        start_date: offer.start_date.split('T')[0],
        deadline: offer.deadline.split('T')[0],
        status: offer.status,
      });
    } else if (productId) {
      setFormData(prev => ({ ...prev, product_id: productId }));
    }
  }, [offer, productId]);

  // Initialize default tiers when product is selected
  useEffect(() => {
    const selectedProduct = products.find(p => p.id === formData.product_id);
    if (selectedProduct && formData.pricing_tiers.length === 0 && formData.pricing_model === 'tiered') {
      const basePrice = selectedProduct.base_price;
      const defaultTiers: PricingTier[] = [
        {
          tier_number: 1,
          min_participants: 10,
          price: Math.round(basePrice * 0.94),
          label: 'Bronze',
          discount_percentage: 6
        },
        {
          tier_number: 2,
          min_participants: 25,
          price: Math.round(basePrice * 0.89),
          label: 'Silver',
          discount_percentage: 11
        },
        {
          tier_number: 3,
          min_participants: 50,
          price: Math.round(basePrice * 0.86),
          label: 'Gold',
          discount_percentage: 14
        }
      ];
      setFormData(prev => ({ ...prev, pricing_tiers: defaultTiers }));
    }
  }, [formData.product_id, formData.pricing_model, products]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedProduct = products.find(p => p.id === formData.product_id);
    if (!selectedProduct) return;

    const baseOfferData = {
      product_id: formData.product_id,
      start_date: new Date(formData.start_date).toISOString(),
      deadline: new Date(formData.deadline).toISOString(),
      status: formData.status,
    };

    if (formData.pricing_model === 'tiered') {
      // Tiered pricing model
      const lastTier = formData.pricing_tiers[formData.pricing_tiers.length - 1];
      const offerData = {
        ...baseOfferData,
        pricing_model: 'tiered',
        base_price: selectedProduct.base_price,
        pricing_tiers: formData.pricing_tiers,
        current_price: selectedProduct.base_price,
        current_participants: 0,
        current_tier: 0,
        next_tier_participants: formData.pricing_tiers[0]?.min_participants || null,
        total_revenue: 0,
        tier_history: [],
        // Keep legacy fields for compatibility
        original_price: selectedProduct.base_price,
        group_price: lastTier?.price || selectedProduct.base_price,
        target_participants: lastTier?.min_participants || 50,
      };
      onSaved(offerData);
    } else {
      // Fixed pricing model (legacy)
      const offerData = {
        ...baseOfferData,
        pricing_model: 'fixed',
        group_price: parseFloat(formData.group_price),
        target_participants: parseInt(formData.target_participants),
        original_price: selectedProduct.base_price,
      };
      onSaved(offerData);
    }
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

      {/* Pricing Model Selection */}
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg border-2 border-achatons-orange/20">
        <Label>Modèle de tarification *</Label>
        <RadioGroup
          value={formData.pricing_model}
          onValueChange={(value: 'fixed' | 'tiered') => {
            setFormData(prev => ({ ...prev, pricing_model: value }));
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fixed" id="fixed" />
            <Label htmlFor="fixed" className="font-normal cursor-pointer">
              Prix fixe - Un seul prix pour tous
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="tiered" id="tiered" />
            <Label htmlFor="tiered" className="font-normal cursor-pointer">
              Prix par paliers - Le prix baisse avec plus de participants (Recommandé)
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Fixed pricing fields */}
      {formData.pricing_model === 'fixed' && (
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
      )}

      {/* Tiered pricing - TierBuilder */}
      {formData.pricing_model === 'tiered' && selectedProduct && (
        <div>
          <Label className="mb-2 block">Configuration des paliers de prix</Label>
          <TierBuilder
            basePrice={selectedProduct.base_price}
            tiers={formData.pricing_tiers}
            onChange={(tiers) => setFormData(prev => ({ ...prev, pricing_tiers: tiers }))}
          />
        </div>
      )}

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

