# Trajectoire (مسار) — Site du programme d'accompagnement des adolescents

Site statique (HTML / CSS / JavaScript), FR et arabe. Aucune donnée de démonstration : tout démarre vide.

## Ouvrir le site
Double-clique sur `index.html`. Pour mettre en ligne : dépose le dossier sur Vercel (ou GitHub puis Vercel).

## Structure
```
index.html          le HTML
config.js           TES réglages : e-mail, téléphone, réseaux, adresse de réception automatique, compte directeur
css/                01-base · 02-structure · 03-pages-publiques · 04-composants · 05-espaces-connectes · 06-mobile
js/                 logos · 01-textes · 02-donnees · 03-outils · 04-pages-publiques · 05-connexion ·
                    06-espaces-connectes · 07-pdf · 08-inscription · 09-actions · 10-comptes ·
                    11-reception · 12-demarrage   (l'ordre de chargement dans index.html est important)
assets/images/      logos et photo du fondateur
GUIDE-MODIFICATIONS.md   où modifier quoi
```

## Connexion
- **Participants** : code reçu à l'inscription (ex. `TRJ-7K2Q`), actif après validation du dossier signé.
- **Équipe de gestion** : identifiant + mot de passe. Le **directeur** crée tous les autres comptes (gestionnaires, formateurs, écoles) dans son espace, onglet « Membres et mots de passe » : le mot de passe est généré et affiché une seule fois, et peut être renouvelé à tout moment.
- Les mots de passe ne sont jamais écrits en clair dans le code : seule leur empreinte (PBKDF2) est stockée.

## Réception automatique (inscriptions, rapports, demandes de partenariat)
1. Crée un formulaire gratuit sur https://formspree.io (ou web3forms.com), avec l'e-mail du directeur.
2. Colle son adresse dans `config.js`, ligne `formEndpoint`.
3. Chaque inscription du Lycée Al Moutanabi, chaque rapport et chaque demande de partenariat arrive alors par e-mail, avec le **code d'inscription** à coller dans l'espace (Inscriptions > Importer) pour créer le dossier « en attente ».
   Pour que le gestionnaire reçoive aussi les e-mails : transfert automatique depuis la boîte du directeur.

## Formations partagées (Supabase)
Les formations sont enregistrées dans Supabase et non dans `localStorage`. Tant que Supabase n'est pas configuré, la section affiche un message de configuration et ne prétend pas synchroniser les données. Les inscriptions, comptes et autres données existants restent locaux et leur fonctionnement n'est pas modifié.

1. Crée un projet Supabase et exécute le fichier [`supabase-formations.sql`](./supabase-formations.sql) dans **SQL Editor**.
2. Dans **Authentication > Users**, crée un utilisateur avec l'e-mail et le mot de passe du gestionnaire autorisé. Désactive les inscriptions publiques dans les paramètres d'authentification.
3. Dans **Table Editor > manager_access**, ajoute une ligne avec l'UUID de cet utilisateur. Seul un administrateur du projet Supabase doit pouvoir modifier cette table.
4. Copie l'URL du projet et sa clé **anon/public** dans `supabaseUrl` et `supabaseAnonKey` de `config.js`. N'utilise jamais la clé `service_role` dans le site.
5. Publie ces fichiers sur ton hébergement habituel, puis ouvre la section « Gestion des formations ». Le gestionnaire se connecte avec son compte Supabase distinct. Les participants consultent les publications depuis « Mes formations ».
6. Après toute évolution du schéma, réexécute le script SQL : il est idempotent et ajoute le champ de lieu sans supprimer les formations. Les nouvelles formations doivent choisir l'un des deux lieux proposés.

Les règles RLS du script autorisent côté base la lecture des seules formations publiées et limitent création, modification et suppression aux utilisateurs authentifiés présents dans `manager_access`. Les informations des formations publiées sont lisibles par l'API publique; n'y saisis aucune donnée personnelle. L'Association Iligh affiche son adresse et un lien Google Maps construit à partir de celle-ci, sans coordonnées inventées.

Pour tester, crée une formation depuis le compte gestionnaire, puis connecte-toi au site avec un compte participant validé sur un autre navigateur/appareil. L'apparition entre appareils, ainsi que l'authentification et les règles RLS, ne peuvent pas être vérifiées tant que le projet Supabase, son schéma et le compte gestionnaire ne sont pas configurés. Le reste des données de l'application demeure enregistré localement.

Données de mineurs : accord des parents et respect de la loi 09-08 (CNDP).
