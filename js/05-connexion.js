// ============================================================
// 05-connexion.js : CONNEXION : Participants (code) et Équipe de gestion (identifiant + mot de passe).
// ============================================================


function renderLogin(){const c=ls.cat,logo=(document.querySelector('.logo img')||{}).src||'';
 let h=`<div style="text-align:center"><img src="${logo}" alt="Trajectoire" style="height:64px;max-width:80%"></div><h2 style="text-align:center;margin:12px 0 4px">${t('logTitle')}</h2><p style="text-align:center;color:var(--muted);margin:0">${t('logSub')}</p>
<div class="cats"><button type="button" class="cat" aria-pressed="${c==='p'}" onclick="lcat('p')">${svg('<path d="M3 9l9-5 9 5-9 5z"/><path d="M7 11.500V16c0 1.500 2.200 3 5 3s5-1.500 5-3v-4.500"/>')}<b>${t('lgPart')}</b><small>${t('lgPartS')}</small></button><button type="button" class="cat" aria-pressed="${c==='t'}" onclick="lcat('t')">${svg('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>')}<b>${t('lgTeam')}</b><small>${t('lgTeamS')}</small></button></div>`;
 if(c==='p')h+=`<form class="card lg" onsubmit="return loginP(event)"><label><span>${t('codeL')}</span><input id="lc" autocomplete="off" autocapitalize="characters" placeholder="TRJ-XXXX"></label><button class="btn o" type="submit">${t('codeGo')}</button><div id="lerr" role="alert"></div><p style="margin:12px 0 0"><button type="button" class="btn sm" onclick="go('register')">${t('notYet')}</button></p></form>`;
 else if(c==='t')h+=`<form class="card lg" onsubmit="return loginT(event)"><label><span>${t('idU')}</span><input id="lu" autocomplete="username" autocapitalize="none"></label><label><span>${t('pwL')}</span><input id="lp" type="password" autocomplete="current-password"></label><button class="btn o" type="submit">${t('loginBtn')}</button><div id="lerr" role="alert"></div></form>`;
 $('logIn').innerHTML=h}
function lcat(c){ls={cat:c};renderLogin()}


function afterLogin(a){me=a;ls={cat:null};ptab='dash';tab='x';ot='mem';asK=0;renderLogin();renderSpace();go('space')}
function loginP(e){e.preventDefault();const c=$('lc').value.trim().toUpperCase(),a=ACC.find(x=>x.r==='student'&&x.u.toUpperCase()===c);if(a){afterLogin(a);return false}$('lerr').textContent=PEND.some(q=>q.id.toUpperCase()===c)?t('loginPend'):t('badCode');return false}
async function loginT(e){e.preventDefault();const u=$('lu').value.trim().toLowerCase(),a=ACC.find(x=>x.r!=='student'&&x.u.toLowerCase()===u);let ok=false;if(a&&!a.off){try{ok=(await hashPw($('lp').value,a.salt))===a.hash}catch(err){}}if(!ok){$('lerr').textContent=t('bad');return false}afterLogin(a);return false}
function logout(){if(typeof signOutTrainingManager==='function')signOutTrainingManager();me=null;go('home')}
function openLogin(r){ls={cat:r==='student'?'p':'t'};renderLogin();go(me?'space':'login')}
