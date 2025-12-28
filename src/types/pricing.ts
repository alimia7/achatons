export interface PricingTier {
  tier_number: number;
  min_participants: number;
  price: number;
  label?: string;
  discount_percentage: number;
}

export interface TierMilestone {
  tier_number: number;
  reached_at: string;
  participants_count: number;
  price_at_unlock: number;
}

export interface OfferWithTiers {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category_id: string;
  supplier: string;
  seller_id?: string;
  unit_of_measure: string;
  deadline: string;
  status: 'active' | 'inactive';
  start_date?: string;

  // Pricing model
  pricing_model: 'fixed' | 'tiered';
  base_price: number;
  pricing_tiers: PricingTier[];

  // Current state
  current_price: number;
  current_participants: number;
  total_quantity: number;
  current_tier: number;
  next_tier_quantity: number | null;

  // Legacy fields (for backward compatibility)
  original_price: number;
  group_price: number;
  target_participants: number;

  // Statistics
  total_revenue?: number;
  tier_history?: TierMilestone[];

  // Seller info
  sellerLogo?: string | null;
  sellerName?: string | null;
}

export type PricingCalculation = {
  currentTier: number;
  currentPrice: number;
  nextTier: PricingTier | null;
  quantityToNextTier: number | null;
  savingsFromBase: number;
  maxPossibleSavings: number;
  discountPercentage: number;
};
