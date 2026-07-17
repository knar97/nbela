-- ============================================================
-- SCHEMA BASE DE DONNEES — NBELA
-- Plateforme de location de logements — Yaoundé, Cameroun
-- Base : Supabase (PostgreSQL)
-- ============================================================
-- Ce fichier documente toute la structure de la base.
-- Il permet de recréer la base à l'identique si besoin,
-- et sert de reference aux developpeurs du projet.
-- ============================================================


-- ============================================================
-- 1. TABLES
-- ============================================================

-- ---------- PROFILS ----------
-- Supabase gere l'authentification (email, mot de passe) dans la table
-- cachee "auth.users". La table "profils" stocke les infos metier,
-- liee a auth.users par l'id.
create table profils (
  id uuid references auth.users on delete cascade primary key,
  nom text,
  prenom text,
  telephone text,
  est_bailleur boolean default false,
  est_locataire boolean default true,
  cree_le timestamp with time zone default now()
);

-- ---------- ANNONCES ----------
create table annonces (
  id uuid default gen_random_uuid() primary key,
  bailleur_id uuid references profils(id) on delete cascade not null,
  titre text not null,
  description text,
  type text not null,
  meuble boolean default false,
  prix integer not null,
  caution integer default 0,
  surface integer,
  etage integer,
  quartier text not null,
  adresse text,
  disponible boolean default true,
  cree_le timestamp with time zone default now()
);

-- ---------- PHOTOS ----------
create table photos (
  id uuid default gen_random_uuid() primary key,
  annonce_id uuid references annonces(id) on delete cascade not null,
  url text not null,
  ordre integer default 0
);

-- ---------- RESERVATIONS ----------
create table reservations (
  id uuid default gen_random_uuid() primary key,
  annonce_id uuid references annonces(id) on delete cascade not null,
  locataire_id uuid references profils(id) on delete cascade not null,
  date_entree date,
  duree_mois integer default 1,
  statut text default 'en_attente',
  message text,
  cree_le timestamp with time zone default now()
);

-- ---------- FAVORIS ----------
create table favoris (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profils(id) on delete cascade not null,
  annonce_id uuid references annonces(id) on delete cascade not null,
  unique(user_id, annonce_id)
);

-- ---------- AVIS ----------
-- Table creee, logique d'ecriture reportee (V1 : lecture seule).
create table avis (
  id uuid default gen_random_uuid() primary key,
  annonce_id uuid references annonces(id) on delete cascade not null,
  auteur_id uuid references profils(id) on delete cascade not null,
  note integer check (note >= 1 and note <= 5),
  commentaire text,
  cree_le timestamp with time zone default now()
);


-- ============================================================
-- 2. TRIGGER — CREATION AUTOMATIQUE DU PROFIL
-- ============================================================
-- Quand un compte est cree dans auth.users, cette fonction cree
-- automatiquement la ligne correspondante dans "profils".

create function public.gerer_nouvel_utilisateur()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profils (id, nom, prenom, telephone)
  values (
    new.id,
    new.raw_user_meta_data->>'nom',
    new.raw_user_meta_data->>'prenom',
    new.raw_user_meta_data->>'telephone'
  );
  return new;
end;
$$;

create trigger au_nouvel_utilisateur
  after insert on auth.users
  for each row execute function public.gerer_nouvel_utilisateur();


-- ============================================================
-- 3. POLITIQUES RLS (Row Level Security)
-- ============================================================
-- RLS est active sur toutes les tables (option projet Supabase).
-- Sans politique, tout acces est bloque. Chaque politique ouvre
-- un acces precis.

-- ---------- ANNONCES ----------
-- Lecture publique. Ecriture reservee au bailleur proprietaire.
create policy "Annonces visibles par tous"
on annonces for select
using (true);

create policy "Bailleur cree ses annonces"
on annonces for insert
with check (auth.uid() = bailleur_id);

create policy "Bailleur modifie ses annonces"
on annonces for update
using (auth.uid() = bailleur_id);

create policy "Bailleur supprime ses annonces"
on annonces for delete
using (auth.uid() = bailleur_id);

-- ---------- PROFILS ----------
-- Chacun ne lit et ne modifie que son propre profil.
create policy "Lire son propre profil"
on profils for select
using (auth.uid() = id);

create policy "Creer son propre profil"
on profils for insert
with check (auth.uid() = id);

create policy "Modifier son propre profil"
on profils for update
using (auth.uid() = id);

-- ---------- RESERVATIONS ----------
-- Visibles/modifiables uniquement par le locataire concerne
-- OU le bailleur de l'annonce reservee. Pas de suppression (V1).
create policy "Voir ses reservations"
on reservations for select
using (
  auth.uid() = locataire_id
  or
  auth.uid() = (select bailleur_id from annonces where annonces.id = reservations.annonce_id)
);

create policy "Locataire cree reservation"
on reservations for insert
with check (auth.uid() = locataire_id);

create policy "Modifier reservation concernee"
on reservations for update
using (
  auth.uid() = locataire_id
  or
  auth.uid() = (select bailleur_id from annonces where annonces.id = reservations.annonce_id)
);

-- ---------- PHOTOS ----------
-- Lecture publique. Gestion reservee au bailleur proprietaire de l'annonce.
create policy "Photos visibles par tous"
on photos for select
using (true);

create policy "Bailleur ajoute photos"
on photos for insert
with check (
  auth.uid() = (select bailleur_id from annonces where annonces.id = photos.annonce_id)
);

create policy "Bailleur supprime photos"
on photos for delete
using (
  auth.uid() = (select bailleur_id from annonces where annonces.id = photos.annonce_id)
);

-- ---------- FAVORIS ----------
-- Strictement prives : chacun ne voit/gere que ses propres favoris.
create policy "Voir ses favoris"
on favoris for select
using (auth.uid() = user_id);

create policy "Ajouter ses favoris"
on favoris for insert
with check (auth.uid() = user_id);

create policy "Retirer ses favoris"
on favoris for delete
using (auth.uid() = user_id);

-- ---------- AVIS ----------
-- Lecture publique. Ecriture reportee (aucune politique insert/update en V1).
create policy "Avis visibles par tous"
on avis for select
using (true);

-- ============================================================
-- 4. GRANTS COMPLEMENTAIRES
-- ============================================================
-- RLS autorise QUI peut voir QUELLES lignes. Mais avant ça, Postgres
-- exige un droit d'acces de base sur la table elle-meme (GRANT).
-- Sans "Automatically expose new tables" (decoche volontairement pour
-- plus de securite), ces GRANT doivent etre donnes manuellement,
-- pour les deux roles possibles : "anon" (visiteur non connecte) et
-- "authenticated" (utilisateur connecte).

grant select on public.annonces to anon;
grant select on public.photos to anon;
grant select on public.avis to anon;

grant select on public.annonces to authenticated;
grant select on public.photos to authenticated;
grant select on public.avis to authenticated;

-- ============================================================
-- FIN DU SCHEMA
-- ============================================================