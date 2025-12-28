# Guide d'Utilisation : Système de Paliers Dégressifs

## Vue d'ensemble

Le système de paliers dégressifs transforme l'expérience d'achat groupé en permettant au prix de diminuer automatiquement à mesure que plus de personnes rejoignent le groupe.

## 🎯 Pour les Utilisateurs

### Comment ça marche ?

1. **Rejoignez au prix actuel** : Le prix que vous voyez est le prix actuel basé sur le nombre de participants
2. **Le prix baisse automatiquement** : Plus il y a de participants, plus le prix baisse pour TOUT LE MONDE
3. **Partagez pour économiser** : Invitez vos amis pour débloquer les paliers suivants
4. **Payez le prix final** : À la fin de l'offre, tout le monde paie le prix du dernier palier atteint

### Interface

Vous verrez :
- **Prix actuel** en gros et en couleur
- **Prix de base** barré (prix sans réduction)
- **Barre de progression segmentée** montrant les paliers
- **Message motivant** indiquant combien de personnes manquent pour le prochain palier
- **Tableau des paliers** dans les détails du produit

## 🏪 Pour les Vendeurs

### Créer une offre avec paliers

1. **Accédez au Dashboard Vendeur** → Onglet "Offres" → "Nouvelle Offre"

2. **Définissez le prix de base** (prix retail sans réduction)
   ```
   Exemple : 3 300 FCFA
   ```

3. **Créez vos paliers** avec le composant TierBuilder :
   ```
   Palier 1 : 10 personnes → 3 100 FCFA (-6%)
   Palier 2 : 25 personnes → 2 950 FCFA (-10.6%)
   Palier 3 : 50 personnes → 2 850 FCFA (-13.6%)
   ```

4. **Bonnes pratiques** :
   - Créez 2-4 paliers pour une meilleure UX
   - Augmentez progressivement les seuils (ex: 10, 25, 50)
   - Réductions raisonnables (5-15% entre paliers)
   - Le dernier palier = objectif final

### Exemple de configuration

```typescript
{
  pricing_model: 'tiered',
  base_price: 3300,
  pricing_tiers: [
    {
      tier_number: 1,
      min_participants: 10,
      price: 3100,
      label: 'Bronze',
      discount_percentage: 6
    },
    {
      tier_number: 2,
      min_participants: 25,
      price: 2950,
      label: 'Silver',
      discount_percentage: 10.6
    },
    {
      tier_number: 3,
      min_participants: 50,
      price: 2850,
      label: 'Gold',
      discount_percentage: 13.6
    }
  ]
}
```

## 💻 Pour les Développeurs

### Structure des données

#### Offre avec paliers (Firestore)

```typescript
interface OfferWithTiers {
  // Champs de base
  id: string;
  name: string;
  description: string;
  image_url: string;
  deadline: string;

  // Pricing model
  pricing_model: 'tiered';
  base_price: number;
  pricing_tiers: PricingTier[];

  // État actuel
  current_price: number;
  current_participants: number;
  current_tier: number;
  next_tier_participants: number | null;

  // Statistiques
  total_revenue: number;
  tier_history: TierMilestone[];
}
```

#### Palier de prix

```typescript
interface PricingTier {
  tier_number: number;
  min_participants: number;
  price: number;
  label?: string;
  discount_percentage: number;
}
```

### Composants disponibles

#### 1. TierProgressBar

Barre de progression segmentée affichant les paliers.

```tsx
import { TierProgressBar } from './components/tiers/TierProgressBar';

<TierProgressBar
  tiers={product.pricing_tiers}
  currentParticipants={product.current_participants}
  currentTier={product.current_tier}
  basePrice={product.base_price}
  animated={true}
  showLabels={true}
  compact={false}
/>
```

**Props:**
- `tiers`: Tableau des paliers
- `currentParticipants`: Nombre actuel de participants
- `currentTier`: Numéro du palier actuel
- `basePrice`: Prix de base
- `animated`: Active les animations (défaut: true)
- `showLabels`: Affiche les labels des paliers (défaut: false)
- `compact`: Mode compact (défaut: false)

#### 2. NudgeMessage

Message motivant pour encourager le partage.

```tsx
import { NudgeMessage } from './components/tiers/NudgeMessage';

<NudgeMessage
  currentParticipants={product.current_participants}
  currentTier={product.current_tier}
  nextTier={nextTier}
  currentPrice={product.current_price}
  deadline={product.deadline}
  compact={false}
/>
```

#### 3. TierPricingDisplay

Affichage détaillé des prix et paliers.

```tsx
import { TierPricingDisplay } from './components/tiers/TierPricingDisplay';

<TierPricingDisplay
  currentPrice={product.current_price}
  basePrice={product.base_price}
  currentTier={product.current_tier}
  tiers={product.pricing_tiers}
  compact={false}
  showAllTiers={true}
/>
```

#### 4. TierBuilder

Constructeur de paliers pour les formulaires vendeur.

```tsx
import { TierBuilder } from './components/seller/TierBuilder';

<TierBuilder
  basePrice={formData.base_price}
  tiers={formData.pricing_tiers}
  onChange={(tiers) => setFormData({...formData, pricing_tiers: tiers})}
/>
```

#### 5. ShareModal

Modal de partage post-participation.

