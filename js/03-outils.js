// ============================================================
// 03-outils.js : OUTILS : petites fonctions utilisées partout.
// ============================================================

const $=id=>document.getElementById(id);
const fmt=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
const stu=id=>STU.find(s=>s.id===id),pc=s=>Math.round(s.m.reduce((a,b)=>a+b,0)/(TOT*4)*100);
const visF=sc=>FORM.map((f,i)=>[f,i]).filter(([f])=>!f.del&&(f.sc===undefined||f.sc<0||f.sc===sc));
const fRow=f=>`<div class="sess" style="grid-template-columns:92px 1fr"><b>${f.dt}</b><div class="t">${esc(L(f.n))}<br><small style="color:var(--muted)">${trN(f.tr)} · ${f.sc<0?t('allSch'):L(SCH[f.sc].n)}</small></div></div>`;
const created=fn=>FORM.filter(f=>f.dt&&!f.del&&fn(f)).sort((a,b)=>a.dt<b.dt?-1:1);
const planned=fn=>created(fn).map(fRow).join('')||`<p style="color:var(--muted)">${t('noNext')}</p>`;
const av=(s,z)=>s.photo?`<img src="${s.photo}" alt="" style="width:${z}px;height:${z}px;border-radius:50%;object-fit:cover;flex:none">`:`<span class="av" style="width:${z}px;height:${z}px;font-size:${Math.round(z*.42)}px">${s.n.fr[0]}</span>`;
const regRows=R=>R.map(r=>`<div class="grp" style="grid-template-columns:1fr 1fr auto"><span>${L(stu(r.s).n)}<small>${r.s}</small></span><b>${L(FORM[r.f].n)}</b><small>${r.dt}</small></div>`).join('')||`<p style="color:var(--muted)">${t('noReg')}</p>`;
const todayS=()=>new Date().toISOString().slice(0,10);
const BELL='<path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7M10 20a2 2 0 0 0 4 0"/>';
const brL=(lv,i,l)=>{const b=(BR[lv]||BR[0])[i]||(BR[lv]||BR[0])[0];return (l||lang)==='fr'?b[0]:b[1]};
const brOptions=(lv,sel)=>BR[lv].map((b,i)=>`<option value="${i}" ${i==sel?'selected':''}>${lang==='fr'?b[0]:b[1]}</option>`).join('');
const svg=d=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;

const trN=i=>TR[i]?trN(i):'—';
