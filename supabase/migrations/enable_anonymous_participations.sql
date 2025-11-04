-- Migration pour permettre les insertions anonymes dans la table participations
-- Ce script doit être exécuté dans Supabase Dashboard > SQL Editor

-- 1. Activer RLS sur la table participations (si ce n'est pas déjà fait)
ALTER TABLE participations ENABLE ROW LEVEL SECURITY;

-- 2. Supprimer les anciennes politiques (si elles existent)
DROP POLICY IF EXISTS "Allow anonymous insertions" ON participations;
DROP POLICY IF EXISTS "Allow public insertions" ON participations;

-- 3. Créer une politique pour permettre les insertions anonymes
CREATE POLICY "Allow anonymous insertions"
ON participations
FOR INSERT
TO anon
WITH CHECK (true);

-- 4. Créer une politique pour permettre les insertions aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated insertions"
ON participations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 5. Créer une politique pour permettre la lecture aux admins (si nécessaire)
CREATE POLICY "Allow admin read"
ON participations
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 6. Créer une politique pour permettre la mise à jour aux admins
CREATE POLICY "Allow admin update"
ON participations
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

