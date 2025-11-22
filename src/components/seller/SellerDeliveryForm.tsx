import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SellerDelivery } from './hooks/useSellerDeliveries';
import { SellerOffer } from './hooks/useSellerOffers';

interface SellerDeliveryFormProps {
  delivery?: SellerDelivery | null;
  offers: SellerOffer[];
  onSaved: (deliveryData: any) => void;
  onCancel: () => void;
}

const SellerDeliveryForm = ({ delivery, offers, onSaved, onCancel }: SellerDeliveryFormProps) => {
  const [formData, setFormData] = useState({
    offer_id: '',
    packages_count: '',
    scheduled_date: '',
    status: 'pending' as 'pending' | 'in_transit' | 'delivered' | 'cancelled',
    carrier: '',
    tracking_code: '',
  });

  useEffect(() => {
    if (delivery) {
      setFormData({
        offer_id: delivery.offer_id,
        packages_count: delivery.packages_count.toString(),
        scheduled_date: delivery.scheduled_date.split('T')[0],
        status: delivery.status,
        carrier: delivery.carrier || '',
        tracking_code: delivery.tracking_code || '',
      });
    }
  }, [delivery]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const deliveryData = {
      offer_id: formData.offer_id,
      packages_count: parseInt(formData.packages_count),
      scheduled_date: new Date(formData.scheduled_date).toISOString(),
      status: formData.status,
      carrier: formData.carrier || null,
      tracking_code: formData.tracking_code || null,
    };
    onSaved(deliveryData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="offer_id">Offre associée *</Label>
        <Select 
          value={formData.offer_id} 
          onValueChange={(value) => handleInputChange('offer_id', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une offre" />
          </SelectTrigger>
          <SelectContent>
            {offers.map((offer) => (
              <SelectItem key={offer.id} value={offer.id}>
                {offer.product_name || 'Offre'} - {offer.group_price.toLocaleString()} FCFA
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="packages_count">Nombre de colis *</Label>
          <Input
            id="packages_count"
            type="number"
            value={formData.packages_count}
            onChange={(e) => handleInputChange('packages_count', e.target.value)}
            required
            placeholder="1"
          />
        </div>
        <div>
          <Label htmlFor="scheduled_date">Date prévue *</Label>
          <Input
            id="scheduled_date"
            type="date"
            value={formData.scheduled_date}
            onChange={(e) => handleInputChange('scheduled_date', e.target.value)}
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
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="in_transit">En cours</SelectItem>
            <SelectItem value="delivered">Livré</SelectItem>
            <SelectItem value="cancelled">Annulé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="carrier">Transporteur</Label>
          <Input
            id="carrier"
            value={formData.carrier}
            onChange={(e) => handleInputChange('carrier', e.target.value)}
            placeholder="Ex: DHL, FedEx, etc."
          />
        </div>
        <div>
          <Label htmlFor="tracking_code">Code de suivi</Label>
          <Input
            id="tracking_code"
            value={formData.tracking_code}
            onChange={(e) => handleInputChange('tracking_code', e.target.value)}
            placeholder="Ex: ABC123456789"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button 
          type="submit" 
          className="bg-achatons-orange hover:bg-achatons-brown"
        >
          {delivery ? "Mettre à jour" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
};

export default SellerDeliveryForm;

