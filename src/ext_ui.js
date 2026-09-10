/* ===== ESTENSIONI: scheda, incantesimi, punti interattivi, muri/porte, bestiario ===== */
const ABIL_SKILLS={For:['Atletica'],Des:['Acrobazia','Furtività','Rapidità di mano'],Cos:[],Int:['Arcano','Indagare','Storia','Natura','Religione'],Sag:['Percezione','Intuizione','Medicina','Sopravvivenza','Addestrare animali'],Car:['Persuasione','Inganno','Intimidire','Intrattenere']};
const modCalc=v=>Math.floor((v-10)/2);
const fmtMod=v=>(v>=0?'+':'−')+Math.abs(v);

/* ---------- modale generica ---------- */
function openModal(html,cls){ const m=document.getElementById('modal'); m.querySelector('.box').className='box '+(cls||''); m.querySelector('.box').innerHTML=`<button class="close" title="Chiudi">×</button>`+html; m.style.display='flex'; m.querySelector('.close').onclick=closeModal; }
function closeModal(){ document.getElementById('modal').style.display='none'; }
document.getElementById('modal').addEventListener('click',e=>{ if(e.target.id==='modal') closeModal(); });
window.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModal(); });

/* ---------- scheda del personaggio ---------- */
let sheetTab='car';
function canAct(id){ return IS_GM || id===me; }
function openSheet(id,tab){ if(tab) sheetTab=tab; renderSheet(id); }
function renderSheet(id){
  const t=S.tokens[id], sh=SHEETS[id]; if(!t||!sh) return;
  const mine=canAct(id);
  const tabs=[['car','Caratteristiche'],['inc','Incantesimi'],['eq','Equipaggiamento'],['sto','Storia']].filter(([k])=>k!=='inc'||sh.spell);
  let body='';
  if(sheetTab==='car'){
    body+=`<div class="abils">`+Object.entries(sh.abil).map(([k,v])=>`<div class="ab"><div class="k">${k}</div><div class="v">${v}</div><div class="m">${fmtMod(modCalc(v))}</div><button class="roll ${mine?'':'off'}" data-roll="TS ${k}" title="Tiro salvezza">TS ${fmtMod(t.mods['TS '+k]??modCalc(v))}</button></div>`).join('')+`</div>`;
    body+=`<div class="skills">`+Object.entries(ABIL_SKILLS).flatMap(([a,list])=>list.map(s=>`<button class="sk ${mine?'':'off'}" data-roll="${s}"><span>${s}</span><small>${a}</small><b>${fmtMod(t.mods[s]??0)}</b></button>`)).join('')+`</div>`;
    body+=`<div class="kv" style="margin-top:12px"><b>Classe</b><span>${t.cls||''}</span><b>Classe armatura</b><span>${t.ac}</span><b>Punti ferita</b><span>${t.hp} / ${t.hpMax}</span><b>Velocità</b><span>${sh.speed} m</span><b>Competenza</b><span>+${sh.prof}</span><b>Iniziativa</b><span>${fmtMod(t.mods.Iniziativa||0)}</span></div>`;
    body+=`<h3>Privilegi</h3><ul>${(sh.features||[]).map(f=>`<li>${f}</li>`).join('')}</ul><h3>Talenti</h3><ul>${(sh.feats||[]).map(f=>`<li>${f}</li>`).join('')}</ul>`;
  } else if(sheetTab==='inc' && sh.spell){
    const sp=sh.spell, used=t.used||{};
    body+=`<div class="kv"><b>Caratteristica</b><span>${sp.stat}</span><b>CD incantesimi</b><span>${sp.dc}</span><b>Attacco con incantesimo</b><span>+${sp.atk}</span></div>`;
    body+=`<div class="slots">`+Object.entries(sp.slots).map(([l,n])=>`<div class="slot"><span class="eyebrow">Livello ${l}</span><div class="pips">${Array.from({length:n},(_,i)=>`<i class="${i<(used[l]||0)?'used':''}" data-slot="${l}" data-i="${i}" title="${mine?'clicca per spendere / recuperare':''}"></i>`).join('')}</div></div>`).join('')+(sp.points?`<div class="slot"><span class="eyebrow">Punti stregoneria</span><div class="pips">${Array.from({length:sp.points},(_,i)=>`<i class="${i<(t.pts||0)?'used':''}" data-pt="${i}"></i>`).join('')}</div></div>`:'')+`</div>`;
    if(mine) body+=`<div class="row" style="margin:6px 0 10px"><button id="restShort">Riposo breve</button><button id="restLong">Riposo lungo (recupera tutto)</button></div>`;
    const byLvl={}; for(const n of sp.list){ const d=SPELLS[n]; if(!d) continue; (byLvl[d.l]=byLvl[d.l]||[]).push([n,d]); }
    for(const l of Object.keys(byLvl).sort()){
      body+=`<h3>${l==='0'?'Trucchetti':'Livello '+l}</h3>`;
      for(const [n,d] of byLvl[l]){
        const can=mine&&(l==='0'||(used[l]||0)<(sp.slots[l]||0));
        body+=`<details class="spell"><summary><span class="nm">${d.it}</span><span class="en">${n}</span><span class="tm">${d.t} · ${d.r}</span>${mine?`<button class="cast ${can?'primary':''}" data-cast="${n}" ${can?'':'disabled'}>${l==='0'?'Usa':'Lancia'}</button>`:''}</summary><p>${d.d}</p></details>`;
      }
    }
  } else if(sheetTab==='eq'){
    body+=`<h3>Equipaggiamento</h3><ul>${(sh.equip||[]).map(f=>`<li>${f}</li>`).join('')}</ul><h3>Azioni in combattimento</h3><ul>${(t.actions||[]).map(a=>`<li>${a.n}${a.atk!=null?` · colpire +${a.atk}`:''}${a.dmg?` · danno ${a.dmg}`:''}</li>`).join('')}</ul>`;
  } else {
    body+=`<p class="lore">${sh.lore}</p>`;
  }
  openModal(`<div class="sheethead"><div class="portrait" style="background-image:url(${t.img})"></div><div><div class="eyebrow">${t.cls||''}</div><h2 class="big">${t.name}</h2><div class="note">PF ${t.hp}/${t.hpMax} · CA ${t.ac}${t.init!=null?' · Iniziativa '+t.init:''}</div></div></div><div class="tabs">${tabs.map(([k,l])=>`<button class="${sheetTab===k?'on':''}" data-tab="${k}">${l}</button>`).join('')}</div><div class="sheetbody">${body}</div>`,'sheet');
  const box=document.querySelector('#modal .box');
  box.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{ sheetTab=b.dataset.tab; renderSheet(id); });
  if(mine){
    box.querySelectorAll('[data-roll]').forEach(b=>b.onclick=()=>{ const sk=b.dataset.roll; if(IS_GM) rollFor(id,sk); else doRoll(sk,null,null); toast(`${t.name}: tiro di ${sk} nel registro`); });
    box.querySelectorAll('[data-slot]').forEach(p=>p.onclick=()=>{ const l=p.dataset.slot, i=+p.dataset.i; t.used=t.used||{}; t.used[l]=(i<(t.used[l]||0))?i:i+1; save(); renderSheet(id); });
    box.querySelectorAll('[data-pt]').forEach(p=>p.onclick=()=>{ const i=+p.dataset.pt; t.pts=(i<(t.pts||0))?i:i+1; save(); renderSheet(id); });
    box.querySelectorAll('[data-cast]').forEach(b=>b.onclick=()=>castSpell(id,b.dataset.cast));
    const rs=box.querySelector('#restShort'); if(rs) rs.onclick=()=>{ log({kind:'sys',txt:`${t.name} fa un riposo breve`}); save(); renderSheet(id); };
    const rl=box.querySelector('#restLong'); if(rl) rl.onclick=()=>{ t.used={}; t.pts=0; t.hp=t.hpMax; t.lay=0; log({kind:'sys',txt:`${t.name} fa un riposo lungo: PF e slot al massimo`}); save(); renderSheet(id); };
  }
}
function castSpell(id,name){
  const t=S.tokens[id], sh=SHEETS[id], d=SPELLS[name]; if(!t||!sh||!d) return;
  const sp=sh.spell, l=d.l;
  if(l>0){ t.used=t.used||{}; if((t.used[l]||0)>=(sp.slots[l]||0)){ toast('Nessuno slot di livello '+l); return; } t.used[l]=(t.used[l]||0)+1; }
  const ev={kind:'spell',who:t.name,name:d.it,lvl:l};
  if(d.atk){ const r=d20(); ev.r=r; ev.atk=r+sp.atk; ev.crit=r===20; }
  if(d.dmg){ const x=rollExpr(d.dmg); ev.dmg=x.total; ev.dmgTxt=x.parts; }
  if(d.heal){ const x=rollExpr(d.heal); const mod=modCalc(sh.abil[sp.stat])+(id==='mattheus'?2+5:0); ev.heal=x.total+mod; ev.healTxt=x.parts+' + '+mod; }
  log(ev); save(true); renderSheet(id);
}

