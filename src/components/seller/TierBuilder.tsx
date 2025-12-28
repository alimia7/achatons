import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { TierProgressBar } from '../tiers/TierProgressBar';
import type { PricingTier } from '../../types/pricing';

interface TierBuilderProps {
  basePrice: number;
  tiers: PricingTier[];
  onChange: (tiers: PricingTier[]) => void;
}

export function TierBuilder({ basePrice, tiers, onChange }: TierBuilderProps) {
  const [localTiers, setLocalTiers] = useState<PricingTier[]>(tiers);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setLocalTiers(tiers);
  }, [tiers]);

  const calculateDiscountPercentage = (price: number, base: number): number => {
    if (!base || base === 0) return 0;
    return ((base - price) / base) * 100;
  };

  const validateTiers = (newTiers: PricingTier[]): string[] => {
    const validationErrors: string[] = [];

    // Check that we have at least one tier
    if (newTiers.length === 0) {
      validationErrors.push('Ajoutez au moins un palier');
      return validationErrors;
    }

    // Check each tier
    newTiers.forEach((tier, index) => {
      // Check that min_participants is positive
      if (tier.min_participants <= 0) {
        validationErrors.push(`Palier ${index + 1}: Le nombre minimum de participants doit être supérieur à 0`);
      }

      // Check that price is positive and less than base price
      if (tier.price <= 0) {
        validationErrors.push(`Palier ${index + 1}: Le prix doit être supérieur à 0`);
      } else if (tier.price >= basePrice) {
        validationErrors.push(`Palier ${index + 1}: Le prix doit être inférieur au prix de base`);
      }

      // Check that participants increase with tiers
      if (index > 0 && tier.min_participants <= newTiers[index - 1].min_participants) {
        validationErrors.push(`Palier ${index + 1}: Le nombre de participants doit être supérieur au palier précédent`);
      }

      // Check that price decreases with tiers
      if (index > 0 && tier.price >= newTiers[index - 1].price) {
        validationErrors.push(`Palier ${index + 1}: Le prix doit être inférieur au palier précédent`);
      }
    });

    return validationErrors;
  };

  const updateTier = (index: number, field: keyof PricingTier, value: string | number) => {
    const newTiers = [...localTiers];
    if (field === 'min_participants') {
      newTiers[index].min_participants = typeof value === 'string' ? parseInt(value) || 0 : value;
    } else if (field === 'price') {
      newTiers[index].price = typeof value === 'string' ? parseFloat(value) || 0 : value;
      newTiers[index].discount_percentage = calculateDiscountPercentage(newTiers[index].price, basePrice);
    } else if (field === 'label') {
      newTiers[index].label = value as string;
    }

    const validationErrors = validateTiers(newTiers);
    setErrors(validationErrors);
    setLocalTiers(newTiers);
    onChange(newTiers);
  };

  const addTier = () => {
    const lastTier = localTiers[localTiers.length - 1];
    const newTierNumber = localTiers.length + 1;

    // Suggest values for the new tier
    const suggestedParticipants = lastTier ? lastTier.min_participants + 10 : 10;
    const suggestedPrice = lastTier ? Math.max(lastTier.price - 100, basePrice * 0.7) : basePrice * 0.9;

    const newTier: PricingTier = {
      tier_number: newTierNumber,
      min_participants: suggestedParticipants,
      price: suggestedPrice,
      label: `Palier ${newTierNumber}`,
      discount_percentage: calculateDiscountPercentage(suggestedPrice, basePrice)
    };

    const newTiers = [...localTiers, newTier];
    const validationErrors = validateTiers(newTiers);
    setErrors(validationErrors);
    setLocalTiers(newTiers);
    onChange(newTiers);
  };

  const removeTier = (index: number) => {
    const newTiers = localTiers.filter((_, i) => i !== index);

    // Renumber tiers
    newTiers.forEach((tier, i) => {
      tier.tier_number = i + 1;
      if (!tier.label || tier.label.startsWith('Palier')) {
        tier.label = `Palier ${i + 1}`;
      }
    });

    const validationErrors = validateTiers(newTiers);
    setErrors(validationErrors);
    setLocalTiers(newTiers);
    onChange(newTiers);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const getTierLabels = () => {
    return ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
  };

  return (
    <div className="space-y-4">
      {/* Info box */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          Définissez des paliers de prix dégressifs pour encourager les achats groupés.
          Plus il y a de participants, plus le prix baisse pour tout le monde !
        </p>
      </div>

      {/* Base price display */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">Prix de base (prix retail)</div>
        <div className="text-2xl font-bold text-achatons-brown">
          {basePrice > 0 ? formatPrice(basePrice) : 'Non défini'}
        </div>
      </div>

      {/* Tiers list */}
      <div className="space-y-3">
        {localTiers.map((tier, index) => (
          <div
            key={tier.tier_number}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-achatons-orange transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="text-lg font-semibold text-achatons-brown">
                  Palier {tier.tier_number}
                </div>
                <Input
                  type="text"
                  value={tier.label || ''}
                  onChange={(e) => updateTier(index, 'label', e.target.value)}
                  placeholder={getTierLabels()[index] || `Palier ${tier.tier_number}`}
                  className="w-32 h-8 text-sm"
                />
              </div>
              {localTiers.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTier(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-600">Minimum de participants</Label>
                <Input
                  type="number"
                  value={tier.min_participants}
                  onChange={(e) => updateTier(index, 'min_participants', e.target.value)}
                  min="1"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Prix (FCFA)</Label>
                <Input
                  type="number"
                  value={tier.price}
                  onChange={(e) => updateTier(index, 'price', e.target.value)}
                  min="0"
                  step="10"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-600">
              Réduction : <span className="font-semibold text-achatons-green">
                -{tier.discount_percentage.toFixed(1)}%
              </span>
              {' '}({formatPrice(basePrice - tier.price)} d'économie)
            </div>
          </div>
        ))}
      </div>

      {/* Add tier button */}
      {localTiers.length < 5 && (
        <Button
          type="button"
          variant="outline"
          onClick={addTier}
          className="w-full border-2 border-dashed border-gray-300 hover:border-achatons-orange hover:bg-achatons-cream"
          disabled={!basePrice || basePrice === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un Palier
        </Button>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800 mb-1">Erreurs de configuration :</p>
              <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {localTiers.length > 0 && errors.length === 0 && basePrice > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-achatons-orange/30">
          <p className="text-sm font-semibold mb-3 text-achatons-brown">Prévisualisation :</p>
          <TierProgressBar
            tiers={localTiers}
            currentParticipants={0}
            currentTier={0}
            basePrice={basePrice}
            showLabels
          />
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {localTiers.map((tier) => (
              <div
                key={tier.tier_number}
                className="p-2 bg-white rounded border border-gray-200 text-center"
              >
                <div className="text-xs text-gray-600">{tier.label || `Palier ${tier.tier_number}`}</div>
                <div className="font-bold text-achatons-orange">{formatPrice(tier.price)}</div>
                <div className="text-xs text-gray-500">à {tier.min_participants} pers.</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
