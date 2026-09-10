/* ===== ESTENSIONI 4: handout del luogo per il master — PNG, scene collegate, appunti, accaduto, mostra ai giocatori ===== */
function normKey(s){ return (s||'').normalize('NFKD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z]/g,''); }
function findPng(name){ const k=normKey(name.replace(/^PNG\s*—\s*/,'')); return PNGS.find(p=>p.id===k||normKey(p.name)===k||normKey(p.name).startsWith(k)||k.startsWith(normKey(p.name).slice(0,12))); }
function findScene(title){ const k=normKey(title); return SCENE_HANDOUTS.find(s=>s.id===k||normKey(s.title)===k||normKey(s.title).endsWith(k.slice(-14))); }
function refsIn(text,prefix){ const out=[]; const re=new RegExp('\\[('+prefix+')\\s*—\\s*([^\\]]+)\\]','g'); let m; while((m=re.exec(text||''))) out.push(m[2].trim()); return [...new Set(out)]; }

/* ---------- mostra ai giocatori (immagine o testo) ---------- */
let lastShow=0;
function showToPlayers(payload){ S.show=Object.assign({t:Date.now()},payload); log({kind:'sys',txt:`Il master mostra: ${payload.title||'un’immagine'}`}); save(true); }
function renderShow(){ const s=S.show; if(!s||s.t===lastShow) return; lastShow=s.t; if(IS_GM) return; if(Date.now()-s.t>15000) return; openModal(`${s.title?`<h2 class="big">${s.title}</h2>`:''}${s.img?`<img class="poiimg" style="max-height:70vh;object-fit:contain" src="${s.img}" alt="">`:''}${s.text?`<p class="lore">${s.text.replace(/\n/g,'<br>')}</p>`:''}`,'poibox'); }

/* ---------- scheda PNG ---------- */
function openPng(p){
  const f=p.fields||{};
  let html=`<div class="sheethead"><div class="portrait" style="background-image:url(${p.img||''})"></div><div><div class="eyebrow">${f.Ruolo||'PNG'}</div><h2 class="big">${p.name}</h2><div class="note">${[f['Luogo abituale'],f['Età'],f.Statistiche].filter(Boolean).join(' · ')}</div></div></div>`;
  if(p.descr) html+=`<p class="lore" style="font-size:15px">${p.descr}</p>`;
  html+=`<div class="pngbox">${['Voce','Cosa vuole','Come lo si conquista','Segreto','Cosa teme'].filter(k=>f[k]).map(k=>`<div><span class="eyebrow">${k}</span><p>${f[k]}</p></div>`).join('')}</div>`;
  for(const s of p.secs){ if(!s.txt) { html+=`<h3>${s.t}</h3>`; continue; } html+=`<details ${s.l===2?'open':''}><summary style="cursor:pointer;font-family:var(--display);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);margin-top:10px">${s.t}</summary><p class="lore" style="font-size:14px">${s.txt.replace(/\n/g,'<br>')}</p></details>`; }
  if(f.Sa||f['Non sa']) html+=`<div class="pngbox" style="margin-top:10px">${f.Sa?`<div><span class="eyebrow">Sa</span><p>${f.Sa}</p></div>`:''}${f['Non sa']?`<div><span class="eyebrow">Non sa</span><p>${f['Non sa']}</p></div>`:''}</div>`;
  if(IS_GM&&p.img) html+=`<div class="row" style="margin-top:14px"><button class="primary" id="pngShow">Mostra il ritratto ai giocatori</button></div>`;
  openModal(html,'sheet');
  const b=document.querySelector('#modal #pngShow'); if(b) b.onclick=()=>{ showToPlayers({img:p.img,title:p.name}); toast('Ritratto mostrato ai giocatori'); };
}
function openSceneHandout(sc){
  let html=`<div class="eyebrow">Handout</div><h2 class="big">${sc.title}</h2>${sc.intro?`<p class="lore" style="font-size:14px">${sc.intro.replace(/\n/g,'<br>')}</p>`:''}`;
  for(const s of sc.secs){ html+=`<h3>${s.t}</h3><p class="lore" style="font-size:14px">${(s.txt||'').replace(/\n/g,'<br>')}</p>`; }
  openModal(html,'sheet');
}

/* ---------- pannello handout del luogo (sostituisce renderLuogoGM) ---------- */
function renderLuogoGM(l){
  const box=document.getElementById('luogoGM'); if(!box) return;
  if(!IS_GM||CUR.id!=='luogo'){ box.classList.add('hidden'); return; }
  box.classList.remove('hidden');
  const pgs=Object.entries(S.tokens).filter(([,x])=>x.kind==='pg');
  const allText=l.secs.map(s=>(s.txt||'')+(s.checks||[]).map(c=>c.ok+c.ko).join(' ')).join(' ')+Object.values(l.fields).join(' ');
  const pngNames=[...new Set([...refsIn((l.secs.find(s=>s.t==='Persone presenti')||{}).txt,'PNG'),...refsIn(allText,'PNG')])];
  const sceneNames=refsIn(allText,'SCENA|EVENTO|SITUAZIONE|INDAGINE|INSEGUIMENTO|TRANSIZIONE|CLIMAX|AFTERMATH');
  const secByT=t=>l.secs.find(s=>s.t===t);
  let html=`<h2>Handout — ${l.name}</h2><div class="kv" style="font-size:13px">${Object.entries(l.fields).filter(([k])=>k!=='Collegato a').map(([k,v])=>`<b>${k}</b><span>${v}</span>`).join('')}</div>`;
  // 1. da leggere
  const read=['Aspetto esterno','Entrando','Cosa si vede automaticamente'].map(t=>({t,txt:(secByT(t)||{}).txt})).filter(x=>x.txt);
  html+=`<details open><summary>Da leggere ai giocatori</summary>${read.map(x=>`<div class="readblock"><div class="row split"><span class="eyebrow">${x.t}</span><button class="mini" data-readshow="${x.t}">In evidenza</button></div><p>${x.txt.replace(/\n/g,'<br>')}</p></div>`).join('')}<div class="row"><button class="mini" id="showLuogoImg">Mostra l’immagine a tutto schermo</button></div></details>`;
  // 2. oggi
  const oggi=secByT('Cosa sta succedendo oggi'); if(oggi) html+=`<details open><summary>Cosa sta succedendo oggi</summary><p>${oggi.txt.replace(/\n/g,'<br>')}</p></details>`;
  // 3. persone
  const pngs=pngNames.map(n=>findPng(n)).filter(Boolean);
  html+=`<details open><summary>Persone presenti (${pngs.length})</summary><div class="pnggrid">${pngs.map(p=>`<div class="pngcard" data-png="${p.id}"><div class="pp" style="background-image:url(${p.img||''})"></div><div><b>${p.name}</b><small>${(p.fields||{}).Ruolo||''}</small></div></div>`).join('')||'<span class="note">nessun PNG collegato</span>'}</div>${(secByT('Persone presenti')||{}).txt?`<p class="note" style="margin-top:6px">${secByT('Persone presenti').txt.replace(/\n/g,'<br>')}</p>`:''}</details>`;
  // 4. prove
  const notare=secByT('Cosa si può notare');
  if(notare&&notare.checks){ html+=`<details open><summary>Cosa si può notare — prove</summary>`; for(const c of notare.checks){ html+=`<div class="check"><div class="row split"><b>${c.t}</b>${c.skill&&c.dc?`<span><select class="ckWho">${pgs.map(([i,x])=>`<option value="${i}">${x.name.split(' ')[0]}</option>`).join('')}</select><button class="primary ckAsk" data-skill="${c.skill}" data-dc="${c.dc}">Richiedi</button></span>`:''}</div><div class="outcome"><div><span class="pass">Successo</span><p>${c.ok}</p></div><div><span class="fail">Fallimento</span><p>${c.ko}</p></div></div></div>`; } html+=`</details>`; }
  // 5. scene collegate
  const scs=sceneNames.map(n=>[n,findScene(n)]);
  html+=`<details open><summary>Scene ed eventi collegati (${scs.length})</summary><div class="row">${scs.map(([n,s])=>`<button class="mini ${s?'':'off'}" data-scene="${s?s.id:''}" title="${s?'':'handout non trovato'}">${n}</button>`).join('')||'<span class="note">nessuno</span>'}</div></details>`;
  // 6. altre sezioni
  for(const s of l.secs){ if(['Aspetto esterno','Entrando','Cosa si vede automaticamente','Cosa sta succedendo oggi','Persone presenti','Cosa si può notare','Collegamenti'].includes(s.t)) continue; if(s.checks) continue; html+=`<details><summary>${s.t}</summary><p>${(s.txt||'').replace(/\n/g,'<br>')}</p></details>`; }
  // 7. appunti
  const notes=(S.notes||{})[l.id]||'';
  html+=`<details open><summary>Appunti del master su questo luogo</summary><textarea id="luogoNotes" rows="4" placeholder="Cosa è cambiato qui, cosa hanno detto i giocatori, cosa devi ricordare…">${notes.replace(/</g,'&lt;')}</textarea><div class="row split"><span class="note" id="notesState"></span><button class="mini" id="saveNotes">Salva appunti</button></div></details>`;
  // 8. accaduto qui
  const here=S.log.filter(e=>e.sc==='luogo:'+l.id);
  html+=`<details ${here.length?'open':''}><summary>Accaduto qui (${here.length})</summary>${here.slice(0,15).map(e=>`<p class="note">· ${e.txt||(e.who?`${e.who}: ${e.skill||e.name||''} ${e.tot??e.atk??''}`:'')}</p>`).join('')||'<p class="note">ancora niente</p>'}</details>`;
  box.innerHTML=html;
  box.querySelectorAll('.ckAsk').forEach(b=>b.onclick=()=>{ const who=b.parentElement.querySelector('.ckWho').value; const skill=b.dataset.skill.replace('Rapidità di Mano','Rapidità di mano'); S.request={id:'r-'+Date.now(),skill,dc:+b.dataset.dc,targets:[who]}; log({kind:'sys',txt:`Il master chiede a ${S.tokens[who].name} una prova di ${skill}`}); save(true); toast('Richiesta inviata a '+S.tokens[who].name); });
  box.querySelectorAll('[data-png]').forEach(c=>c.onclick=()=>openPng(PNGS.find(p=>p.id===c.dataset.png)));
  box.querySelectorAll('[data-scene]').forEach(b=>b.onclick=()=>{ const s=SCENE_HANDOUTS.find(x=>x.id===b.dataset.scene); if(s) openSceneHandout(s); });
  box.querySelectorAll('[data-readshow]').forEach(b=>b.onclick=()=>{ const t=b.dataset.readshow; showToPlayers({title:l.name+' — '+t,text:(secByT(t)||{}).txt||''}); toast('Testo in evidenza sugli schermi dei giocatori'); });
  const si=box.querySelector('#showLuogoImg'); if(si) si.onclick=()=>{ showToPlayers({img:l.img,title:l.name}); toast('Immagine mostrata ai giocatori'); };
  const sn=box.querySelector('#saveNotes'); if(sn) sn.onclick=()=>{ S.notes=S.notes||{}; S.notes[l.id]=box.querySelector('#luogoNotes').value; save(true); box.querySelector('#notesState').textContent='salvato'; };
}