/* ---------- punti interattivi ---------- */
const poisEl=document.getElementById('pois');
function poiVisible(p){ return IS_GM || fogVisible(p.x,p.y); }
function renderPois(){
  poisEl.innerHTML='';
  for(const p of POIS){
    if(!poiVisible(p)) continue;
    const d=document.createElement('div'); d.className='poi'; d.style.left=p.x+'px'; d.style.top=p.y+'px'; d.title=p.title; d.innerHTML='<i></i>';
    d.addEventListener('pointerdown',e=>e.stopPropagation());
    d.onclick=()=>openPoi(p);
    poisEl.appendChild(d);
  }
}
function openPoi(p){
  let html=`<div class="eyebrow">Punto d’interesse</div><h2 class="big">${p.title}</h2>`;
  if(p.img&&POI_IMGS[p.img]) html+=`<img class="poiimg" src="${POI_IMGS[p.img]}" alt="">`;
  html+=`<p class="lore">${p.text}</p>`;
  if(IS_GM){ html+=`<div class="gmbox"><div class="eyebrow">Solo master</div><p>${p.gm||''}</p>${p.skill?`<div class="row"><span class="eyebrow">Prova suggerita</span><b>${p.skill} CD ${p.dc}</b><select id="poiWho">${Object.entries(S.tokens).filter(([,x])=>x.kind==='pg').map(([i,x])=>`<option value="${i}">${x.name}</option>`).join('')}</select><button class="primary" id="poiAsk">Richiedi</button></div>`:''}</div>`; }
  openModal(html,'poi');
  const b=document.querySelector('#modal #poiAsk'); if(b) b.onclick=()=>{ const who=document.getElementById('poiWho').value; S.request={id:'r-'+Date.now(),skill:p.skill,dc:p.dc,targets:[who]}; log({kind:'sys',txt:`Il master chiede a ${S.tokens[who].name} una prova di ${p.skill}`}); save(true); closeModal(); };
}

