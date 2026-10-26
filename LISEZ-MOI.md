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

## Limite à connaître
Les comptes et dossiers créés dans l'espace sont enregistrés dans le navigateur de la personne qui les crée (pas de base de données). Pour que le directeur, les gestionnaires et les formateurs voient les mêmes données depuis leurs propres appareils, il faut une base de données en ligne (Supabase) : étape suivante.
Données de mineurs : accord des parents et respect de la loi 09-08 (CNDP).
