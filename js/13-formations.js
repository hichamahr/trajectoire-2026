// ============================================================
// 13-formations.js : FORMATIONS PARTAGEES : lecture publique et gestion Supabase avec RLS.
// ============================================================

let trainingClient=null,trainingClientError='',trainingLoadState='idle';
let trainingItems=[],trainingAuthChecked=false;
let trainingManagerAuthorized=false,trainingAuthMessage='',trainingManagerEmail='',trainingEditingId=null;
let trainingNotice='';
const TRAINING_LOCATIONS=[
 {id:'school',name:'Lycée El Moutanabbi'},
 {id:'association',name:'Association Iligh'}
];
const TRAINING_ASSOCIATION_ADDRESS='Dar Iligh Nahda, Avenue Moulay Ismail, BP 663 Ave du 29 Fevrier, Agadir 80000, Maroc.';
const trainingLocationName=location=>location==='Association Iligh'?t('trainLocationAssociation'):t('trainLocationSchool');

if(CONFIG.supabaseUrl&&CONFIG.supabaseAnonKey){
 if(window.supabase&&window.supabase.createClient){
  try{trainingClient=window.supabase.createClient(CONFIG.supabaseUrl,CONFIG.supabaseAnonKey)}
  catch(error){trainingClientError=error.message;console.error('Supabase: initialisation impossible.',error)}
 }else trainingClientError='Supabase JS is unavailable.';
}

const trainingDayName=day=>t('days')[day-1];
const trainingDateLabel=value=>new Intl.DateTimeFormat(lang==='ar'?'ar-MA':'fr-MA',{dateStyle:'long'}).format(new Date(value+'T12:00:00'));
const trainingWeekdays=()=>{
 const names=t('days');
 return `<div class="training-weekdays">${names.map((name,index)=>`<label><input type="checkbox" name="training-weekday" value="${index+1}"><span>${name}</span></label>`).join('')}</div>`;
};
const trainingInfo=()=>!trainingClient
 ?`<p role="status">${trainingClientError?t('trainLoadError'):t('trainNotConfigured')}</p>`
 :trainingLoadState==='idle'||trainingLoadState==='loading'
  ?`<p role="status">${t('trainLoading')}</p>`
  :trainingLoadState==='error'
   ?`<p role="alert">${t('trainLoadError')} <button class="btn sm" type="button" onclick="refreshTrainings()">${t('trainRefresh')}</button></p>`
   :'';

