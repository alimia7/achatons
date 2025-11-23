# Guide de déploiement - Configuration des variables d'environnement

## Problème : Erreur `auth/invalid-api-key` en production

Cette erreur se produit lorsque les variables d'environnement Firebase ne sont pas configurées dans votre plateforme de déploiement.

## Solution : Configurer les variables d'environnement

### 1. Obtenir les valeurs Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet
3. Allez dans **Paramètres du projet** (⚙️) > **Paramètres généraux**
4. Faites défiler jusqu'à la section **Vos applications**
5. Cliquez sur l'icône **</>** (Web) pour voir votre configuration

Vous verrez quelque chose comme :
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 2. Configurer sur Vercel

1. Allez sur votre projet dans [Vercel Dashboard](https://vercel.com/dashboard)
2. Cliquez sur **Settings** > **Environment Variables**
3. Ajoutez les variables suivantes :

| Variable | Valeur |
|----------|--------|
| `VITE_FIREBASE_API_KEY` | Votre API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Votre Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Votre Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Votre Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Votre Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Votre App ID |

4. **Important** : Sélectionnez **Production**, **Preview**, et **Development** pour chaque variable
5. Cliquez sur **Save**
6. **Redéployez** votre application (Settings > Deployments > ... > Redeploy)

### 3. Configurer sur Netlify

1. Allez sur votre projet dans [Netlify Dashboard](https://app.netlify.com/)
2. Allez dans **Site settings** > **Environment variables**
3. Ajoutez les mêmes variables que pour Vercel
4. Cliquez sur **Save**
5. Redéployez votre site

### 4. Configurer sur d'autres plateformes

Pour toute autre plateforme (Railway, Render, etc.), ajoutez les mêmes variables d'environnement dans les paramètres de votre projet.

## Variables requises

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

## Vérification

Après avoir configuré les variables et redéployé, l'erreur `auth/invalid-api-key` devrait disparaître.

## Développement local

Pour le développement local, créez un fichier `.env.local` à la racine du projet avec les mêmes variables :

```bash
cp .env.example .env.local
```

Puis remplissez les valeurs dans `.env.local`.

**Note** : Le fichier `.env.local` est ignoré par Git (déjà dans `.gitignore`) pour des raisons de sécurité.

