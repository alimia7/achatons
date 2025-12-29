import { doc, runTransaction, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import type { OfferWithTiers, PricingTier, TierMilestone } from '../types/pricing';

/**
 * Calcule le palier actuel et le prix basé sur la quantité totale commandée
 */
function calculateCurrentTierAndPrice(
  totalQuantity: number,
  tiers: PricingTier[],
  basePrice: number
): { currentTier: number; currentPrice: number; nextTierQuantity: number | null } {
  if (!tiers || tiers.length === 0) {
    return {
      currentTier: 0,
      currentPrice: basePrice,
      nextTierQuantity: null
    };
  }

  // Trouve le palier le plus élevé dont le seuil est atteint
  const activeTiers = tiers.filter(t => totalQuantity >= t.min_participants);
  const currentTier = activeTiers.length > 0
    ? Math.max(...activeTiers.map(t => t.tier_number))
    : 0;

  // Trouve le prix correspondant
  let currentPrice = basePrice;
  if (currentTier > 0) {
    const tier = tiers.find(t => t.tier_number === currentTier);
    if (tier) {
      currentPrice = tier.price;
    }
  }

  // Trouve le prochain palier
  const nextTier = tiers.find(t => t.tier_number === currentTier + 1);
  const nextTierQuantity = nextTier ? nextTier.min_participants : null;

  return { currentTier, currentPrice, nextTierQuantity };
}

/**
 * Met à jour une offre après une nouvelle participation
 * - Incrémente le nombre de participants (personnes)
 * - Incrémente la quantité totale commandée
 * - Recalcule le palier et le prix actuel basé sur la quantité totale
 * - Ajoute un milestone si un nouveau palier est débloqué
 */
export async function updateOfferAfterParticipation(
  offerId: string,
  quantity: number = 1
): Promise<void> {
  const offerRef = doc(db, 'offers', offerId);

  await runTransaction(db, async (transaction) => {
    const offerDoc = await transaction.get(offerRef);

    if (!offerDoc.exists()) {
      throw new Error('Offre introuvable');
    }

    const offer = offerDoc.data() as any;

    // Incrémenter le nombre de participants (personnes) de 1
    const newParticipantCount = (offer.current_participants || 0) + 1;

    // Incrémenter la quantité totale commandée
    const newTotalQuantity = (offer.total_quantity || 0) + quantity;

    // Calculer le nouveau palier et prix
    const hasTieredPricing = offer.pricing_model === 'tiered' && offer.pricing_tiers && offer.pricing_tiers.length > 0;

    let updates: any = {
      current_participants: newParticipantCount,
      total_quantity: newTotalQuantity,
      updated_at: new Date().toISOString()
    };

    if (hasTieredPricing) {
      // Les paliers se basent sur la quantité totale, pas le nombre de participants
      const { currentTier, currentPrice, nextTierQuantity } = calculateCurrentTierAndPrice(
        newTotalQuantity,
        offer.pricing_tiers,
        offer.base_price || offer.original_price
      );

      const previousTier = offer.current_tier || 0;
      const tierUnlocked = currentTier > previousTier;

      updates.current_tier = currentTier;
      updates.current_price = currentPrice;
      updates.next_tier_quantity = nextTierQuantity;

      // Calculer le revenu total
      const participationRevenue = currentPrice * quantity;
      updates.total_revenue = (offer.total_revenue || 0) + participationRevenue;

      // Si un nouveau palier a été débloqué, ajouter un milestone
      if (tierUnlocked) {
        const milestone: TierMilestone = {
          tier_number: currentTier,
          reached_at: new Date().toISOString(),
          participants_count: newParticipantCount,
          price_at_unlock: currentPrice
        };

        const existingHistory = offer.tier_history || [];
        updates.tier_history = [...existingHistory, milestone];
      }
    }

    transaction.update(offerRef, updates);
  });
}

/**
 * Recalcule toutes les statistiques d'une offre basées uniquement sur les participations validées
 * Cette fonction doit être appelée lors de la validation ou de l'annulation de participations
 */
export async function recalculateOfferStats(offerId: string): Promise<{ tierUnlocked: boolean; newTierNumber: number; newPrice: number }> {
  const offerRef = doc(db, 'offers', offerId);

  let tierUnlocked = false;
  let newTierNumber = 0;
  let newPrice = 0;

  await runTransaction(db, async (transaction) => {
    const offerDoc = await transaction.get(offerRef);

    if (!offerDoc.exists()) {
      throw new Error('Offre introuvable');
    }

    const offer = offerDoc.data() as any;

    // Récupérer toutes les participations validées pour cette offre
    const participationsQuery = query(
      collection(db, 'participations'),
      where('offer_id', '==', offerId),
      where('status', '==', 'validated')
    );
    const participationsSnap = await getDocs(participationsQuery);

    // Calculer le nombre total de participants et la quantité totale
    let totalParticipants = 0;
    let totalQuantity = 0;
    participationsSnap.forEach((docSnap) => {
      const data = docSnap.data();
      totalParticipants += 1;
      totalQuantity += data.quantity || 0;
    });

    // Calculer le nouveau palier et prix
    const hasTieredPricing = offer.pricing_model === 'tiered' && offer.pricing_tiers && offer.pricing_tiers.length > 0;

    let updates: any = {
      current_participants: totalParticipants,
      total_quantity: totalQuantity,
      updated_at: new Date().toISOString()
    };

    if (hasTieredPricing) {
      const previousTier = offer.current_tier || 0;

      // Les paliers se basent sur la quantité totale, pas le nombre de participants
      const { currentTier, currentPrice, nextTierQuantity } = calculateCurrentTierAndPrice(
        totalQuantity,
        offer.pricing_tiers,
        offer.base_price || offer.original_price
      );

      tierUnlocked = currentTier > previousTier;
      newTierNumber = currentTier;
      newPrice = currentPrice;

      updates.current_tier = currentTier;
      updates.current_price = currentPrice;
      updates.next_tier_quantity = nextTierQuantity;

      // Calculer le revenu total basé sur les participations validées
      let totalRevenue = 0;
      participationsSnap.forEach((docSnap) => {
        const data = docSnap.data();
        const quantity = data.quantity || 0;
        // Le prix actuel est appliqué à toutes les participations validées
        totalRevenue += currentPrice * quantity;
      });
      updates.total_revenue = totalRevenue;

      // Si un nouveau palier a été débloqué, ajouter un milestone
      if (tierUnlocked) {
        const milestone: TierMilestone = {
          tier_number: currentTier,
          reached_at: new Date().toISOString(),
          participants_count: totalParticipants,
          price_at_unlock: currentPrice
        };

        const existingHistory = offer.tier_history || [];
        updates.tier_history = [...existingHistory, milestone];
      }
    }

    transaction.update(offerRef, updates);
  });

  return { tierUnlocked, newTierNumber, newPrice };
}

/**
 * Récupère les statistiques d'une offre
 */
export async function getOfferStats(offerId: string) {
  const offerDoc = await getDoc(doc(db, 'offers', offerId));

  if (!offerDoc.exists()) {
    throw new Error('Offre introuvable');
  }

  const offer = offerDoc.data();
  const hasTieredPricing = offer.pricing_model === 'tiered' && offer.pricing_tiers;

  if (!hasTieredPricing) {
    return {
      currentParticipants: offer.current_participants || 0,
      totalQuantity: offer.total_quantity || 0,
      targetParticipants: offer.target_participants || 0,
      currentPrice: offer.group_price || offer.original_price,
      revenue: (offer.current_participants || 0) * (offer.group_price || 0)
    };
  }

  const { currentTier, currentPrice } = calculateCurrentTierAndPrice(
    offer.total_quantity || 0,
    offer.pricing_tiers,
    offer.base_price || offer.original_price
  );

  return {
    currentParticipants: offer.current_participants || 0,
    totalQuantity: offer.total_quantity || 0,
    targetQuantity: offer.pricing_tiers[offer.pricing_tiers.length - 1].min_participants,
    currentTier,
    currentPrice,
    revenue: offer.total_revenue || 0,
    tierHistory: offer.tier_history || []
  };
}