function trainingCard(item,editable){
 const weekdays=(item.weekdays||[]).map(trainingDayName).join(', ');
 const association=item.location==='Association Iligh';
 return `<article class="training-card"><h3>${esc(item.title)}</h3>
  ${item.description?`<p>${esc(item.description)}</p>`:''}
  <div class="training-meta"><span>${esc(trainingDateLabel(item.training_date))}</span><span>${esc(weekdays)}</span>
   <span>${esc(String(item.start_time).slice(0,5))} – ${esc(String(item.end_time).slice(0,5))}</span>
   ${item.location?`<span>${esc(trainingLocationName(item.location))}</span>`:''}
  </div>
  ${association?`<p>${esc(TRAINING_ASSOCIATION_ADDRESS)}</p><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(TRAINING_ASSOCIATION_ADDRESS)}" target="_blank" rel="noopener noreferrer">${t('trainLocationMap')}</a>`:''}
  ${editable?`<div class="training-actions"><button class="btn sm" type="button" onclick="editTraining('${item.id}')">${t('trainEdit')}</button><button class="btn sm" type="button" onclick="deleteTraining('${item.id}')">${t('trainDelete')}</button></div>`:''}
 </article>`;
}

function participantTrainingsHTML(){
 if(!trainingClient)return trainingInfo();
 if(trainingLoadState==='idle'||trainingLoadState==='loading'||trainingLoadState==='error')return trainingInfo();
 return trainingItems.length
  ?`<div class="training-list">${trainingItems.map(item=>trainingCard(item,false)).join('')}</div>`
  :`<p>${t('trainNone')}</p>`;
}

function managerTrainingLoginHTML(){
 if(!trainingAuthChecked)return `<p role="status">${t('trainAuthChecking')}</p>`;
 return `${trainingAuthMessage?`<p role="alert">${esc(trainingAuthMessage)}</p>`:''}<p>${t('trainAuthInfo')}</p><form class="training-auth" onsubmit="return signInTrainingManager(event)">
  <label class="training-field">${t('trainEmail')}<input id="training-auth-email" type="email" autocomplete="username" required></label>
  <label class="training-field">${t('trainPassword')}<input id="training-auth-password" type="password" autocomplete="current-password" required></label>
  <div class="training-actions"><button class="btn o sm" type="submit">${t('trainAuthButton')}</button></div>
  <p id="training-auth-error" role="alert"></p>
 </form>`;
}

function managerTrainingFormHTML(){
 const item=trainingItems.find(entry=>entry.id===trainingEditingId);
 return `<form onsubmit="return saveTraining(event)">
  <label class="training-field">${t('trainTitle')}<input id="training-title" maxlength="160" required value="${item?esc(item.title):''}"></label>
  <label class="training-field">${t('trainDescription')}<textarea id="training-description" maxlength="5000">${item?esc(item.description||''):''}</textarea></label>
  <label class="training-field">${t('trainDate')}<input id="training-date" type="date" required value="${item?esc(item.training_date):''}"></label>
  <div class="training-field">${t('trainDays')}${trainingWeekdays()}</div>
  <div class="grid2"><label class="training-field">${t('trainStart')}<input id="training-start" type="time" required value="${item?String(item.start_time).slice(0,5):''}"></label>
   <label class="training-field">${t('trainEnd')}<input id="training-end" type="time" required value="${item?String(item.end_time).slice(0,5):''}"></label></div>
  <label class="training-field">${t('trainLocation')}<select id="training-location" required>
   <option value="" disabled ${!item||!TRAINING_LOCATIONS.some(location=>location.name===item.location)?'selected':''}>${t('trainLocation')}</option>
   ${TRAINING_LOCATIONS.map(location=>`<option value="${location.name}" ${item&&item.location===location.name?'selected':''}>${t(location.id==='school'?'trainLocationSchool':'trainLocationAssociation')}</option>`).join('')}
  </select></label>
  <div class="training-actions"><button class="btn o sm" type="submit">${item?t('trainSave'):t('trainPublish')}</button>
   ${item?`<button class="btn sm" type="button" onclick="cancelTrainingEdit()">${t('trainCancel')}</button>`:''}
   <button class="btn sm" type="button" onclick="refreshTrainings()">${t('trainRefresh')}</button>
  </div><p id="training-message" role="status">${esc(trainingNotice)}</p>
 </form>`;
}

function managerTrainingsHTML(){
 if(!trainingClient)return trainingInfo();
 if(!trainingAuthChecked)return `<p role="status">${t('trainAuthChecking')}</p>`;
 if(!trainingManagerAuthorized)return managerTrainingLoginHTML();
 if(trainingLoadState==='idle'||trainingLoadState==='loading'||trainingLoadState==='error')return trainingInfo();
 return `<p class="tag">${t('trainAuthReady')}: ${esc(trainingManagerEmail)}</p>
  <button class="btn sm" type="button" onclick="signOutTrainingManager()">${t('trainSignOut')}</button>
  <div class="card" style="margin-top:14px">${managerTrainingFormHTML()}</div>
  <h3 style="margin-top:20px">${t('trainManage')}</h3>
  <div class="training-list">${trainingItems.map(item=>trainingCard(item,true)).join('')||`<p>${t('trainNone')}</p>`}</div>`;
}

async function loadTrainings(){
 if(!trainingClient){trainingLoadState='not-configured';return}
 trainingLoadState='loading';
 try{
  const {data,error}=await trainingClient.from('formations')
   .select('id,title,description,training_date,weekdays,start_time,end_time,location,created_at')
   .eq('published',true).order('training_date',{ascending:true}).order('start_time',{ascending:true});
  if(error)throw error;
  trainingItems=data||[];trainingLoadState='ready';
 }catch(error){
  trainingLoadState='error';
  console.error('Chargement Supabase des formations impossible.',error);
 }
 if(me&&(me.r==='manager'||me.r==='student'))renderSpace();
}

async function refreshTrainings(){
 await loadTrainings();
}

async function verifyTrainingManager(session){
 if(!session){trainingManagerAuthorized=false;trainingManagerEmail='';return false}
 let data,error;
 try{
  ({data,error}=await trainingClient.from('manager_access')
   .select('user_id').eq('user_id',session.user.id).maybeSingle());
 }catch(requestError){error=requestError}
 if(error){
  trainingManagerAuthorized=false;trainingAuthMessage=t('trainAuthError');
  trainingManagerEmail='';
  console.error('Vérification du rôle Supabase impossible.',error);
  return false;
 }
 trainingManagerAuthorized=!!data;
 trainingManagerEmail=session.user.email||'';
 trainingAuthMessage=trainingManagerAuthorized?'':t('trainAuthDenied');
 return trainingManagerAuthorized;
}

async function initTrainingAuth(){
 if(!trainingClient){trainingAuthChecked=true;return}
 let data,error;
 try{({data,error}=await trainingClient.auth.getSession())}
 catch(requestError){error=requestError}
 if(error){
  trainingAuthMessage=t('trainAuthError');
  console.error('Lecture de la session Supabase impossible.',error);
 }else if(data.session)await verifyTrainingManager(data.session);
 trainingAuthChecked=true;
 if(me&&me.r==='manager')renderSpace();
}

async function signInTrainingManager(event){
 event.preventDefault();
 const message=$('training-auth-error');
 let data,error;
 try{
  ({data,error}=await trainingClient.auth.signInWithPassword({
   email:$('training-auth-email').value.trim(),
   password:$('training-auth-password').value
  }));
 }catch(requestError){error=requestError}
 if(error){
  message.textContent=t('trainAuthError');
  console.error('Connexion Supabase du gestionnaire refusée.',error);
  return false;
 }
 const authorized=await verifyTrainingManager(data.session);
 trainingAuthChecked=true;
 if(!authorized){
  try{
   const {error:signOutError}=await trainingClient.auth.signOut();
   if(signOutError)console.error('Fermeture de la session Supabase non autorisée impossible.',signOutError);
  }catch(signOutError){console.error('Fermeture de la session Supabase non autorisée impossible.',signOutError)}
  trainingAuthMessage=t('trainAuthDenied');
  renderSpace();
  return false;
 }
 trainingAuthMessage='';
 trainingNotice='';
 await loadTrainings();
 renderSpace();
 return false;
}

async function signOutTrainingManager(){
 if(!trainingClient)return;
 let error;
 try{({error}=await trainingClient.auth.signOut())}
 catch(requestError){error=requestError}
 if(error)console.error('Fermeture de la session Supabase impossible.',error);
 trainingManagerAuthorized=false;trainingManagerEmail='';
 trainingAuthChecked=true;trainingAuthMessage='';trainingEditingId=null;
 if(me&&me.r==='manager')renderSpace();
}

function editTraining(id){
 trainingEditingId=id;trainingNotice='';
 renderSpace();
 const item=trainingItems.find(entry=>entry.id===id);
 if(item)document.querySelectorAll('input[name="training-weekday"]').forEach(input=>{input.checked=item.weekdays.includes(+input.value)});
}

function cancelTrainingEdit(){trainingEditingId=null;trainingNotice='';renderSpace()}

async function saveTraining(event){
 event.preventDefault();
 const weekdays=[...document.querySelectorAll('input[name="training-weekday"]:checked')].map(input=>+input.value);
 const start=$('training-start').value,end=$('training-end').value;
 if(!weekdays.length){$('training-message').textContent=t('trainNoDays');return false}
 if(start>=end){$('training-message').textContent=t('trainInvalidTime');return false}
 const values={
  title:$('training-title').value.trim(),
  description:$('training-description').value.trim(),
  training_date:$('training-date').value,
  weekdays:weekdays.sort((a,b)=>a-b),
  start_time:start,end_time:end,
  location:$('training-location').value,
  published:true
 };
 if(!values.title||!values.training_date||!TRAINING_LOCATIONS.some(location=>location.name===values.location))return false;
 let result;
 try{
  if(trainingEditingId){
   result=await trainingClient.from('formations').update(values).eq('id',trainingEditingId);
  }else{
   const {data:authData,error:authError}=await trainingClient.auth.getUser();
   if(authError||!authData.user){
    trainingNotice=t('trainAuthRequired');
    if(authError)console.error('Vérification de la session Supabase impossible.',authError);
    renderSpace();return false;
   }
   result=await trainingClient.from('formations').insert({...values,created_by:authData.user.id});
  }
 }catch(error){
  trainingNotice=t('trainSaveError');console.error('Enregistrement Supabase de la formation impossible.',error);
  renderSpace();return false;
 }
 if(result.error){
  trainingNotice=t('trainSaveError');console.error('Enregistrement Supabase de la formation impossible.',result.error);
  renderSpace();return false;
 }
 trainingNotice=trainingEditingId?t('trainUpdateOk'):t('trainSaveOk');
 trainingEditingId=null;
 await loadTrainings();
 renderSpace();
 return false;
}

async function deleteTraining(id){
 if(!trainingManagerAuthorized)return;
 if(!window.confirm(t('trainDeleteConfirm')))return;
 let error;
 try{({error}=await trainingClient.from('formations').delete().eq('id',id))}
 catch(requestError){error=requestError}
 if(error){
  trainingNotice=t('trainSaveError');console.error('Suppression Supabase de la formation impossible.',error);
 }else trainingNotice=t('trainDeleteOk');
 await loadTrainings();
 renderSpace();
}

initTrainingAuth();