/* ---------- muri e porte (editor del master) ---------- */
const wallsC=document.getElementById('walls'), wallsCtx=wallsC.getContext('2d');
let editTool=null; // 'wall' | 'door'
const cellKey=(x,y)=>Math.floor(x/30)+','+Math.floor(y/30);
function drawWalls(){
  wallsCtx.clearRect(0,0,MAP_W,MAP_H);
  const G=30;
  if(IS_GM&&editTool==='wall'){
    for(let cy=0;cy<MASK.length;cy++) for(let cx=0;cx<MASK[0].length;cx++){ const ok=walkable(cx*G+15,cy*G+15); wallsCtx.fillStyle=ok?'rgba(110,158,91,.22)':'rgba(181,57,44,.28)'; wallsCtx.fillRect(cx*G,cy*G,G,G); }
  }
  const doors=S.doors||{};
  for(const [k,v] of Object.entries(doors)){ const [cx,cy]=k.split(',').map(Number); wallsCtx.fillStyle=v==='c'?'#7A5A3A':'rgba(122,90,58,.35)'; wallsCtx.strokeStyle='#C9A24A'; wallsCtx.lineWidth=2; wallsCtx.beginPath(); wallsCtx.rect(cx*G+4,cy*G+4,G-8,G-8); wallsCtx.fill(); wallsCtx.stroke(); if(v==='c'){ wallsCtx.fillStyle='#C9A24A'; wallsCtx.beginPath(); wallsCtx.arc(cx*G+G-10,cy*G+G/2,2.5,0,7); wallsCtx.fill(); } }
}
function setEditTool(t){ editTool=(editTool===t)?null:t; if(editTool){ if(fogTool) setFogTool(fogTool); measuring=false; stage.classList.remove('measuring'); document.getElementById('btnMeasure').classList.remove('primary'); } stage.classList.toggle('fogtool',!!editTool); document.getElementById('wallTool').classList.toggle('primary',editTool==='wall'); document.getElementById('doorTool').classList.toggle('primary',editTool==='door'); drawWalls(); }
document.getElementById('wallTool').onclick=()=>setEditTool('wall');
document.getElementById('doorTool').onclick=()=>setEditTool('door');
function editAt(x,y,first){
  const k=cellKey(x,y);
  if(editTool==='wall'){ S.walls=S.walls||{}; if(first) paintVal=walkable(x,y)?0:1; if(paintVal===1&&MASK[Math.floor(y/30)]?.[Math.floor(x/30)]==='1') delete S.walls[k]; else if(paintVal===0&&MASK[Math.floor(y/30)]?.[Math.floor(x/30)]!=='1') delete S.walls[k]; else S.walls[k]=paintVal; }
  else if(editTool==='door'&&first){ S.doors=S.doors||{}; if(S.doors[k]) delete S.doors[k]; else S.doors[k]='c'; }
  drawWalls(); drawFog();
}
let paintVal=1;
function doorClickAt(x,y){ const k=cellKey(x,y); if(S.doors&&S.doors[k]){ S.doors[k]=S.doors[k]==='c'?'o':'c'; log({kind:'sys',txt:`Porta ${S.doors[k]==='c'?'chiusa':'aperta'}`}); save(true); return true; } return false; }

