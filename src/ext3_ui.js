/* ===== ESTENSIONI 3: scene — Sotto Bëllindë, il borgo di Bëllindë, i luoghi ===== */
const SCENES={
  sotto:{id:'sotto',name:'Sotto Bëllindë — Oltre la Porta',src:MAP_SRC,w:1448,h:1086,grid:true,fog:true,walls:true,tokens:true},
  bellinde:{id:'bellinde',name:'Bëllindë — il borgo',src:BELLINDE_SRC,w:1600,h:1200,grid:false,fog:false,walls:false,tokens:'party'}
};
let CUR=SCENES.sotto;
function sceneOf(key){ if(!key||key==='sotto') return SCENES.sotto; if(key==='bellinde') return SCENES.bellinde; if(key.startsWith('luogo:')){ const l=LUOGHI.find(x=>x.id===key.slice(6)); if(l) return {id:'luogo',luogo:l,name:l.name,tokens:false}; } return SCENES.sotto; }
function applyScene(){
  const sc=sceneOf(S.scene); const changed=sc.id!==CUR.id||(sc.luogo&&CUR.luogo!==sc.luogo);
  CUR=sc;
  const isMap=sc.id!=='luogo';
  document.getElementById('world').style.display=isMap?'':'none';
  document.getElementById('luogoView').style.display=isMap?'none':'';
  document.getElementById('zoomctl').style.display=isMap?'':'none';
  document.getElementById('hud').style.display=isMap?'':'none';
  if(isMap&&changed){ MAP_W=sc.w; MAP_H=sc.h; const img=document.getElementById('mapimg'); img.src=sc.src; img.style.width=sc.w+'px'; img.style.height=sc.h+'px'; for(const id of ['fog','walls']){ const c=document.getElementById(id); c.width=sc.w; c.height=sc.h; } lastPing=0; setTimeout(fit,30); }
  document.querySelectorAll('.dungeon-only').forEach(e=>e.classList.toggle('hidden',sc.id!=='sotto'));
  if(!isMap) renderLuogo(sc.luogo);
  renderSceneSel();
}
function renderSceneSel(){
  const sel=document.getElementById('sceneSel'); if(!sel) return;
  if(!sel.options.length){ sel.add(new Option('Sotto Bëllindë','sotto')); sel.add(new Option('Bëllindë — il borgo','bellinde')); for(const l of LUOGHI) sel.add(new Option(`${l.num}. ${l.name}`,'luogo:'+l.id)); }
  sel.value=S.scene||'sotto';
  document.getElementById('sceneName').textContent=CUR.name;
}
function gotoScene(key){ S.scene=key; log({kind:'sys',txt:`Il master porta il gruppo a: ${sceneOf(key).name}`}); save(true); }

/* ---------- Bëllindë: segnaposti dei luoghi ---------- */
const placesEl=document.getElementById('places');
function renderPlaces(){
  placesEl.innerHTML=''; if(CUR.id!=='bellinde') return;
  for(const l of LUOGHI){ const d=document.createElement('div'); d.className='place'; d.style.left=l.x+'px'; d.style.top=l.y+'px'; d.innerHTML=`<b>${l.num}</b><span>${l.name}</span>`; d.addEventListener('pointerdown',e=>e.stopPropagation()); d.onclick=()=>openPlace(l); placesEl.appendChild(d); }
}
function openPlace(l){
  const est=(l.secs.find(s=>s.t==='Aspetto esterno')||{}).txt||'';
  openModal(`<div class="eyebrow">Luogo ${l.num}</div><h2 class="big">${l.name}</h2><img class="poiimg" src="${l.img}" alt=""><p class="lore">${est}</p><div class="row" style="margin-top:12px">${IS_GM?`<button class="primary" id="plVisit">Visita: porta qui il gruppo</button>`:`<button class="primary" id="plPropose">Chiedi al master di andare qui</button>`}</div>`,'poibox');
  const v=document.querySelector('#modal #plVisit'); if(v) v.onclick=()=>{ closeModal(); gotoScene('luogo:'+l.id); };
  const p=document.querySelector('#modal #plPropose'); if(p) p.onclick=()=>{ closeModal(); log({kind:'sys',txt:`${S.tokens[me]?S.tokens[me].name:'Un giocatore'} vuole andare a: ${l.name}`}); doPing({x:l.x,y:l.y}); };
}

