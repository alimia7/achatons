import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Clock,
  MapPin,
  Package,
  Lightbulb
} from "lucide-react";
import ShareButton from "./ShareButton";
import { TierProgressBar } from "./tiers/TierProgressBar";
import { NudgeMessage } from "./tiers/NudgeMessage";
import { TierPricingDisplay } from "./tiers/TierPricingDisplay";
import { usePriceCalculation } from "../hooks/usePriceCalculation";
import type { PricingTier } from "../types/pricing";

interface Product {
  id: number;
  originalId: string;
  name: string;
  description: string;
  originalPrice: number;
  groupPrice: number;
  savings: number;
  currentParticipants: number;
  totalQuantity: number;
  targetParticipants: number;
  deadline: string;
  image: string;
  supplier: string;
  unitOfMeasure?: string;
  sellerLogo?: string | null;
  sellerName?: string | null;

  // New tiered pricing fields (optional for backward compatibility)
  pricing_model?: 'fixed' | 'tiered';
  base_price?: number;
  pricing_tiers?: PricingTier[];
  current_price?: number;
  current_tier?: number;
}

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onJoinGroup: () => void;
}

const ProductDetailsModal = ({
  product,
  isOpen,
  onClose,
  onJoinGroup
}: ProductDetailsModalProps) => {
  if (!product) return null;

  // Check if this product uses tiered pricing
  const hasTieredPricing = product.pricing_model === 'tiered' && product.pricing_tiers && product.pricing_tiers.length > 0;

  // Safely calculate values with defaults
  const originalPrice = product.originalPrice || 0;
  const groupPrice = product.groupPrice || 0;
  const currentParticipants = product.currentParticipants || 0;
  const totalQuantity = product.totalQuantity || 0;
  const targetParticipants = product.targetParticipants || 1;
  const savings = product.savings || (originalPrice > 0 && groupPrice > 0 && originalPrice > groupPrice
    ? Math.round(((originalPrice - groupPrice) / originalPrice) * 100)
    : 0);

  // Use tiered pricing calculation if available
  const basePrice = hasTieredPricing ? (product.base_price || originalPrice) : originalPrice;
  const pricingTiers = hasTieredPricing ? product.pricing_tiers! : [];

  const { currentPrice, currentTier, nextTier, discountPercentage } = usePriceCalculation(
    totalQuantity,
    pricingTiers,
    basePrice
  );

  // Use calculated current price for tiered, fallback to groupPrice for legacy
  const displayPrice = hasTieredPricing ? currentPrice : groupPrice;
  const displaySavings = hasTieredPricing ? discountPercentage : savings;

  const progressPercentage = targetParticipants > 0
    ? Math.min(100, Math.max(0, (currentParticipants / targetParticipants) * 100))
    : 0;

  const daysLeft = Math.ceil((new Date(product.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const formatPrice = (price: number) => {
    if (!price || isNaN(price) || price <= 0) return '0 FCFA';
    return new Intl.NumberFormat('fr-FR').format(Math.round(price)) + ' FCFA';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTimeLeft = (dateString: string) => {
    const now = new Date();
    const deadline = new Date(dateString);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Expiré";
    if (diffDays === 1) return "1 jour";
    return `${diffDays} jours`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        aria-describedby="product-details-description"
      >
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl text-achatons-brown mb-2">
                {product.name}
              </DialogTitle>
              <DialogDescription id="product-details-description" className="text-gray-600">
                Détails complets du produit
              </DialogDescription>
            </div>
            <ShareButton
              productName={product.name}
              productPrice={formatPrice(displayPrice)}
              productUrl={`/offer/${product.originalId}`}
              offer={hasTieredPricing ? {
                name: product.name,
                base_price: basePrice,
                current_price: displayPrice,
                current_participants: currentParticipants,
                total_quantity: totalQuantity,
                current_tier: currentTier,
                pricing_tiers: pricingTiers
              } : undefined}
            />
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Image et informations principales */}
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-64 lg:h-80 object-cover rounded-lg"
              />
              {displaySavings > 0 && (
                <Badge className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 text-sm font-semibold">
                  -{Math.round(displaySavings)}%
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="font-medium">Fournisseur :</span>
                <span className="ml-2 text-achatons-brown font-semibold">{product.supplier}</span>
              </div>

              {product.sellerName && (
                <div className="flex items-center text-sm text-gray-600">
                  <div className="h-4 w-4 mr-2 flex items-center justify-center">
                    {product.sellerLogo ? (
                      <img 
                        src={product.sellerLogo} 
                        alt={product.sellerName}
                        className="h-6 w-6 rounded-full object-cover border border-gray-300"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-achatons-orange flex items-center justify-center text-white text-xs font-semibold">
                        {product.sellerName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="font-medium">Vendeur :</span>
                  <span className="ml-2 text-achatons-brown font-semibold">{product.sellerName}</span>
                </div>
              )}

              <div className="flex items-center text-sm text-gray-600">
                <Package className="h-4 w-4 mr-2" />
                <span className="font-medium">Unité :</span>
                <span className="ml-2 text-achatons-brown font-semibold">
                  {product.unitOfMeasure || 'pièce'}
                </span>
              </div>
            </div>
          </div>

          {/* Détails et actions */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-achatons-brown mb-2">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Prix et économies */}
            <div>
              {hasTieredPricing ? (
                <TierPricingDisplay
                  currentPrice={displayPrice}
                  basePrice={basePrice}
                  currentTier={currentTier}
                  tiers={pricingTiers}
                  showAllTiers
                />
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between items-baseline">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-achatons-orange">
                        {formatPrice(displayPrice)}
                      </span>
                      {displaySavings > 0 && (
                        <Badge className="bg-achatons-green text-white">
                          -{Math.round(displaySavings)}%
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(basePrice)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Progression */}
            <div className="space-y-3">
              {hasTieredPricing ? (
                <>
                  <TierProgressBar
                    tiers={pricingTiers}
                    currentQuantity={totalQuantity}
                    currentTier={currentTier}
                    basePrice={basePrice}
                    animated
                    showLabels
                  />

                  {nextTier && (
                    <NudgeMessage
                      currentQuantity={totalQuantity}
                      currentTier={currentTier}
                      nextTier={nextTier}
                      currentPrice={displayPrice}
                      deadline={product.deadline}
                    />
                  )}
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {currentParticipants}/{targetParticipants} participants
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {progressPercentage >= 100
                      ? "Objectif atteint ! Le groupe d'achat est complet."
                      : `Il reste ${targetParticipants - currentParticipants} ${product.unitOfMeasure || 'pièces'} à atteindre l'objectif.`
                    }
                  </p>
                </>
              )}
            </div>

            {/* Date limite */}
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-orange-700">
                  <Clock className="h-5 w-5 mr-2" />
                  <div>
                    <p className="font-semibold">Date limite</p>
                    <p className="text-sm">{formatDate(product.deadline)}</p>
                  </div>
                </div>
                <Badge 
                  variant={daysLeft <= 3 ? "destructive" : "secondary"}
                  className="font-semibold"
                >
                  {formatTimeLeft(product.deadline)}
                </Badge>
              </div>
            </div>

            {/* Bouton d'action */}
            <div className="pt-4">
              <Button 
                onClick={onJoinGroup}
                className="w-full bg-achatons-orange hover:bg-achatons-brown text-white font-semibold py-4 text-lg transition-colors"
                disabled={daysLeft <= 0 || progressPercentage >= 100}
              >
                {progressPercentage >= 100 ? '🎉 Objectif atteint' : 
                 daysLeft <= 0 ? '⏰ Offre expirée' : 
                 '🚀 Rejoindre le groupe d\'achat'}
              </Button>
              
              {daysLeft > 0 && progressPercentage < 100 && displaySavings > 0 && (
                <p className="text-center text-sm text-gray-600 mt-2">
                  Rejoignez maintenant et économisez {Math.round(displaySavings)}% !
                </p>
              )}
            </div>

            {/* Section explicative pour les paliers */}
            {hasTieredPricing && (
              <Accordion type="single" collapsible className="mt-6">
                <AccordionItem value="how-it-works">
                  <AccordionTrigger className="text-achatons-brown">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      <span>Comment fonctionne l'achat groupé ?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 text-sm text-gray-700">
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Rejoignez le groupe au prix actuel</li>
                        <li>Plus il y a de participants, plus le prix baisse pour tout le monde</li>
                        <li>Invitez vos amis pour débloquer les paliers suivants</li>
                        <li>À la date de fin, tout le monde paie le prix final atteint</li>
                      </ol>

                      <div className="mt-4 p-4 bg-achatons-cream rounded-lg border border-achatons-orange/20">
                        <p className="font-semibold mb-2 text-achatons-brown">Tableau des paliers :</p>
                        <div className="space-y-2">
                          {pricingTiers.map((tier, index) => (
                            <div
                              key={tier.tier_number}
                              className={`flex justify-between items-center p-2 rounded ${
                                tier.tier_number <= currentTier
                                  ? 'bg-achatons-green/10 border border-achatons-green/30'
                                  : 'bg-white border border-gray-200'
                              }`}
                            >
                              <span className="font-medium">
                                {tier.tier_number <= currentTier && '✅ '}
                                Palier {tier.tier_number} ({tier.min_participants} personnes)
                              </span>
                              <div className="text-right">
                                <span className={`font-bold ${
                                  tier.tier_number <= currentTier
                                    ? 'text-achatons-green'
                                    : 'text-gray-700'
                                }`}>
                                  {formatPrice(tier.price)}
                                </span>
                                <span className="text-xs text-gray-500 ml-2">
                                  (-{tier.discount_percentage.toFixed(1)}%)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal; 