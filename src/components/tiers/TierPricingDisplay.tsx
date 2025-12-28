import React from 'react';
import { Badge } from '../ui/badge';
import { Medal, Lock } from 'lucide-react';
import type { PricingTier } from '../../types/pricing';

interface TierPricingDisplayProps {
  currentPrice: number;
  basePrice: number;
  currentTier: number;
  tiers: PricingTier[];
  compact?: boolean;
  showAllTiers?: boolean;
}

export function TierPricingDisplay({
  currentPrice,
  basePrice,
  currentTier,
  tiers,
  compact = false,
  showAllTiers = false
}: TierPricingDisplayProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const discountPercentage = ((basePrice - currentPrice) / basePrice) * 100;
  const maxSavings = basePrice - tiers[tiers.length - 1].price;

  const getMedalIcon = (tierNumber: number) => {
    const colors = ['text-orange-400', 'text-gray-400', 'text-yellow-500'];
    return colors[tierNumber - 1] || 'text-gray-300';
  };

  const getNextTiers = () => {
    return tiers.filter(t => t.tier_number > currentTier);
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-achatons-orange">
              {formatPrice(currentPrice)}
            </span>
            {discountPercentage > 0 && (
              <Badge variant="secondary" className="bg-achatons-green text-white">
                -{discountPercentage.toFixed(0)}%
              </Badge>
            )}
          </div>
          <span className="text-sm text-gray-500 line-through">
            {formatPrice(basePrice)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-gradient-to-br from-achatons-cream to-white rounded-xl border-2 border-achatons-orange/20">
      {/* Prix actuel */}
      <div className="text-center">
        <div className="text-sm text-gray-600 mb-1">Prix actuel</div>
        <div className="flex items-center justify-center gap-3">
          <span className="text-4xl font-bold text-achatons-orange">
            {formatPrice(currentPrice)}
          </span>
          {discountPercentage > 0 && (
            <Badge className="bg-achatons-green text-white text-lg px-3 py-1">
              -{discountPercentage.toFixed(1)}%
            </Badge>
          )}
        </div>
        <div className="text-sm text-gray-500 line-through mt-1">
          Prix de base : {formatPrice(basePrice)}
        </div>
      </div>

      {/* Prochains paliers */}
      {showAllTiers && getNextTiers().length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <div className="text-sm font-semibold text-gray-700 mb-3">
            Prochains paliers :
          </div>
          <div className="space-y-2">
            {getNextTiers().map((tier) => (
              <div
                key={tier.tier_number}
                className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 hover:border-achatons-orange transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Medal className={`h-4 w-4 ${getMedalIcon(tier.tier_number)}`} />
                  <span className="text-sm font-medium">
                    {tier.label || `Palier ${tier.tier_number}`}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-achatons-orange">
                    {formatPrice(tier.price)}
                  </div>
                  <div className="text-xs text-gray-500">
                    à {tier.min_participants} pers.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Économie maximale */}
      {maxSavings > 0 && (
        <div className="bg-achatons-green/10 rounded-lg p-3 text-center border border-achatons-green/30">
          <div className="text-xs text-gray-600 mb-1">Économie maximale possible</div>
          <div className="text-2xl font-bold text-achatons-green">
            -{formatPrice(maxSavings)}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            si l'objectif final est atteint
          </div>
        </div>
      )}
    </div>
  );
}
