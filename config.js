// ============================================================
// config.js : tes réglages (à modifier ici, une seule fois pour tout le site).
// ============================================================
const CONFIG={
  contactEmail:'contact@trajectoire.ma',   // e-mail affiché sur le site
  phone:'+212 6 00 00 00 00',              // numéro affiché dans le pied de page
  phoneLink:'+212600000000',               // même numéro sans espaces
  instagram:'#', linkedin:'#', facebook:'#',   // remplace # par tes liens

  // RECEPTION AUTOMATIQUE (inscriptions, rapports, demandes de partenariat) :
  // crée un formulaire gratuit sur formspree.io (ou web3forms.com) et colle son adresse ici.
  // Exemple : 'https://formspree.io/f/abcdwxyz'   (vide = pas d'envoi automatique)
  formEndpoint:'',

  // Compte DIRECTEUR (le mot de passe n'est pas écrit ici : seulement son empreinte).
  owner:{u:'TRGD-DIR01',name:'Hicham Ahrarache',salt:'e775ab883a49dc24d94a586b54dd99c2',hash:'ae7a12dd1de38de5d128119ac35ec2b385496071bebb88aad90f0ac420edea2d'}
};