```tsx
import { ShareModal } from './components/ShareModal';

<ShareModal
  offer={product}
  onClose={() => setShowShareModal(false)}
/>
```

### Hooks

#### usePriceCalculation

Calcule automatiquement le prix et le palier actuel.

```tsx
import { usePriceCalculation } from './hooks/usePriceCalculation';

const {
  currentTier,
  currentPrice,
  nextTier,
  participantsToNextTier,
  savingsFromBase,
  maxPossibleSavings,
  discountPercentage
} = usePriceCalculation(
  currentParticipants,
  pricingTiers,
  basePrice
);
```

### Fonctions utilitaires

#### updateOfferAfterParticipation

Met à jour une offre après une nouvelle participation.

```typescript
import { updateOfferAfterParticipation } from './lib/offerUpdates';

// Dans ContactModal après création de la participation
await updateOfferAfterParticipation(offerId, quantity);
```

Cette fonction :
- Incrémente `current_participants`
- Recalcule `current_tier` et `current_price`
- Met à jour `total_revenue`
- Ajoute un milestone dans `tier_history` si nouveau palier débloqué

## 📊 Migration des données existantes

Pour convertir une offre existante vers le modèle de paliers :

```typescript
// Offre ancienne
const oldOffer = {
  original_price: 3300,
  group_price: 2850,
  target_participants: 50
};

// Convertir vers paliers
const newOffer = {
  pricing_model: 'tiered',
  base_price: 3300,
  pricing_tiers: [
    { tier_number: 1, min_participants: 10, price: 3100, discount_percentage: 6 },
    { tier_number: 2, min_participants: 25, price: 2950, discount_percentage: 10.6 },
    { tier_number: 3, min_participants: 50, price: 2850, discount_percentage: 13.6 }
  ],
  current_price: 3300,
  current_tier: 0,
  next_tier_participants: 10,

  // Conserver pour compatibilité
  original_price: 3300,
  group_price: 2850,
  target_participants: 50
};
```

## 🎨 Personnalisation UI

### Couleurs des paliers

Les couleurs sont définies dans `tailwind.config.ts` :

```typescript
colors: {
  achatons: {
    orange: '#D2691E',  // Palier en cours
    green: '#2F5233',   // Palier atteint
    brown: '#8B4513',   // Texte principal
    cream: '#FFF8DC'    // Fond clair
  }
}
```

### Animations

Les animations sont activées par défaut et peuvent être désactivées :

```tsx
<TierProgressBar animated={false} />
```

## 🔄 Workflow complet

### Côté Utilisateur

```
1. Visite ProductList
   ↓
2. Voit ProductCard avec TierProgressBar
   ↓
3. Clique pour voir ProductDetailsModal
   ↓
4. Voit tous les paliers + explications
   ↓
5. Clique "Rejoindre"
   ↓
6. Remplit ContactModal
   ↓
7. Participation créée → updateOfferAfterParticipation()
   ↓
8. ShareModal s'ouvre automatiquement
   ↓
9. Partage sur WhatsApp/Facebook
```

### Côté Vendeur

```
1. SellerDashboard → Offres → Nouvelle Offre
   ↓
2. Remplit nom, description, prix de base
   ↓
3. Utilise TierBuilder pour créer paliers
   ↓
4. Prévisualise avec TierProgressBar
   ↓
5. Publie l'offre
   ↓
6. Suit l'évolution en temps réel
   ↓
7. Voit les participants et statistiques
```

## 🐛 Dépannage

### L'offre n'affiche pas les paliers

Vérifiez que :
```typescript
product.pricing_model === 'tiered'
product.pricing_tiers && product.pricing_tiers.length > 0
```

### Le prix ne se met pas à jour

Assurez-vous d'appeler `updateOfferAfterParticipation()` après chaque participation :

```typescript
// Dans ContactModal, après addDoc
await updateOfferAfterParticipation(productId, quantity);
```

### Les paliers ne s'affichent pas dans le bon ordre

Les paliers doivent être triés par `tier_number` croissant :

```typescript
pricing_tiers.sort((a, b) => a.tier_number - b.tier_number)
```

## 📝 Checklist d'intégration

- [ ] Types TypeScript créés (`src/types/pricing.ts`)
- [ ] Hook `usePriceCalculation` créé
- [ ] Composants UI créés (TierProgressBar, NudgeMessage, TierPricingDisplay)
- [ ] ProductCard mis à jour
- [ ] ProductDetailsModal mis à jour avec section explicative
- [ ] ShareModal créé
- [ ] TierBuilder créé pour les vendeurs
- [ ] SellerOfferForm mis à jour
- [ ] ContactModal met à jour l'offre après participation
- [ ] Tests effectués sur différents scénarios

## 🚀 Prochaines étapes suggérées

1. **Dashboard vendeur enrichi** :
   - Graphique d'évolution des participants
   - Prédiction d'atteinte des paliers
   - Export des données

2. **Notifications** :
   - Email quand palier débloqué
   - Rappel 24h avant deadline
   - SMS pour confirmation finale

3. **Gamification** :
   - Badges pour early adopters
   - Leaderboard des meilleurs partageurs
   - Points de fidélité

4. **Analytics** :
   - Tracking UTM sur les partages
   - Taux de conversion par palier
   - Performance des offres

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement.