/* ---------- Bëllindë: token del gruppo ---------- */
function renderPartyToken(){
  if(CUR.id!=='bellinde') return;
  const p=S.party||{x:765,y:640}; const d=document.createElement('div'); d.className='tok party'; d.dataset.id='__party'; d.style.left=p.x+'px'; d.style.top=p.y+'px'; d.style.width=d.style.height='54px'; d.style.setProperty('--c','#C9A24A');
  const first=Object.values(S.tokens).find(t=>t.kind==='pg'&&t.tokimg); if(first) d.style.backgroundImage=`url(${first.tokimg})`;
  d.innerHTML=`<span class="lbl">Il gruppo</span>`;
  d.addEventListener('pointerdown',e=>{ e.stopPropagation(); e.preventDefault(); dragging=true; const el=d; let moved=false; const mv=ev=>{ moved=true; const q=toMap(ev); el.style.left=q.x+'px'; el.style.top=q.y+'px'; }; const up=ev=>{ window.removeEventListener('pointermove',mv); window.removeEventListener('pointerup',up); dragging=false; if(moved){ const q=toMap(ev); S.party={x:Math.round(q.x),y:Math.round(q.y)}; save(); } else render(); }; window.addEventListener('pointermove',mv); window.addEventListener('pointerup',up); });
  tokensEl.appendChild(d);
}

/* ---------- vista Luogo ---------- */
function secText(l,title){ const s=l.secs.find(x=>x.t===title); return s&&s.txt?s.txt:''; }
function renderLuogo(l){
  const v=document.getElementById('luogoView');
  const player=['Aspetto esterno','Entrando','Cosa si vede automaticamente'].map(t=>{ const x=secText(l,t); return x?`<h3>${t}</h3><p>${x.replace(/\n/g,'<br>')}</p>`:''; }).join('');
  v.innerHTML=`<div class="lv-img" style="background-image:url(${l.img})"></div><div class="lv-text"><div class="eyebrow">Bëllindë · luogo ${l.num}</div><h2>${l.name}</h2>${player}</div>`;
  renderLuogoGM(l);
}
function renderLuogoGM(l){
  const box=document.getElementById('luogoGM'); if(!box) return;
  if(!IS_GM||CUR.id!=='luogo'){ box.classList.add('hidden'); return; }
  box.classList.remove('hidden');
  const pgs=Object.entries(S.tokens).filter(([,x])=>x.kind==='pg');
  let html=`<h2>Handout — ${l.name}</h2><div class="kv" style="font-size:13px">${Object.entries(l.fields).map(([k,v])=>`<b>${k}</b><span>${v}</span>`).join('')}</div>`;
  for(const s of l.secs){
    if(['Aspetto esterno','Entrando','Cosa si vede automaticamente'].includes(s.t)) continue;
    html+=`<details ${s.t==='Cosa sta succedendo oggi'||s.checks?'open':''}><summary>${s.t}</summary>`;
    if(s.checks){ for(const c of s.checks){ html+=`<div class="check"><div class="row split"><b>${c.t}</b>${c.skill&&c.dc?`<span><select class="ckWho">${pgs.map(([i,x])=>`<option value="${i}">${x.name.split(' ')[0]}</option>`).join('')}</select><button class="primary ckAsk" data-skill="${c.skill}" data-dc="${c.dc}">Richiedi</button></span>`:''}</div><div class="outcome"><div><span class="pass">Successo</span><p>${c.ok}</p></div><div><span class="fail">Fallimento</span><p>${c.ko}</p></div></div></div>`; } }
    else html+=`<p>${(s.txt||'').replace(/\n/g,'<br>')}</p>`;
    html+=`</details>`;
  }
  box.innerHTML=html;
  box.querySelectorAll('.ckAsk').forEach(b=>b.onclick=()=>{ const who=b.parentElement.querySelector('.ckWho').value; const skill=b.dataset.skill.replace('Rapidità di Mano','Rapidità di mano'); S.request={id:'r-'+Date.now(),skill,dc:+b.dataset.dc,targets:[who]}; log({kind:'sys',txt:`Il master chiede a ${S.tokens[who].name} una prova di ${skill}`}); save(true); toast('Richiesta inviata a '+S.tokens[who].name); });
}
document.getElementById('sceneSel').onchange=e=>gotoScene(e.target.value);
