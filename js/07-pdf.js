// ============================================================
// 07-pdf.js : PDF : dossier d’autorisation, fiche d’inscription, rapports (générés dans le navigateur, avec logo et QR).
// ============================================================

const loadImg=async src=>{if(!src)return null;const i=new Image();i.src=src;try{await i.decode();return i}catch(e){return null}};
const cvJpg=cv=>{const url=cv.toDataURL('image/jpeg',0.88),bin=atob(url.split(',')[1]),jpg=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)jpg[i]=bin.charCodeAt(i);return {jpg,w:cv.width,h:cv.height}};
function imgsToPdf(pgs){const enc=new TextEncoder(),parts=[],offs=[];let len=0;const push=x=>{const b=typeof x==='string'?enc.encode(x):x;parts.push(b);len+=b.length};const n=pgs.length;
 push('%PDF-1.4\n');const ob=(i,body)=>{offs[i]=len;push(i+' 0 obj\n'+body+'\nendobj\n')};
 ob(1,'<< /Type /Catalog /Pages 2 0 R >>');ob(2,'<< /Type /Pages /Kids ['+pgs.map((_,k)=>(3+k*3)+' 0 R').join(' ')+'] /Count '+n+' >>');
 pgs.forEach((g,k)=>{const pg=3+k*3,im=pg+1,ct=pg+2;ob(pg,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 '+im+' 0 R >> >> /Contents '+ct+' 0 R >>');
  offs[im]=len;push(im+' 0 obj\n<< /Type /XObject /Subtype /Image /Width '+g.w+' /Height '+g.h+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+g.jpg.length+' >>\nstream\n');push(g.jpg);push('\nendstream\nendobj\n');
  const cs='q 595.28 0 0 841.89 0 0 cm /Im0 Do Q';ob(ct,'<< /Length '+cs.length+' >>\nstream\n'+cs+'\nendstream')});
 const total=3+n*3,xr=len;let x='xref\n0 '+total+'\n0000000000 65535 f \n';for(let i=1;i<total;i++)x+=String(offs[i]).padStart(10,'0')+' 00000 n \n';
 push(x+'trailer\n<< /Size '+total+' /Root 1 0 R >>\nstartxref\n'+xr+'\n%%EOF');const out=new Uint8Array(len);let q=0;for(const b of parts){out.set(b,q);q+=b.length}return out}
async function makeReportPdf(r){
 const S=1.4,W=1240,H=1754,pages=[],logo=await loadImg((document.querySelector('.logo img')||{}).src);
 try{await document.fonts.load('600 20px Cairo');await document.fonts.load('700 20px Montserrat')}catch(e){}
 const G='#0F3830',O='#FF6B00',FF="'Montserrat','Cairo',Arial,sans-serif",FA="'Cairo','Montserrat',Arial,sans-serif";let cv,c,y,pg=0;
 const wrap=(txt,w)=>{const o=[];let cur='';for(const wd of String(txt).split(' ')){const tt=cur?cur+' '+wd:wd;if(c.measureText(tt).width>w&&cur){o.push(cur);cur=wd}else cur=tt}if(cur)o.push(cur);return o};
 const start=()=>{cv=document.createElement('canvas');cv.width=Math.round(W*S);cv.height=Math.round(H*S);c=cv.getContext('2d');c.setTransform(S,0,0,S,0,0);c.fillStyle='#fff';c.fillRect(0,0,W,H);pg++;
  if(pg===1){if(logo)c.drawImage(logo,70,50,330,330*logo.naturalHeight/logo.naturalWidth);c.fillStyle=G;c.textAlign='right';c.direction='ltr';c.font='700 34px '+FF;c.fillText(r.k==='kArt'?'Article':'Rapport de séance',1170,92);c.direction='rtl';c.font='700 34px '+FA;c.fillText(r.k==='kArt'?'مقال':'تقرير حصة',1170,142);c.fillStyle=O;c.fillRect(70,190,1100,4);y=240;
   c.textAlign='left';c.direction='ltr';c.fillStyle=G;c.font='700 30px '+FF;wrap(r.ti,1100).forEach(l=>{c.fillText(l,70,y);y+=40});y+=6;
   c.fillStyle='#555';c.font='500 20px '+FF;c.fillText('Auteur : '+(r.rn&&r.rn.fr||'')+' ('+(D.fr[r.role]||'')+')',70,y);y+=30;c.fillText('Date : '+r.dt,70,y);y+=22;c.fillStyle='#E6E1D4';c.fillRect(70,y,1100,2);y+=24}
  else{if(logo)c.drawImage(logo,70,40,200,200*logo.naturalHeight/logo.naturalWidth);c.fillStyle='#666';c.textAlign='right';c.direction='ltr';c.font='600 18px '+FF;c.fillText(String(r.ti).slice(0,70),1170,80);c.fillStyle=O;c.fillRect(70,110,1100,3);y=150}
  c.fillStyle='#777';c.textAlign='center';c.direction='ltr';c.font='500 15px '+FF;c.fillText('Trajectoire · Accompagnement des adolescents · مسار · page '+pg,W/2,H-40)};
 start();
 for(const par of String(r.tx||'').split('\n')){if(!par.trim()){y+=22;continue}const rtl=/[\u0600-\u06FF]/.test(par.slice(0,40)),px=rtl?1170:70,fnt='500 23px '+(rtl?FA:FF);
  c.font=fnt;const ls=wrap(par,1100);for(const l of ls){if(y>H-110){pages.push(cvJpg(cv));start();c.font=fnt}c.fillStyle='#222';c.direction=rtl?'rtl':'ltr';c.textAlign=rtl?'right':'left';c.font=fnt;y+=36;c.fillText(l,px,y)}y+=10}
 pages.push(cvJpg(cv));return imgsToPdf(pages)}
async function saveFile(name,data){try{const dl=window.claude&&await window.claude.use('downloads');if(dl){await dl.save({filename:name,data});return true}if(!window.claude){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'application/pdf'}));a.download=name;document.body.appendChild(a);a.click();a.remove();return true}}catch(e){}return false}
async function dlRep(i){await saveFile('rapport-'+REPS[i].dt+'-'+i+'.pdf',REPS[i].pdf)}
function jpegToPdf(jpg,w,h){const enc=new TextEncoder(),parts=[],offs=[];let len=0;
 const push=x=>{const b=typeof x==='string'?enc.encode(x):x;parts.push(b);len+=b.length};
 const obj=(n,body)=>{offs[n]=len;push(n+' 0 obj\n'+body+'\nendobj\n')};
 push('%PDF-1.4\n');obj(1,'<< /Type /Catalog /Pages 2 0 R >>');obj(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
 obj(3,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');
 offs[4]=len;push('4 0 obj\n<< /Type /XObject /Subtype /Image /Width '+w+' /Height '+h+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+jpg.length+' >>\nstream\n');push(jpg);push('\nendstream\nendobj\n');
 const cs='q 595.28 0 0 841.89 0 0 cm /Im0 Do Q';obj(5,'<< /Length '+cs.length+' >>\nstream\n'+cs+'\nendstream');
 const xr=len;let x='xref\n0 6\n0000000000 65535 f \n';for(let i=1;i<=5;i++)x+=String(offs[i]).padStart(10,'0')+' 00000 n \n';
 push(x+'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n'+xr+'\n%%EOF');
 const out=new Uint8Array(len);let p=0;for(const b of parts){out.set(b,p);p+=b.length}return out}
async function makeDossier(p){
 const S=1.6,W=1240,H=1754,cv=document.createElement('canvas');cv.width=Math.round(W*S);cv.height=Math.round(H*S);const c=cv.getContext('2d');
 try{await document.fonts.load('600 20px Cairo');await document.fonts.load('700 20px Montserrat')}catch(e){}
 const logo=new Image();logo.src=LOGO_OLD;try{await logo.decode()}catch(e){}
 const G='#0F3830',O='#FF6B00',FF="'Montserrat','Cairo',Arial,sans-serif",FA="'Cairo','Montserrat',Arial,sans-serif";
 const lv=D.fr[LV[p.lv]],lva=D.ar[LV[p.lv]],forms=p.forms.map(i=>FORM[i].n.fr).join(' · ');
 const wrap=(txt,w)=>{const L2=[];let cur='';for(const wd of txt.split(' ')){const tt=cur?cur+' '+wd:wd;if(c.measureText(tt).width>w&&cur){L2.push(cur);cur=wd}else cur=tt}if(cur)L2.push(cur);return L2};
 const draw=fs=>{
  c.setTransform(S,0,0,S,0,0);c.fillStyle='#fff';c.fillRect(0,0,W,H);
  const F=(w,s)=>w+' '+Math.round(s*fs)+'px '+FF,A=(w,s)=>w+' '+Math.round(s*fs)+'px '+FA;
  const para=(txt,x,y,w,lh,dir,font,col)=>{c.font=font;c.fillStyle=col||'#222';c.direction=dir;c.textAlign=dir==='rtl'?'right':'left';const px=dir==='rtl'?x+w:x;for(const l of wrap(txt,w)){y+=lh*fs;c.fillText(l,px,y)}return y};
  const box=(y,h)=>{c.fillStyle='#FFFDF0';c.fillRect(70,y,1100,h);c.strokeStyle='#E6E1D4';c.lineWidth=2;c.strokeRect(70,y,1100,h)};
  if(logo.naturalWidth){const lw=320;c.drawImage(logo,70,45,lw,lw*logo.naturalHeight/logo.naturalWidth)}
  c.fillStyle=G;c.textAlign='right';c.direction='ltr';c.font=F('700',25);c.fillText('Dossier d’inscription et autorisation parentale',1170,88);
  c.direction='rtl';c.font=A('700',27);c.fillText('ملف التسجيل وإذن ولي الأمر',1170,130);
  c.fillStyle=O;c.direction='ltr';c.font=F('600',21);c.fillText('Lycée Al Moutanabi · Agadir',1170,170);c.direction='rtl';c.font=A('600',21);c.fillText('ثانوية المتنبي · أكادير',1170,204);
  c.fillStyle=O;c.fillRect(70,228,1100,4);
  let y=252;c.font=F('600',21);const fl=wrap('Programmes choisis : '+forms,1060),bh=(3+fl.length)*34*fs+26;box(y,bh);
  c.fillStyle=G;c.direction='ltr';c.textAlign='left';c.font=F('700',21);let yy=y+14;
  [['Élève : '+p.nm],['ID : '+p.id+'     Niveau : '+lv+' / '+lva],['Date d’inscription : '+p.dt]].forEach(l=>{yy+=34*fs;c.fillText(l[0],90,yy)});
  c.font=F('600',20);fl.forEach(l=>{yy+=34*fs;c.fillText(l,90,yy)});
  y+=bh+30;
  c.fillStyle=G;c.direction='ltr';c.textAlign='left';c.font=F('700',22);c.fillText('Règlement du programme',70,y);c.direction='rtl';c.textAlign='right';c.font=A('700',22);c.fillText('النظام الداخلي للبرنامج',1170,y);
  c.fillStyle=O;c.fillRect(70,y+10,1100,2);
  let yl=y+14,yr=y+14;
  RULES.forEach((r,i)=>{yl=para((i+1)+'. '+r.fr,70,yl,530,25,'ltr',F('500',18))+8*fs;yr=para((i+1)+'. '+r.ar,640,yr,530,26,'rtl',A('500',18))+8*fs});
  y=Math.max(yl,yr)+14;
  const u=n=>'_'.repeat(n);
  const fr='Je soussigné(e) (nom et prénom) : '+u(26)+', titulaire de la CIN n° : '+u(16)+', en qualité de '+REL_FR[p.rel]+', autorise mon enfant '+p.nm+' (ID '+p.id+'), élève de '+lv+' au Lycée Al Moutanabi, à participer au programme Trajectoire et déclare avoir pris connaissance du règlement ci-dessus.';
  const ar='أنا الموقع(ة) أسفله (الاسم الكامل): '+u(26)+'، الحامل(ة) لبطاقة التعريف الوطنية رقم: '+u(16)+'، بصفتي '+REL_AR[p.rel]+'، أُرخّص لابني/ابنتي '+p.nm+' (المعرف '+p.id+')، تلميذ(ة) '+lva+' بثانوية المتنبي، بالمشاركة في برنامج مسار، وأُقرّ بأنني اطلعت على النظام الداخلي أعلاه.';
  c.font=F('600',20);const n1=wrap(fr,1060).length;c.font=A('600',20);const n2=wrap(ar,1060).length,ah=(n1+n2)*33*fs+34;box(y,ah);
  let y2=para(fr,90,y+6,1060,33,'ltr',F('600',20),G);y2=para(ar,90,y2+8,1060,33,'rtl',A('600',20),G);
  y+=ah+24;
  c.direction='ltr';c.textAlign='left';c.fillStyle=G;c.font=F('600',20);c.fillText('Fait à Agadir, le : ____ / ____ / ________',70,y+30);
  c.direction='rtl';c.textAlign='left';c.font=A('600',20);c.fillText('حُرّر بأكادير، بتاريخ: ____ / ____ / ________',70,y+68);
  c.direction='ltr';c.textAlign='right';c.font=F('600',18);c.fillText('Signature du parent / tuteur',1170,y+26);c.direction='rtl';c.font=A('600',18);c.fillText('توقيع ولي الأمر أو الوصي',1170,y+54);
  c.strokeStyle=G;c.lineWidth=2;c.strokeRect(850,y+66,320,100);
  c.direction='ltr';c.textAlign='center';c.fillStyle='#555';c.font=F('500',16);c.fillText('À remettre signé, en main propre, à l’organisateur du programme. Le compte élève est activé après réception du dossier.',W/2,H-50);
  c.direction='rtl';c.font=A('500',16);c.fillText('يُسلَّم موقعا يدا بيد إلى منظم البرنامج، ويُفعَّل حساب التلميذ بعد التوصل بالملف.',W/2,H-24);
  try{if(window.QRCode&&p.code){const d=document.createElement('div');new QRCode(d,{text:p.code,width:300,height:300,correctLevel:QRCode.CorrectLevel.L});const q=d.querySelector('canvas');if(q){c.direction='ltr';c.textAlign='left';c.fillStyle=G;c.font=F('600',16);c.fillText('Code dossier (QR)',560,y+24);c.drawImage(q,560,y+34,160,160)}}}catch(e){}
  return y+205};
 let fs=1;for(let k=0;k<8;k++){if(draw(fs)<=H-80)break;fs-=.05}
 p.fs=fs;const url=cv.toDataURL('image/jpeg',0.9),bin=atob(url.split(',')[1]),jpg=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)jpg[i]=bin.charCodeAt(i);
 return {pdf:jpegToPdf(jpg,cv.width,cv.height),url}}
function drawQR(c,text,x,y,size){try{if(!window.QRCode)return false;const d=document.createElement('div');new QRCode(d,{text,width:300,height:300,correctLevel:QRCode.CorrectLevel.L});const q=d.querySelector('canvas');if(!q)return false;c.drawImage(q,x,y,size,size);return true}catch(e){return false}}
async function makeFiche(p){
 const S=1.6,W=1240,H=1754,cv=document.createElement('canvas');cv.width=Math.round(W*S);cv.height=Math.round(H*S);const c=cv.getContext('2d');
 try{await document.fonts.load('600 20px Cairo');await document.fonts.load('700 20px Montserrat')}catch(e){}
 const loadI=async src=>{if(!src)return null;const i=new Image();i.src=src;try{await i.decode();return i}catch(e){return null}};
 const logo=await loadI((document.querySelector('.logo img')||{}).src),ph=await loadI(p.photo);
 const G='#0F3830',O='#FF6B00',FF="'Montserrat','Cairo',Arial,sans-serif",FA="'Cairo','Montserrat',Arial,sans-serif",F=(w,s)=>w+' '+s+'px '+FF,A=(w,s)=>w+' '+s+'px '+FA;
 const wrap=(txt,w)=>{const o=[];let cur='';for(const wd of String(txt).split(' ')){const tt=cur?cur+' '+wd:wd;if(c.measureText(tt).width>w&&cur){o.push(cur);cur=wd}else cur=tt}if(cur)o.push(cur);return o};
 c.setTransform(S,0,0,S,0,0);c.fillStyle='#fff';c.fillRect(0,0,W,H);
 if(logo)c.drawImage(logo,70,50,340,340*logo.naturalHeight/logo.naturalWidth);
 c.fillStyle=G;c.textAlign='right';c.direction='ltr';c.font=F('700',34);c.fillText('Fiche d’inscription',1170,92);c.direction='rtl';c.font=A('700',34);c.fillText('بطاقة التسجيل',1170,142);
 c.fillStyle=O;c.direction='ltr';c.font=F('600',20);c.fillText('Programme Trajectoire · Lycée Al Moutanabi',1170,186);c.direction='rtl';c.font=A('600',20);c.fillText('برنامج مسار · ثانوية المتنبي',1170,220);
 c.fillRect(70,246,1100,4);
 // photo
 c.save();c.beginPath();c.moveTo(94,290);c.arcTo(320,290,320,600,24);c.arcTo(320,600,70,600,24);c.arcTo(70,600,70,290,24);c.arcTo(70,290,320,290,24);c.closePath();c.clip();
 if(ph){const k=Math.max(250/ph.naturalWidth,310/ph.naturalHeight),w=ph.naturalWidth*k,h=ph.naturalHeight*k;c.drawImage(ph,70+(250-w)/2,290+(310-h)/2,w,h)}else{c.fillStyle='#FFF0E3';c.fillRect(70,290,250,310);c.fillStyle=O;c.textAlign='center';c.direction='ltr';c.font=F('700',110);c.fillText((p.nm[0]||'?').toUpperCase(),195,480)}c.restore();
 c.direction='ltr';c.textAlign='left';c.fillStyle=G;c.font=F('700',32);let y=330;wrap(p.nm,520).slice(0,2).forEach(l=>{c.fillText(l,350,y);y+=42});
 c.fillStyle=O;c.font=F('700',28);c.fillText('ID : '+p.id,350,y+6);y+=50;
 c.fillStyle='#222';c.font=F('600',21);c.fillText(D.fr[LV[p.lv]]+' · '+BR[p.lv][p.br][0],350,y);c.direction='rtl';c.textAlign='left';c.font=A('600',20);c.fillText(D.ar[LV[p.lv]]+' · '+BR[p.lv][p.br][1],350,y+36);y+=70;
 if(p.cl){c.direction='ltr';c.font=F('600',20);c.fillText('Classe : '+p.cl,350,y);y+=34}
 c.fillStyle=O;c.fillRect(350,y+4,300,40);c.fillStyle='#fff';c.direction='ltr';c.font=F('700',16);c.fillText('En attente de dossier signé',362,y+30);
 if(!drawQR(c,p.code||regCode(p),900,290,270)){c.strokeStyle=G;c.strokeRect(900,290,270,270)}
 c.fillStyle='#555';c.textAlign='center';c.direction='ltr';c.font=F('500',15);c.fillText('Code d’inscription (QR)',1035,590);
 const forms=p.forms.map(i=>FORM[i].n.fr).join(' · ');
 const rows=[['Date de naissance','تاريخ الازدياد',p.bd||'—'],['Téléphone de l’élève','هاتف التلميذ',p.sp||'—'],['E-mail de l’élève','البريد الإلكتروني للتلميذ',p.ml||'—'],['Parent / tuteur','ولي الأمر أو الوصي',p.pn],['Lien avec l’élève','صلة القرابة',REL_FR[p.rel]+' / '+REL_AR[p.rel]],['Téléphone du parent','هاتف ولي الأمر',p.ph],['E-mail du parent','البريد الإلكتروني لولي الأمر',p.pe||'—'],['Programmes choisis','البرامج المختارة',forms],['Date d’inscription','تاريخ التسجيل',p.dt]];
 y=650;rows.forEach((r,i)=>{c.font=F('700',21);const ls_=wrap(r[2],400),h=Math.max(58,ls_.length*30+24);c.fillStyle=i%2?'#fff':'#FFFDF0';c.fillRect(70,y,1100,h);
  c.fillStyle='#666';c.textAlign='left';c.direction='ltr';c.font=F('500',18);c.fillText(r[0],90,y+36);
  c.fillStyle=G;c.font=F('700',21);ls_.forEach((l,k)=>c.fillText(l,420,y+36+k*30));
  c.fillStyle='#666';c.textAlign='right';c.direction='rtl';c.font=A('500',18);c.fillText(r[1],1150,y+36);y+=h});
 c.strokeStyle='#E6E1D4';c.lineWidth=2;c.strokeRect(70,650,1100,y-650);
 y+=34;c.textAlign='left';c.direction='ltr';c.fillStyle='#222';c.font=F('500',19);wrap('Cette fiche est générée automatiquement. Présente-la avec le dossier d’autorisation signé : la gestion scanne le code QR pour retrouver ton inscription. Ton compte sera activé après réception du dossier signé.',1100).forEach(l=>{c.fillText(l,70,y);y+=28});
 c.textAlign='right';c.direction='rtl';c.font=A('500',19);y+=8;wrap('تُولَّد هذه البطاقة تلقائيا. قدّمها مع ملف الإذن الموقع: تمسح الإدارة رمز QR للعثور على تسجيلك، ويُفعَّل حسابك بعد التوصل بالملف الموقع.',1100).forEach(l=>{c.fillText(l,1170,y);y+=30});
 c.textAlign='center';c.direction='ltr';c.fillStyle='#777';c.font=F('500',15);c.fillText('Trajectoire · Accompagnement des adolescents · مسار',W/2,H-40);
 const url=cv.toDataURL('image/jpeg',0.9),bin=atob(url.split(',')[1]),jpg=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)jpg[i]=bin.charCodeAt(i);
 return {pdf:jpegToPdf(jpg,cv.width,cv.height),url,endY:y}}
async function dlPdf(w){const R=regDone,m=$('dlmsg');try{const dl=window.claude&&await window.claude.use('downloads');if(!dl){if(!window.claude){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([w===2?R.pdf2:R.pdf],{type:'application/pdf'}));a.download=(w===2?'fiche-inscription-':'dossier-autorisation-')+R.p.id+'.pdf';document.body.appendChild(a);a.click();a.remove();if(m)m.textContent=t('dlOk');return}if(m)m.textContent=t('dlNo');return}await dl.save({filename:(w===2?'fiche-inscription-':'dossier-autorisation-')+R.p.id+'.pdf',data:w===2?R.pdf2:R.pdf});if(m)m.textContent=t('dlOk')}catch(e){if(m)m.textContent=(e&&e.code==='unavailable')?t('dlNo'):t('dlNope')}}
async function dlAll(){await dlPdf(2);await dlPdf(1)}
