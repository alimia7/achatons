// Script Node sans Firebase Admin — utilise le SDK client avec email/password
// Charge automatiquement les variables depuis .env
import 'dotenv/config';
// Exécution:
//   VITE_FIREBASE_API_KEY=xxx VITE_FIREBASE_AUTH_DOMAIN=xxx VITE_FIREBASE_PROJECT_ID=xxx \
//   VITE_FIREBASE_STORAGE_BUCKET=xxx VITE_FIREBASE_MESSAGING_SENDER_ID=xxx VITE_FIREBASE_APP_ID=xxx \
//   FIREBASE_SEED_EMAIL=admin@exemple.com FIREBASE_SEED_PASSWORD=motdepasse \
//   node script.js
//
// Prérequis:
// - Le compte (FIREBASE_SEED_EMAIL/FIREBASE_SEED_PASSWORD) doit exister dans Firebase Auth
// - Ce compte doit être "admin" via Firestore: profiles/{uid}.role == 'admin'
// - Les règles Firestore autorisent l'admin à créer/mettre à jour les catégories

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where, setDoc, doc } from 'firebase/firestore';

function getConfigFromEnv() {
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
    'FIREBASE_SEED_EMAIL',
    'FIREBASE_SEED_PASSWORD',
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Variables d'environnement manquantes: ${missing.join(', ')}`);
  }
  return {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    seedEmail: process.env.FIREBASE_SEED_EMAIL,
    seedPassword: process.env.FIREBASE_SEED_PASSWORD,
  };
}

async function upsertCategories() {
  const cfg = getConfigFromEnv();
  const app = getApps().length ? getApps()[0] : initializeApp({
    apiKey: cfg.apiKey,
    authDomain: cfg.authDomain,
    projectId: cfg.projectId,
    storageBucket: cfg.storageBucket,
    messagingSenderId: cfg.messagingSenderId,
    appId: cfg.appId,
  });

  const auth = getAuth(app);
  const db = getFirestore(app);

  // Connexion avec un compte admin (email/password)
  await signInWithEmailAndPassword(auth, cfg.seedEmail, cfg.seedPassword);

  const categories = [
    { name: 'Alimentation', description: 'Produits alimentaires et boissons' },
    { name: 'Électroniques', description: 'Appareils et accessoires électroniques' },
    { name: 'Maisons et jardins', description: 'Maison, jardin et bricolage' },
    { name: 'Santé et beauté', description: 'Hygiène, soins et beauté' },
    { name: 'Sport et loisirs', description: 'Sports, plein air et hobbies' },
    { name: 'Mode', description: 'Vêtements, chaussures et accessoires' },
    { name: 'Autres', description: 'Autres catégories diverses' },
  ];

  const colRef = collection(db, 'categories');

  for (const cat of categories) {
    const qSnap = await getDocs(query(colRef, where('name', '==', cat.name)));
    const now = new Date().toISOString();
    if (qSnap.empty) {
      await addDoc(colRef, {
        name: cat.name,
        description: cat.description,
        created_at: now,
        updated_at: now,
      });
      console.log(`Créée: ${cat.name}`);
    } else {
      const d = qSnap.docs[0];
      await setDoc(
        doc(db, 'categories', d.id),
        { description: cat.description, updated_at: now },
        { merge: true }
      );
      console.log(`Mise à jour: ${cat.name}`);
    }
  }

  console.log('Terminé.');
}

upsertCategories().catch((err) => {
  console.error(err);
  process.exit(1);
});


