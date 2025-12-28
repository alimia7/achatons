import React from 'react';
import { Lock, Check } from 'lucide-react';
import type { PricingTier } from '../../types/pricing';

interface TierProgressBarProps {
  tiers: PricingTier[];
  currentQuantity: number;
  currentTier: number;
  basePrice: number;
  animated?: boolean;
  showLabels?: boolean;
  compact?: boolean;
}

export function TierProgressBar({
  tiers,
  currentQuantity,
  currentTier,
  basePrice,
  animated = true,
  showLabels = false,
  compact = false
}: TierProgressBarProps) {
  if (!tiers || tiers.length === 0) return null;

  const maxQuantity = tiers[tiers.length - 1].min_participants;

  const getTierStatus = (tier: PricingTier) => {
    if (currentQuantity >= tier.min_participants) {
      return 'completed';
    }
    if (tier.tier_number === currentTier + 1) {
      return 'in-progress';
    }
    return 'locked';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  return (
    <div className="space-y-3">
      {/* Barre de progression segmentée */}
      <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
        {tiers.map((tier, index) => {
          const status = getTierStatus(tier);
          const prevTierQuantity = index === 0 ? 0 : tiers[index - 1].min_participants;
          const segmentStart = (prevTierQuantity / maxQuantity) * 100;
          const segmentWidth = ((tier.min_participants - prevTierQuantity) / maxQuantity) * 100;

          // Calculer le remplissage dans ce segment
          let fillPercentage = 0;
          if (status === 'completed') {
            fillPercentage = 100;
          } else if (status === 'in-progress') {
            const quantityInSegment = currentQuantity - prevTierQuantity;
            const segmentSize = tier.min_participants - prevTierQuantity;
            fillPercentage = (quantityInSegment / segmentSize) * 100;
          }

          return (
            <div
              key={tier.tier_number}
              className="absolute top-0 bottom-0 border-r-2 border-white"
              style={{
                left: `${segmentStart}%`,
                width: `${segmentWidth}%`
              }}
            >
              {/* Fond du segment */}
              <div
                className={`h-full ${
                  status === 'locked'
                    ? 'bg-gray-200'
                    : status === 'in-progress'
                    ? 'bg-orange-100'
                    : 'bg-green-100'
                }`}
              />

              {/* Remplissage */}
              <div
                className={`absolute top-0 left-0 h-full ${
                  status === 'in-progress'
                    ? 'bg-gradient-to-r from-achatons-orange to-achatons-lightOrange'
                    : status === 'completed'
                    ? 'bg-achatons-green'
                    : ''
                } ${animated ? 'transition-all duration-500 ease-out' : ''}`}
                style={{ width: `${fillPercentage}%` }}
              />

              {/* Icône de statut */}
              {!compact && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {status === 'completed' ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : status === 'locked' ? (
                    <Lock className="h-3 w-3 text-gray-400" />
                  ) : null}
                </div>
              )}
            </div>
          );
        })}

        {/* Curseur de position actuelle */}
        {currentQuantity > 0 && currentQuantity < maxQuantity && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-achatons-brown z-10"
            style={{
              left: `${(currentQuantity / maxQuantity) * 100}%`
            }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-achatons-brown text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
              {currentQuantity}
            </div>
          </div>
        )}
      </div>

      {/* Labels des paliers */}
      {showLabels && (
        <div className="relative">
          <div className="flex justify-between text-xs">
            {tiers.map((tier, index) => {
              const status = getTierStatus(tier);
              const prevTierQuantity = index === 0 ? 0 : tiers[index - 1].min_participants;
              const position = ((prevTierQuantity + tier.min_participants) / 2 / maxQuantity) * 100;

              return (
                <div
                  key={tier.tier_number}
                  className="absolute transform -translate-x-1/2"
                  style={{ left: `${position}%` }}
                >
                  <div className="text-center">
                    <div className={`font-semibold ${
                      status === 'completed'
                        ? 'text-achatons-green'
                        : status === 'in-progress'
                        ? 'text-achatons-orange'
                        : 'text-gray-400'
                    }`}>
                      {tier.label || `Palier ${tier.tier_number}`}
                    </div>
                    <div className="text-gray-600 text-xs mt-0.5">
                      {tier.min_participants} unités
                    </div>
                    <div className={`font-bold text-xs mt-0.5 ${
                      status === 'completed'
                        ? 'text-achatons-green'
                        : status === 'in-progress'
                        ? 'text-achatons-orange'
                        : 'text-gray-500'
                    }`}>
                      {formatPrice(tier.price)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Version compacte avec info simple */}
      {compact && !showLabels && (
        <div className="flex justify-between text-xs text-gray-600">
          <span>{currentQuantity} unités</span>
          <span>Objectif: {maxQuantity}</span>
        </div>
      )}
    </div>
  );
}
