# Migration Supabase - Permettre les insertions anonymes

Ce script permet d'autoriser les insertions anonymes dans la table `participations` sans nécessiter d'authentification.

## Instructions d'application

1. Connectez-vous à votre [Tableau de bord Supabase](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor** (dans le menu de gauche)
4. Cliquez sur **New query**
5. Copiez-collez le contenu du fichier `enable_anonymous_participations.sql`
6. Cliquez sur **Run** (ou appuyez sur `Cmd+Enter` / `Ctrl+Enter`)

## Que fait ce script ?

- Active RLS (Row Level Security) sur la table `participations`
- Crée une politique permettant les **insertions anonymes** (sans authentification)
- Crée une politique permettant les **insertions authentifiées**
- Crée des politiques pour permettre aux **admins** de lire et mettre à jour les participations

## Vérification

Après avoir exécuté le script, vous pouvez tester en :
1. Ouvrant votre application en navigation privée (sans être connecté)
2. Tentant de rejoindre un groupe d'achat
3. Vérifiant que la participation est bien créée dans la table `participations` dans Supabase

## Sécurité

⚠️ **Note importante** : Cette configuration permet à n'importe qui d'insérer des participations. Assurez-vous que :
- Les validations côté client sont en place
- Vous avez un système de modération pour valider les participations
- Les données sensibles ne sont pas exposées via d'autres politiques

Les admins peuvent toujours gérer les participations via le dashboard admin.

