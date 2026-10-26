// ============================================================
// 09-actions.js : ACTIONS : clics et envois de formulaires (formations, formateurs, tâches, présence QR...).
// ============================================================

function addForm(){const n=$('fn').value.trim(),d=$('fd').value;if(!n||!d){$('fmsg').textContent=t('fillAll');return}
 if(editF!=null){const f=FORM[editF];f.n={fr:n,ar:n};f.d={fr:d,ar:d};f.dt=d;f.tr=($('ft').value===''?-1:+$('ft').value);f.sc=+$('fs').value;editF=null;lsSave();renderSpace();$('fmsg').textContent=t('fSaved');return}
 FORM.push(mkF(n,n,d,($('ft').value===''?-1:+$('ft').value),+$('fs').value));lsSave();renderSpace();$('fmsg').textContent=t('launched')}
function editFm(i){editF=i;renderSpace()}
function delFm(i){FORM[i].del=true;if(editF===i)editF=null;lsSave();renderSpace()}


function addSess(){const i=+$('sx_t').value;if(!TP[i])return;TP[i].push({d:+$('sx_d').value,s:+$('sx_s').value,h:$('sx_h').value||'16:00',x:false});lsSave();renderSpace();$('sxmsg').textContent=t('sessOk')}
async function repPdfNow(){const ti=$('rt').value.trim(),tx=$('rx').value.trim();if(!ti||!tx){$('rmsg2').textContent=t('repEmpty');return}const r={u:me.u,rn:me.n,role:RK[me.r],k:$('rk').value,ti,tx,dt:new Date().toISOString().slice(0,10)};const pdf=await makeReportPdf(r);const ok=await saveFile('rapport-'+r.dt+'.pdf',pdf);$('rmsg2').textContent=ok?t('repPdfOk'):t('dlNo')}
async function sendRep(){const ti=$('rt').value.trim(),tx=$('rx').value.trim(),f=$('rfl').files[0];if(!ti||(!tx&&!f)){$('rmsg2').textContent=t('repEmpty');return}
 let file=null;try{if(f)file={name:f.name,url:URL.createObjectURL(f)}}catch(e){file=f?{name:f.name,url:'#'}:null}
 const r={u:me.u,rn:me.n,role:RK[me.r],k:$('rk').value,ti,tx,dt:new Date().toISOString().slice(0,10),file};
 if(tx){try{r.pdf=await makeReportPdf(r)}catch(e){}}
 REPS.unshift(r);await sendToOrg('rapport','Rapport - '+ti,{auteur:L(me.n),role:t(RK[me.r]),type:t(r.k),titre:ti,date:r.dt,texte:tx});renderSpace();$('rmsg2').textContent=t('repOk')+(r.pdf?' '+t('repPdfOk'):'')}
function sendOwn(){const v=$('on').value.trim();if(!v){$('on').focus();return}const w=$('ow').value;TASKS.unshift({to:w==='m'?'m':+w,t:{fr:v,ar:v},due:$('od').value||'-',x:false,by:'owner',kind:$('ok').value});renderSpace();$('omsg').textContent=t('sentOk')}
function setPtab(k){ptab=k;renderSpace()}
function inc(i){const s=stu(me.sid);if(s.m[i]<TOT){s.m[i]++;renderSpace()}}
function markId(v){v=(v||'').trim().toUpperCase();const i=me.mod,x=TP[i][asK],s=stu(v),m=$('amsg');if(!x||!s||s.sc!==x.s){m.textContent=t('notIn');return}const k=i+'-'+asK;ATT[k]=ATT[k]||{};if(!ATT[k][s.id]){ATT[k][s.id]=1;s.pres++}attList();m.textContent=L(s.n)+' · '+t('okPres');$('sid').value=''}
async function cam(){const m=$('amsg');if(!('BarcodeDetector' in window)||!navigator.mediaDevices){m.textContent=t('noCam');return}
 try{camS=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});const v=$('vid');v.srcObject=camS;v.hidden=false;await v.play();const bd=new BarcodeDetector({formats:['qr_code']});let last='';
 const tick=async()=>{if(!camS)return;try{const r=await bd.detect(v);if(r[0]&&r[0].rawValue!==last){last=r[0].rawValue;markId(last)}}catch(e){}setTimeout(tick,600)};tick()}catch(e){m.textContent=t('noCam')}}
function stopCam(){if(camS){camS.getTracks().forEach(x=>x.stop());camS=null}const v=$('vid');if(v){v.srcObject=null;v.hidden=true}}
function setMflt(v){mflt=+v;renderSpace()}
function photo(i){const f=i.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{stu(me.sid).photo=r.result;renderSpace()};r.readAsDataURL(f)}
function pickF(i){const s=$('rf');s.value=i;$('rform').scrollIntoView({behavior:'smooth'});$('rp').focus()}
function reg(){const s=stu(me.sid),f=+$('rf').value;if(REG.some(r=>r.s===s.id&&r.f===f)){$('rmsg').textContent=t('regDup');return}REG.push({s:s.id,f,dt:new Date().toISOString().slice(0,10)});renderSpace();$('rmsg').textContent=t('regOk')}
function sendTask(){const v=$('tn').value.trim();if(!v){$('tn').focus();return}TASKS.unshift({to:+$('tt').value,t:{fr:v,ar:v},due:$('td').value||'-',x:false,by:'manager',kind:'kTask'});renderSpace();$('tmsg').textContent=t('sentOk')}
function tk(j){TASKS[j].x=!TASKS[j].x;renderSpace()}
function tp(i,k){TP[i][k].x=!TP[i][k].x;lsSave();renderSpace()}
function setTab(x){tab=x;renderSpace()}function setStab(x){stab=x;renderSpace()}function setOt(x){ot=x;lastCred=null;renderSpace()}function setOm(x){om=x;renderSpace()}
function addProj(){const v=$('pt').value.trim();if(!v){$('pmsg').textContent=lang==='fr'?'Écris un titre pour ton projet.':'اكتب عنوانا لمشروعك.';$('pt').focus();return}
 proj.unshift({t:{fr:v,ar:v},k:$('pty').value});renderSpace();$('pmsg').textContent=lang==='fr'?'Projet ajouté au portfolio.':'تمت إضافة المشروع إلى ملف الأعمال.'}
