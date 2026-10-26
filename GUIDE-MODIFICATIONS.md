# Guide : où modifier quoi ?

| Je veux changer... | Fichier |
|---|---|
| Téléphone, e-mail, réseaux sociaux, adresse de réception automatique | `config.js` |
| Un texte du site (français ou arabe) | `js/01-textes.js` |
| Le règlement du programme, les modules, l'école (Lycée Al Moutanabi) | `js/02-donnees.js` |
| Créer / renouveler un mot de passe | Espace directeur > Membres et mots de passe |
| La page de connexion | `js/05-connexion.js` |
| L'interface après connexion | `css/05-espaces-connectes.css` et `js/06-espaces-connectes.js` |
| Les formations partagées gestionnaire/participants | `js/13-formations.js`, `supabase-formations.sql` et les réglages Supabase de `config.js` |
| Les comptes (membres, mots de passe protégés) | `js/10-comptes.js` |
| L'envoi automatique | `js/11-reception.js` et `config.js` |
| Les PDF (fiche d'inscription, dossier d'autorisation, rapports) | `js/07-pdf.js` |
| Les couleurs et le fond blanc | `css/01-base.css` (variables `--green`, `--orange`, `--bg`) |
| Le téléphone / la tablette | `css/06-mobile.css` |
| La photo du fondateur / les logos | `assets/images/` (logos des PDF : `js/logos.js`) |

Astuces : **Ctrl + Maj + F** cherche dans tout le projet · **Ctrl + S** puis **F5** après chaque modification · **F12** puis « Console » montre les erreurs.
