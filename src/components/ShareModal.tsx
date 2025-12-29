import React, { useState } from 'react';
import { X, Share2, Copy, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import type { OfferWithTiers } from '../types/pricing';

interface ShareModalProps {
  offer: OfferWithTiers;
  onClose: () => void;
}

export function ShareModal({ offer, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const shareUrl = `${window.location.origin}/offer/${offer.id}?utm_source=share&utm_medium=social`;

  const nextTier = offer.pricing_tiers.find(
    t => t.tier_number === offer.current_tier + 1
  );

  // Calculer l'économie réalisée
  const savings = offer.base_price - offer.current_price;
  const savingsPercent = Math.round((savings / offer.base_price) * 100);

  // Calculer combien de personnes/unités manquent pour le prochain palier
  const remainingForNextTier = nextTier
    ? nextTier.min_participants - (offer.total_quantity || offer.current_participants)
    : 0;

  // Message personnalisé avec un ton chaleureux et incitatif
  const shareMessage = nextTier
    ? `🔥 Hey ! Rejoins-moi vite sur Achat'ons !

Je viens de rejoindre un groupe d'achat pour "${offer.name}" et on est déjà ${offer.current_participants || 0} personnes !

💰 Prix actuel : ${formatPrice(offer.current_price)} au lieu de ${formatPrice(offer.base_price)}
Tu économises déjà ${formatPrice(savings)} (${savingsPercent}%) !

🚀 Mais attends, ça peut être ENCORE MIEUX !

Si on arrive à ${nextTier.min_participants} unités (il manque juste ${remainingForNextTier} unités), le prix descend à ${formatPrice(nextTier.price)} pour TOUT LE MONDE !

💎 Ça fait ${formatPrice(offer.current_price - nextTier.price)} d'économie supplémentaire !

Plus on est nombreux, moins on paie ! Alors rejoins-nous maintenant 👇
${shareUrl}

#AchatGroupé #BonPlan #EnsembleOnÉconomise`
    : `🎉 Incroyable ! Rejoins-moi sur Achat'ons !

On a atteint le meilleur prix pour "${offer.name}" grâce à notre groupe d'achat !

💰 ${formatPrice(offer.current_price)} au lieu de ${formatPrice(offer.base_price)}
🎯 ${formatPrice(savings)} d'économie (${savingsPercent}%) !

On est déjà ${offer.current_participants || 0} personnes à profiter de ce super prix. Rejoins-nous avant que l'offre se termine !

👇 Clique ici pour en profiter aussi
${shareUrl}

#AchatGroupé #MeilleurPrix #BonPlan`;


  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-achatons-brown">
            <Share2 className="h-5 w-5" />
            Participation validée !
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Message de félicitations */}
          <div className="text-center py-4">
            <div className="text-6xl mb-2">🎉</div>
            <p className="text-lg font-semibold text-achatons-brown mb-2">
              Super ! Votre demande a été enregistrée !
            </p>
            <p className="text-sm text-gray-600">
              {nextTier
                ? `Partagez avec vos amis pour qu'ensemble on atteigne le palier suivant et qu'on profite tous d'un meilleur prix !`
                : `Partagez cette super offre avec vos amis pour qu'ils en profitent aussi !`
              }
            </p>
          </div>

          {/* Info du prochain palier */}
          {nextTier && (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-achatons-orange rounded-lg p-4">
              <div className="text-center">
                <div className="text-sm font-semibold text-achatons-brown mb-2">
                  🎯 Objectif : Atteindre ensemble {nextTier.min_participants} unités !
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  Il manque seulement {remainingForNextTier} unité{remainingForNextTier > 1 ? 's' : ''}
                </div>
                <div className="bg-white rounded-lg p-3 mb-2">
                  <div className="text-2xl font-bold text-achatons-orange">
                    {formatPrice(nextTier.price)}
                  </div>
                  <div className="text-xs text-green-600 font-semibold mt-1">
                    -{formatPrice(offer.current_price - nextTier.price)} pour tous !
                  </div>
                </div>
                <div className="text-xs font-semibold text-achatons-brown">
                  Plus on est nombreux, moins on paie ! 💪
                </div>
              </div>
            </div>
          )}

          {/* Boutons de partage */}
          <div className="space-y-2">
            <Button
              onClick={handleWhatsAppShare}
              className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Partager sur WhatsApp
            </Button>

            <Button
              onClick={handleFacebookShare}
              className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Partager sur Facebook
            </Button>

            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="w-full"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Lien copié !
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copier le lien
                </>
              )}
            </Button>
          </div>

          {/* Bouton "Plus tard" */}
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full"
          >
            Plus tard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
