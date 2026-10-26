// ============================================================
// 04-pages-publiques.js : PAGES PUBLIQUES : navigation, langue, trajectoire animée, formulaire partenaire.
// ============================================================

function renderStatic(){
 document.querySelectorAll('[data-i]').forEach(e=>e.textContent=t(e.dataset.i));
 document.querySelectorAll('[data-ph]').forEach(e=>e.placeholder=t(e.dataset.ph));
 $('pillars').innerHTML=t('pill').map((p,i)=>`<div class="pill"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[i]}</svg><h3>${p}</h3><p>${t('pillD')[i]}</p></div>`).join('');
 $('nodes').innerHTML=PTS.map((p,i)=>`<g class="node" tabindex="0" role="button" aria-label="${t('pill')[i]}" data-n="${i}"><circle cx="${p[0]}" cy="${p[1]}" r="${i===ph?15:11}" fill="${i===ph?'#FF6B00':'#FDFBF7'}"/><circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#0F3830"/></g>`).join('');
 document.querySelectorAll('.node').forEach(n=>{const f=()=>{ph=+n.dataset.n;renderStatic()};n.onclick=f;n.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f()}}});
 $('team').innerHTML=`<div class="tm"><img src="${document.querySelector('.fph').src}" alt="Hicham Ahrarache"><b>Hicham Ahrarache</b><br><small>${t('founRole')}</small></div>`+t('pill').map(p=>`<div class="tm"><div class="av2">?</div><b>${t('soonName')}</b><br><small>${t('rF')} · ${p}</small></div>`).join('');
 $('gal').innerHTML=[0,1,2,3,4,5].map(()=>`<div><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="3"/><circle cx="12" cy="12.500" r="3.500"/><path d="M8 6l1.500-2h5L16 6"/></svg><span>${t('galSoon')}</span></div>`).join('');
 $('cap').innerHTML=`<b>${t('pill')[ph]}</b><br>${t('pillD')[ph]}`;
}
function goSpace(){go(me?'space':'login')}
function go(v){if((v==='space'||v==='login')&&me)v='space';else if(v==='space')v='login';view=v;document.querySelectorAll('section.v').forEach(x=>x.classList.toggle('on',x.id===v));
 document.querySelectorAll('nav button[data-v]').forEach(b=>b.setAttribute('aria-current',b.dataset.v===v?'page':'false'));
 $('nSp').setAttribute('aria-current',(v==='login'||v==='space')?'page':'false');$('nSpT').textContent=me?t('mySpace'):t('nLogin');$('nSp').setAttribute('aria-label',me?t('mySpace'):t('nLogin'));$('nOut').hidden=!me;$('nOut').setAttribute('aria-label',t('out'));window.scrollTo({top:0})}
const PREQ=[];
async function sendPartner(e){e.preventDefault();const g=i=>$(i).value.trim(),sc=g('pn');if(!sc||(!g('pp')&&!g('pe'))){$('pmsg2').textContent=t('parErr');return false}
 PREQ.unshift({sc,nm:g('pc'),ph:g('pp'),ml:g('pe'),mg:g('pm'),dt:new Date().toLocaleDateString('fr-FR')});lsSave();
 const sent=await sendToOrg('partenaire','Demande de partenariat - '+sc,{ecole:sc,contact:g('pc'),telephone:g('pp'),email:g('pe'),message:g('pm')});
 $('pform').hidden=true;$('pdone').hidden=false;$('pmsg2').textContent='';
 if(!sent){const body=t('parSchool')+': '+sc+'\n'+t('parName')+': '+g('pc')+'\n'+t('parPhone')+': '+g('pp')+'\n'+t('parMail')+': '+g('pe')+'\n\n'+g('pm');setTimeout(()=>{location.href='mailto:'+CONFIG.contactEmail+'?subject='+encodeURIComponent('Demande de partenariat - '+sc)+'&body='+encodeURIComponent(body)},500)}return false}
function partnerAgain(){['pn','pc','pp','pe','pm'].forEach(i=>$(i).value='');$('pform').hidden=false;$('pdone').hidden=true}
function setLang(l){lang=l;const h=document.documentElement;h.lang=l;h.dir=l==='ar'?'rtl':'ltr';
 $('bfr').setAttribute('aria-pressed',l==='fr');$('bar').setAttribute('aria-pressed',l==='ar');renderAll()}
