// ============================================================
// 11-reception.js : envoi automatique à l'organisation (inscriptions, rapports, demandes de partenariat).
// Fonctionne dès que CONFIG.formEndpoint (config.js) contient l'adresse d'un formulaire (Formspree, Web3Forms...).
// ============================================================
async function sendToOrg(type,subject,fields){const u=CONFIG.formEndpoint;if(!u)return false;
 try{const r=await fetch(u,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({_subject:subject,type,...fields})});return r.ok}catch(e){return false}}