/* ---------- bestiario ---------- */
const bestSel=document.getElementById('bestSel');
for(const b of BESTIARIO) bestSel.add(new Option(b.name+(b.note.startsWith('PROPOSTA')?' (proposta)':''),b.id));
document.getElementById('btnAddBest').onclick=()=>{
  const b=BESTIARIO.find(x=>x.id===bestSel.value); if(!b) return;
  const id='n'+Date.now();
  // cerca una casella libera vicino al centro dell'area visibile
  const r=stage.getBoundingClientRect(); const c=toMap({clientX:r.left+r.width/2,clientY:r.top+r.height/2}); let p=snap(c);
  if(!walkable(p.x,p.y)){ outer: for(let d=1;d<12;d++) for(let dx=-d;dx<=d;dx++) for(let dy=-d;dy<=d;dy++){ const q={x:p.x+dx*30,y:p.y+dy*30}; if(walkable(q.x,q.y)){ p=q; break outer; } } }
  S.tokens[id]={custom:true,name:b.name,short:b.short,kind:'nemico',color:b.color,x:p.x,y:p.y,hp:b.hp,hpMax:b.hp,ac:b.ac,init:null,hidden:true,size:b.size||1,noInit:!!b.noInit,mods:{Iniziativa:b.init},actions:b.actions,note:b.note};
  selected=id; log({kind:'sys',gm:true,txt:`${b.name} messo sulla mappa (nascosto)`}); save();
};
