import { useMemo } from 'react';
import type { PricingTier, PricingCalculation } from '../types/pricing';

export function usePriceCalculation(
  totalQuantity: number,
  tiers: PricingTier[],
  basePrice: number
): PricingCalculation {
  const currentTier = useMemo(() => {
    if (!tiers || tiers.length === 0) return 0;

    // Trouve le palier le plus élevé dont le seuil est atteint
    const activeTiers = tiers.filter(t => totalQuantity >= t.min_participants);
    return activeTiers.length > 0
      ? Math.max(...activeTiers.map(t => t.tier_number))
      : 0;
  }, [totalQuantity, tiers]);

  const currentPrice = useMemo(() => {
    if (!tiers || tiers.length === 0) return basePrice;
    if (currentTier === 0) return basePrice;

    const tier = tiers.find(t => t.tier_number === currentTier);
    return tier ? tier.price : basePrice;
  }, [currentTier, tiers, basePrice]);

  const nextTier = useMemo(() => {
    if (!tiers || tiers.length === 0) return null;
    return tiers.find(t => t.tier_number === currentTier + 1) || null;
  }, [currentTier, tiers]);

  const quantityToNextTier = useMemo(() => {
    if (!nextTier) return null;
    return Math.max(0, nextTier.min_participants - totalQuantity);
  }, [nextTier, totalQuantity]);

  const savingsFromBase = useMemo(() => {
    return basePrice - currentPrice;
  }, [basePrice, currentPrice]);

  const maxPossibleSavings = useMemo(() => {
    if (!tiers || tiers.length === 0) return 0;
    const lastTier = tiers[tiers.length - 1];
    return basePrice - lastTier.price;
  }, [tiers, basePrice]);

  const discountPercentage = useMemo(() => {
    if (savingsFromBase === 0) return 0;
    return (savingsFromBase / basePrice) * 100;
  }, [savingsFromBase, basePrice]);

  return {
    currentTier,
    currentPrice,
    nextTier,
    quantityToNextTier,
    savingsFromBase,
    maxPossibleSavings,
    discountPercentage
  };
}
