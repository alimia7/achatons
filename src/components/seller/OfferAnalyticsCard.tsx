import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { TierProgressBar } from '../tiers/TierProgressBar';
import { NudgeMessage } from '../tiers/NudgeMessage';
import { usePriceCalculation } from '../../hooks/usePriceCalculation';
import { Calendar, DollarSign, Users, TrendingUp, Eye, Trash2 } from 'lucide-react';
import type { PricingTier } from '../../types/pricing';

interface OfferAnalyticsCardProps {
  offer: any;
  onViewDetails: () => void;
  onDelete?: () => void;
  onToggleStatus?: () => void;
}

export function OfferAnalyticsCard({ offer, onViewDetails, onDelete, onToggleStatus }: OfferAnalyticsCardProps) {
  const hasTieredPricing = offer.pricing_model === 'tiered' && offer.pricing_tiers && offer.pricing_tiers.length > 0;

  const { currentTier, currentPrice, nextTier } = usePriceCalculation(
    offer.total_quantity || 0,
    hasTieredPricing ? offer.pricing_tiers : [],
    hasTieredPricing ? (offer.base_price || offer.original_price) : offer.original_price
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const daysLeft = Math.ceil(
    (new Date(offer.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-achatons-orange">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-1">{offer.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>Expire le {formatDate(offer.deadline)}</span>
              <span className={`font-semibold ${daysLeft <= 3 ? 'text-red-500' : 'text-achatons-green'}`}>
                ({daysLeft}j)
              </span>
            </div>
          </div>
          {hasTieredPricing && (
            <Badge className={`${
              currentTier === 0 ? 'bg-gray-400' :
              currentTier === 1 ? 'bg-orange-400' :
              currentTier === 2 ? 'bg-gray-400' :
              'bg-yellow-500'
            } text-white`}>
              {currentTier === 0 ? 'Démarrage' : `Palier ${currentTier}`}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {hasTieredPricing ? (
          <>
            {/* Barre de progression des paliers */}
            <div>
              <TierProgressBar
                tiers={offer.pricing_tiers}
                currentQuantity={offer.total_quantity || 0}
                currentTier={currentTier}
                basePrice={offer.base_price || offer.original_price}
                animated
                compact
              />
            </div>

            {/* Stats en grille 2x2 */}
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
                  <DollarSign className="h-3 w-3" />
                  <span>Prix actuel</span>
                </div>
                <div className="text-lg font-bold text-achatons-orange">
                  {formatPrice(currentPrice)}
                </div>
              </div>

              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>Revenu total</span>
                </div>
                <div className="text-lg font-bold text-achatons-green">
                  {formatPrice(offer.total_revenue || 0)}
                </div>
              </div>

              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>Quantité totale</span>
                </div>
                <div className="text-lg font-bold text-blue-700">
                  {offer.total_quantity || 0}
                  <span className="text-sm text-gray-500">
                    /{offer.pricing_tiers[offer.pricing_tiers.length - 1].min_participants}
                  </span>
                </div>
              </div>

              <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
                  <Users className="h-3 w-3" />
                  <span>Participants</span>
                </div>
                <div className="text-lg font-bold text-purple-700">
                  {offer.current_participants || 0}
                </div>
              </div>
            </div>

            {/* Message motivant */}
            {nextTier && (
              <NudgeMessage
                currentQuantity={offer.total_quantity || 0}
                currentTier={currentTier}
                nextTier={nextTier}
                currentPrice={currentPrice}
                deadline={offer.deadline}
                compact
              />
            )}
          </>
        ) : (
          // Affichage pour prix fixe
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-600">Prix groupé</div>
                <div className="text-lg font-bold text-achatons-orange">
                  {formatPrice(offer.group_price)}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-600">Participants</div>
                <div className="text-lg font-bold">
                  {offer.current_participants || 0}/{offer.target_participants}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="space-y-2">
          <Button
            onClick={onViewDetails}
            className="w-full bg-achatons-orange hover:bg-achatons-brown"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            Voir les détails
          </Button>

          <div className="flex gap-2">
            {onToggleStatus && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStatus();
                }}
                variant="outline"
                size="sm"
                className={`flex-1 ${
                  offer.status === 'active'
                    ? 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-300'
                    : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-300'
                }`}
              >
                {offer.status === 'active' ? 'Désactiver' : 'Activer'}
              </Button>
            )}
            {onDelete && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                variant="destructive"
                size="sm"
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
