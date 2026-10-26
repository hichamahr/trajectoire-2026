// ============================================================
// 12-demarrage.js : DEMARRAGE : applique config.js puis lance le site.
// ============================================================

function applyConfig(){document.querySelectorAll('[data-logo]').forEach(i=>{i.src=LOGO_NEW});document.querySelectorAll('[data-cfg]').forEach(a=>{const k=a.dataset.cfg;a.href=k==='tel'?'tel:'+CONFIG.phoneLink:k==='mail'?'mailto:'+CONFIG.contactEmail:CONFIG[k]});document.querySelectorAll('[data-cfg-text]').forEach(e=>{e.textContent=CONFIG[e.dataset.cfgText]});['fr','ar'].forEach(l=>{D[l].parOk=D[l].parOk.split('contact@trajectoire.ma').join(CONFIG.contactEmail)})}
function renderAll(){renderStatic();renderLogin();renderSpace();renderReg();go(view)}
applyConfig();initOwner();lsLoad();renderAll();
if(document.addEventListener)document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key&&e.key.toLowerCase()==='k'&&me&&me.r==='manager'){e.preventDefault();const i=$('msearch');if(i)i.focus()}});
(function(){const p=$('tp'),d=$('dot'),len=p.getTotalLength();let s=null;
 const set=k=>{const q=p.getPointAtLength(len*k);d.setAttribute('cx',q.x);d.setAttribute('cy',q.y)};
 if(matchMedia('(prefers-reduced-motion:reduce)').matches){set(1);return}
 function f(ts){if(!s)s=ts;const k=Math.min((ts-s)/3500,1);set(1-Math.pow(1-k,3));if(k<1)requestAnimationFrame(f)}requestAnimationFrame(f)})();
