// Script de migration pour corriger les offres existantes
// Utilisation : node migrate-offers.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

// TODO: Remplacer avec votre config Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateOffers() {
  console.log('🚀 Début de la migration des offres...\n');

  try {
    const offersSnap = await getDocs(collection(db, 'offers'));
    let migratedCount = 0;
    let skippedCount = 0;

    for (const offerDoc of offersSnap.docs) {
      const offer = offerDoc.data();

      // Skip if already migrated (has total_quantity field)
      if (offer.total_quantity !== undefined) {
        console.log(`⏭️  Offre ${offerDoc.id} déjà migrée`);
        skippedCount++;
        continue;
      }

      // For tiered pricing offers
      if (offer.pricing_model === 'tiered') {
        // The old system stored quantity in current_participants
        // We need to split it:
        // - Estimate participants as 1 (or current_participants if reasonable)
        // - Move the quantity to total_quantity

        const oldValue = offer.current_participants || 0;

        // Heuristic: if current_participants is very high, it's probably quantity
        // In most cases with tiered pricing, we'll assume:
        // - If value > 10, it's likely quantity stored in wrong field
        // - We'll set participants to 1 and quantity to the old value

        let newParticipants = 1;
        let newQuantity = oldValue;

        // If the value is small (<=10), it might actually be participants
        // In this case, we can't know for sure, so we'll keep it as is
        if (oldValue <= 10) {
          newParticipants = oldValue;
          newQuantity = oldValue; // Assume 1 unit per participant
          console.log(`⚠️  Offre ${offerDoc.id}: Valeur ambiguë (${oldValue}), supposant ${oldValue} participants avec 1 unité chacun`);
        } else {
          console.log(`✅ Offre ${offerDoc.id}: Migration ${oldValue} unités → 1 participant, ${oldValue} quantité`);
        }

        await updateDoc(doc(db, 'offers', offerDoc.id), {
          current_participants: newParticipants,
          total_quantity: newQuantity,
          updated_at: new Date().toISOString()
        });

        migratedCount++;
      } else {
        // For fixed pricing, add total_quantity = current_participants
        await updateDoc(doc(db, 'offers', offerDoc.id), {
          total_quantity: offer.current_participants || 0,
          updated_at: new Date().toISOString()
        });

        console.log(`✅ Offre ${offerDoc.id} (prix fixe) migrée`);
        migratedCount++;
      }
    }

    console.log(`\n✨ Migration terminée !`);
    console.log(`   • ${migratedCount} offres migrées`);
    console.log(`   • ${skippedCount} offres déjà à jour`);

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }

  process.exit(0);
}

migrateOffers();
