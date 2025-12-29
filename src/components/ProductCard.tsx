
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Eye, Medal, TrendingUp } from "lucide-react";
import ShareButton from "./ShareButton";
import ProductDetailsModal from "./ProductDetailsModal";
import { useState } from "react";
import { TierProgressBar } from "./tiers/TierProgressBar";
import { NudgeMessage } from "./tiers/NudgeMessage";
import { TierPricingDisplay } from "./tiers/TierPricingDisplay";
import { usePriceCalculation } from "../hooks/usePriceCalculation";
import type { PricingTier } from "../types/pricing";

interface Product {
  id: number;
  originalId: string; // Ajout de l'UUID original
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

interface ProductCardProps {
  product: Product;
  onJoinGroup: () => void;
}

const ProductCard = ({ product, onJoinGroup }: ProductCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if this product uses tiered pricing
  const hasTieredPricing = product.pricing_model === 'tiered' && product.pricing_tiers && product.pricing_tiers.length > 0;

  // Safely calculate values with defaults
  const originalPrice = product.originalPrice || 0;
  const groupPrice = product.groupPrice || 0;
  const currentParticipants = product.currentParticipants || 0;
  const targetParticipants = product.targetParticipants || 1;
  const savings = product.savings || (originalPrice > 0 && groupPrice > 0 && originalPrice > groupPrice
    ? Math.round(((originalPrice - groupPrice) / originalPrice) * 100)
    : 0);

  // Use tiered pricing calculation if available
  const basePrice = hasTieredPricing ? (product.base_price || originalPrice) : originalPrice;
  const pricingTiers = hasTieredPricing ? product.pricing_tiers! : [];
  const totalQuantity = product.totalQuantity || 0;

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
      month: 'long'
    });
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] bg-white border-2 hover:border-achatons-orange cursor-pointer group" onClick={() => setIsModalOpen(true)}>
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Tier Badge (top left) */}
          {hasTieredPricing && currentTier > 0 && (
            <Badge className={`absolute top-3 left-3 ${
              currentTier === 1 ? 'bg-orange-500' :
              currentTier === 2 ? 'bg-gray-400' :
              'bg-yellow-500'
            } text-white px-3 py-1 flex items-center gap-1 shadow-lg animate-pulse`}>
              <Medal className="h-3 w-3" />
              <span className="font-bold">Palier {currentTier}</span>
            </Badge>
          )}

          {/* Discount Badge (top right) */}
          {displaySavings > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              -{Math.round(displaySavings)}%
            </div>
          )}

          {/* Share Button (moved to bottom left) */}
          <div className="absolute bottom-3 left-3" onClick={(e) => e.stopPropagation()}>
            <ShareButton
              productName={product.name}
              productPrice={formatPrice(displayPrice)}
              productUrl="/products"
              offer={hasTieredPricing ? {
                name: product.name,
                base_price: product.base_price || product.originalPrice,
                current_price: product.current_price || displayPrice,
                current_participants: product.currentParticipants,
                total_quantity: product.totalQuantity,
                current_tier: product.current_tier,
                pricing_tiers: product.pricing_tiers
              } : undefined}
            />
          </div>

          {/* View Icon (bottom right) */}
          <div className="absolute bottom-3 right-3 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors shadow-lg group-hover:scale-110">
            <Eye className="h-4 w-4" />
          </div>
        </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-achatons-brown mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{product.supplier}</span>
        </div>

        <div className="space-y-3">
          {/* Pricing Display - Use TierPricingDisplay for tiered products */}
          {hasTieredPricing ? (
            <TierPricingDisplay
              currentPrice={displayPrice}
              basePrice={basePrice}
              currentTier={currentTier}
              tiers={pricingTiers}
              compact
            />
          ) : (
            <div className="flex justify-between items-baseline">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-achatons-orange">
                  {formatPrice(displayPrice)}
                </span>
                {displaySavings > 0 && (
                  <span className="text-sm bg-achatons-green text-white px-2 py-0.5 rounded">
                    -{Math.round(displaySavings)}%
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(basePrice)}
              </span>
            </div>
          )}

          <div className="space-y-2">
            {/* Progress Bar - Use TierProgressBar for tiered products */}
            {hasTieredPricing ? (
              <TierProgressBar
                tiers={pricingTiers}
                currentQuantity={totalQuantity}
                currentTier={currentTier}
                basePrice={basePrice}
                animated
                compact
              />
            ) : (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{currentParticipants}/{targetParticipants} participants</span>
              </div>
            )}

            {/* Nudge Message for tiered products */}
            {hasTieredPricing && nextTier && (
              <NudgeMessage
                currentQuantity={totalQuantity}
                currentTier={currentTier}
                nextTier={nextTier}
                currentPrice={displayPrice}
                deadline={product.deadline}
                compact
              />
            )}

            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                Fin le {formatDate(product.deadline)}
              </span>
              <span className={`font-semibold ${daysLeft <= 3 ? 'text-red-500' : 'text-achatons-green'}`}>
                {daysLeft > 0 ? `${daysLeft} jours` : 'Expiré'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            onJoinGroup();
          }}
          className="w-full bg-achatons-orange hover:bg-achatons-brown text-white font-semibold py-3 transition-colors"
          disabled={daysLeft <= 0 || progressPercentage >= 100}
        >
          {progressPercentage >= 100 ? 'Objectif atteint' : 
           daysLeft <= 0 ? 'Offre expirée' : 
           'Rejoindre le groupe d\'achat'}
        </Button>
      </CardFooter>
      </Card>

      <ProductDetailsModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onJoinGroup={onJoinGroup}
      />
    </>
  );
};

export default ProductCard;
