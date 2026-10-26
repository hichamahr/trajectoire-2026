// ============================================================
// 10-comptes.js : mots de passe protégés (PBKDF2), membres (gestionnaires, formateurs, écoles), compte directeur.
// ============================================================
const _enc=new TextEncoder();
const _hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const _unhex=h=>new Uint8Array(h.match(/../g).map(x=>parseInt(x,16)));
async function hashPw(pw,salt){const k=await crypto.subtle.importKey('raw',_enc.encode(pw),'PBKDF2',false,['deriveBits']);return _hex(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:_unhex(salt),iterations:150000},k,256))}
const newSalt=()=>_hex(crypto.getRandomValues(new Uint8Array(16)));
function genPw(n){const c='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$%&*?!';let r='';for(const x of crypto.getRandomValues(new Uint32Array(n||14)))r+=c[x%c.length];return r}
const nz=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
let MEMB=[],lastCred=null;const LSO='trj_owner_v1';
function ownerCred(){try{const o=JSON.parse(localStorage.getItem(LSO)||'null');if(o&&o.salt&&o.hash)return o}catch(e){}return CONFIG.owner}
function initOwner(){const c=ownerCred();ACC.push({r:'owner',u:CONFIG.owner.u,n:{fr:CONFIG.owner.name,ar:CONFIG.owner.name},salt:c.salt,hash:c.hash})}
function applyMember(m){const n={fr:m.nm,ar:m.nm},base={u:m.u,n,salt:m.salt,hash:m.hash,off:!!m.off};
 if(m.role==='trainer'){const i=TR.length;TR.push(n);TM.push(m.mi||0);TEAM.push({fr:'—',ar:'—'});TP.push([]);ACC.push({...base,r:'trainer',mod:i})}
 else if(m.role==='school'){let i=SCH.findIndex(s=>nz(s.n.fr)===nz(m.nm));if(i<0){i=SCH.length;SCH.push({n,s:0,c:0})}ACC.push({...base,r:'school',sc:i})}
 else ACC.push({...base,r:'manager'})}
function memId(role){const p={manager:'TRG-',trainer:'TRF-',school:'TRE-'}[role];let n=MEMB.filter(x=>x.role===role).length+1,u;do{u=p+String(n++).padStart(2,'0')}while(ACC.some(a=>a.u.toLowerCase()===u.toLowerCase()));return u}
async function addMember(){const nm=$('mm_n').value.trim(),role=$('mm_r').value;if(!nm){$('mm_msg').textContent=t('trFill');return}
 const u=memId(role),pw=genPw(14),salt=newSalt(),hash=await hashPw(pw,salt),m={u,nm,role,mi:+($('mm_m').value||0),salt,hash};MEMB.push(m);applyMember(m);lastCred={u,pw,nm};lsSave();renderSpace()}
async function resetPw(u){const a=ACC.find(x=>x.u===u);if(!a)return;const pw=genPw(14),salt=newSalt(),hash=await hashPw(pw,salt);a.salt=salt;a.hash=hash;const m=MEMB.find(x=>x.u===u);if(m){m.salt=salt;m.hash=hash}else if(a.r==='owner'){try{localStorage.setItem(LSO,JSON.stringify({salt,hash}))}catch(e){}}lastCred={u,pw,nm:L(a.n)};lsSave();renderSpace()}
function toggleMember(u){const m=MEMB.find(x=>x.u===u),a=ACC.find(x=>x.u===u);if(!m||!a)return;m.off=!m.off;a.off=m.off;lsSave();renderSpace()}
async function copyCred(){try{await navigator.clipboard.writeText('Identifiant : '+lastCred.u+'\nMot de passe : '+lastCred.pw)}catch(e){}}
const roleLbl=r=>t({owner:'mDir',manager:'rG',trainer:'rF',school:'rE'}[r]);
function membersHTML(){const rows=ACC.filter(a=>a.r!=='student');
 return `<h2>${t('tMem')}</h2><p style="color:var(--muted);margin:0 0 12px">${t('mHelp')}</p>
${lastCred?`<div class="cred"><b>${t('mShown')}</b><br>${esc(lastCred.nm)} · ${t('mId')} : <code>${esc(lastCred.u)}</code> · ${t('pwL')} : <code>${esc(lastCred.pw)}</code> <button class="btn sm" onclick="copyCred()">${t('mCopy')}</button></div>`:''}
<h3>${t('mAdd')}</h3><div class="add"><input id="mm_n" placeholder="${t('mName')}"><select id="mm_r" class="sel"><option value="manager">${t('rG')}</option><option value="trainer">${t('rF')}</option><option value="school">${t('rE')}</option></select><select id="mm_m" class="sel" aria-label="${t('mMod')}">${MODS.map((m,i)=>`<option value="${i}">${t('mMod')} : ${esc(L(m.n))}</option>`).join('')}</select><button class="btn o sm" onclick="addMember()">${t('mAddBtn')}</button></div><div id="mm_msg" style="color:var(--orange);font-size:13px;min-height:18px;margin:6px 0"></div>
<h3 style="margin-top:14px">${t('tMem')} (${rows.length})</h3>${rows.map(a=>`<div class="grp" style="grid-template-columns:1.2fr 1fr 1fr auto"><b>${esc(L(a.n))}${a.off?' <small>('+t('mOff')+')</small>':''}</b><span>${roleLbl(a.r)}</span><code>${esc(a.u)}</code><span style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn sm" onclick="resetPw('${a.u}')">${t('mNewPw')}</button>${a.r!=='owner'?`<button class="btn sm" onclick="toggleMember('${a.u}')">${a.off?t('mOn'):t('mOff')}</button>`:''}</span></div>`).join('')}`}
