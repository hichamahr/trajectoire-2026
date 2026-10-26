// ============================================================
// 02-donnees.js : DONNEES : modules, écoles, formateurs, élèves, comptes de démonstration, formations, règlement.
// ============================================================

const MODS=[{n:{fr:'IA & Digital',ar:'الذكاء الاصطناعي والرقمي'},p:6},{n:{fr:'Média & Design',ar:'الإعلام والتصميم'},p:4},{n:{fr:'Soft Skills & Leadership',ar:'المهارات الحياتية والقيادة'},p:3},{n:{fr:'Orientation & Portfolio',ar:'التوجيه وملف الأعمال'},p:1}];
const TOT=8;
const proj=[];
const KC={ia:['#0F3830','IA'],vid:['#FF6B00','▶'],des:['#2D6B5C','✦']};
const KN={ia:'tIA',vid:'tVid',des:'tDes'};


const SCH=[{n:{fr:'Lycée Al Moutanabi',ar:'ثانوية المتنبي'},s:0,c:0}];
const CMP=[];
const ICON=['<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>','<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9l5 3-5 3z"/>','<path d="M4 5h16v10H9l-5 4z"/>','<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'];
const PTS=[[36,292],[180,200],[330,108],[398,34]];
const TR=[];
const DAYS=[{fr:'Lun',ar:'الإثنين'},{fr:'Mar',ar:'الثلاثاء'},{fr:'Mer',ar:'الأربعاء'},{fr:'Jeu',ar:'الخميس'},{fr:'Ven',ar:'الجمعة'}];
const TP=[];
const RK={student:'rS',school:'rE',trainer:'rF',manager:'rG',owner:'rP'};


const STU=[];
const FORM=MODS.map(m=>({n:m.n,d:{fr:'Module annuel · 4 sessions par mois',ar:'وحدة سنوية · 4 حصص شهريا'}}));
const REG=[];
const TM=[];let editF=null;
const TEAM=[];
const TASKS=[];
const ATT={};let asK=0,stab='e',ot='mem',of_=-1,camS=null;
const ACC=[];
const LV=['lvTC','lv1','lv2'];
const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const mkF=(n,a,dt,tr,sc)=>({n:{fr:n,ar:a},d:{fr:dt,ar:dt},dt,tr,sc});
const REPS=[];
let me=null,om='ca',ls={cat:null};
const BR={0:[['Sciences','علوم'],['Lettres et Sciences humaines','آداب وعلوم إنسانية'],['Technologique','تكنولوجي']],
1:[['Sciences expérimentales','علوم تجريبية'],['Sciences mathématiques','علوم رياضية'],['Lettres','آداب'],['Sciences humaines','علوم إنسانية'],['Sciences économiques et gestion','علوم اقتصادية وتدبير']],
2:[['Sciences physiques','علوم فيزيائية'],['Sciences de la vie et de la terre (SVT)','علوم الحياة والأرض'],['Sciences mathématiques','علوم رياضية'],['Sciences humaines','علوم إنسانية'],['Lettres','آداب'],['Sciences économiques','علوم اقتصادية']]};
const PEND=[],VAL=[];let RD={},RDF=[],regDone=null;
const RULES=[
{fr:'Participation : le programme est gratuit pour les élèves du Lycée Al Moutanabi dont le dossier signé a été remis à l’organisateur.',ar:'المشاركة: البرنامج مجاني لتلاميذ ثانوية المتنبي الذين سُلّم ملفهم موقعا إلى المنظم.'},
{fr:'Assiduité : 4 sessions par mois de 2h30. Toute absence doit être signalée au formateur.',ar:'المواظبة: 4 حصص في الشهر مدة كل منها ساعتان ونصف. يجب إخبار المؤطر بكل غياب.'},
{fr:'Présence : elle est enregistrée à chaque session grâce au QR code personnel de l’élève.',ar:'الحضور: يُسجَّل في كل حصة بواسطة رمز QR الشخصي للتلميذ.'},
{fr:'Comportement : respect des formateurs, des camarades et du matériel. Aucun propos ni contenu offensant.',ar:'السلوك: احترام المؤطرين والزملاء والتجهيزات، ومنع أي كلام أو محتوى مسيء.'},
{fr:'Numérique et IA : usage responsable des outils, sans plagiat, sans contenu illégal et sans partage de données personnelles.',ar:'الرقمنة والذكاء الاصطناعي: استعمال مسؤول للأدوات دون انتحال أو محتوى غير قانوني أو تبادل معطيات شخصية.'},
{fr:'Image : des photos et vidéos peuvent être réalisées pendant les sessions pour présenter le programme. Tout refus doit être signalé par écrit à l’organisateur.',ar:'الصورة: قد تُلتقط صور وفيديوهات أثناء الحصص للتعريف بالبرنامج، ويُبلَّغ المنظم كتابيا بأي رفض.'},
{fr:'Données personnelles : elles servent uniquement à la gestion du programme, conformément à la loi 09-08.',ar:'المعطيات الشخصية: تُستعمل فقط لتدبير البرنامج وفق القانون 09-08.'},
{fr:'Sanctions : en cas de manquements répétés, l’organisateur peut suspendre la participation après avoir informé la famille.',ar:'الجزاءات: عند تكرار المخالفات يمكن للمنظم تعليق المشاركة بعد إخبار الأسرة.'}];
const REL_FR={f:'père',m:'mère',w:'tuteur légal (wali)'},REL_AR={f:'الأب',m:'الأم',w:'الوصي (الولي)'};
