/* ===== ESTENSIONI 5: sezioni richiudibili, registro archiviabile, Compendio di Aprutium ===== */

/* ---------- sezioni richiudibili (stato per schermo) ---------- */
function setupCollapsibles(){
  document.querySelectorAll('#side .sec').forEach((sec,i)=>{
    const h=sec.querySelector(':scope > h2, :scope > .row > h2'); if(!h||sec.dataset.coll) return;
    const key='aprutium.sec.'+(sec.id||h.textContent.trim().toLowerCase().replace(/[^a-z]/g,'').slice(0,20));
    sec.dataset.coll=key; h.classList.add('collh');
    let closed=false; try{ closed=localStorage.getItem(key)==='1'; }catch(e){}
    sec.classList.toggle('closed',closed);
    h.addEventListener('click',e=>{ if(e.target.closest('button,select,input')) return; sec.classList.toggle('closed'); try{ localStorage.setItem(key,sec.classList.contains('closed')?'1':'0'); }catch(_){} });
  });
}

/* ---------- registro: archivia / svuota ---------- */
function archiveLog(){ if(!S.log.length){ toast('Il registro è già vuoto'); return; } S.archive=S.archive||[]; S.archive.unshift({t:Date.now(),n:S.log.length,items:S.log.slice(0,200)}); if(S.archive.length>12) S.archive.length=12; S.log=[]; log({kind:'sys',txt:'Registro archiviato: nuova sessione'}); save(true); toast('Registro archiviato'); }
function clearLog(){ S.log=[]; save(true); toast('Registro svuotato'); }
function openArchive(){
  const a=S.archive||[];
  let html=`<div class="eyebrow">Registro</div><h2 class="big">Sessioni archiviate</h2>`;
  if(!a.length) html+='<p class="note">Nessuna sessione archiviata. Il tasto "Archivia" chiude la sessione corrente e la conserva qui.</p>';
  for(const s of a){ const d=new Date(s.t); html+=`<details><summary style="cursor:pointer;font-family:var(--display);color:var(--gold);letter-spacing:.08em;font-size:12px;text-transform:uppercase;margin-top:10px">${d.toLocaleDateString('it-IT')} ${d.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})} · ${s.n} eventi</summary><div style="font-size:13px;line-height:1.5;margin-top:6px">${s.items.filter(e=>IS_GM||!e.gm).map(e=>`<div class="note">· ${e.txt||(e.who?`${e.who}: ${e.skill||e.name||''} ${e.tot??e.atk??''}${e.dmg!=null?' · danno '+e.dmg:''}`:'')}</div>`).join('')}</div></details>`; }
  openModal(html,'sheet');
}

/* ---------- Compendio ---------- */
const COMP_CATS=[['luoghi','Luoghi'],['persone','Persone'],['crociata','La Crociata'],['sanno','Cosa sanno i personaggi'],['fazioni','Fazioni'],['miti','Miti e leggende'],['quest','Imprese e questioni aperte'],['note','Altro']];
let compCat='luoghi', compQ='';
function compEntries(cat){
  const out=[];
  const met=new Set(S.met||[]), visited=new Set(S.visited||[]);
  if(cat==='luoghi'){ for(const l of LUOGHI){ const v=visited.has(l.id); if(!IS_GM&&!v) continue; out.push({id:'l:'+l.id,title:`${l.num}. ${l.name}`,sub:(l.fields.Tipo||'')+(v?'':' · non ancora visitato'),img:l.img,body:[(l.secs.find(s=>s.t==='Aspetto esterno')||{}).txt||'',(l.secs.find(s=>s.t==='Entrando')||{}).txt||''].filter(Boolean).join('\n\n'),open:()=>{ if(IS_GM) gotoScene('luogo:'+l.id); }}); } }
  if(cat==='persone'){ for(const p of PNGS){ const m=met.has(p.id); if(!IS_GM&&!m) continue; out.push({id:'p:'+p.id,title:p.name,sub:((p.fields||{}).Ruolo||'')+(m?'':' · non ancora incontrato'),img:p.img,body:p.descr||'',open:()=>{ if(IS_GM) openPng(p); else openModal(`<div class="sheethead"><div class="portrait" style="background-image:url(${p.img||''})"></div><div><div class="eyebrow">${(p.fields||{}).Ruolo||''}</div><h2 class="big">${p.name}</h2></div></div><p class="lore">${p.descr||''}</p>`,'sheet'); },gmAction:IS_GM?{label:m?'Segna come non incontrato':'Segna come incontrato',fn:()=>{ S.met=S.met||[]; if(m) S.met=S.met.filter(x=>x!==p.id); else S.met.push(p.id); save(true); renderCompendio(); }}:null}); } }
  if(cat==='crociata'){ out.push({id:'c:riparte',title:'La Crociata riparte',body:RECAP['La Crociata riparte']||''}); out.push({id:'c:possiede',title:'Cosa possiede ora la Crociata',body:RECAP['Cosa possiede ora la Crociata']||''}); out.push({id:'c:tesoro',title:'Cassa e bottino (dal registro Roll20)',body:'Denaro: 222 fiorini d’oro + 337 argenti + 60 gofferini (i gofferini restano alla Crociata).\nGemme: 2 granati da 25 mo.\nMagico: Scimitarra +1.\nConsumabili: 3 Pozioni di Guarigione, 1 Pozione di Guarigione Superiore, 2 antitossine.\nOggetti speciali: Sigillo da Contratto del Loto Nero, Libro paga di Lekë, Pugnale dell’Osservatore.\nArmi della Crociata: 14 spade, 6 scimitarre, 8 balestre, 120 quadrelli, 9 lance, 11 scudi, 7 cotte di maglia, 8 cuoi borchiati + equipaggiamento da campo.\nDiviso: 37 mo e 56 ma a testa.'}); }
  if(cat==='sanno'){ out.push({id:'s:1',title:'Dove eravamo',body:RECAP['Dove eravamo']||''}); out.push({id:'s:2',title:'Cosa è successo a Mushanè',body:RECAP['Cosa è successo']||''}); out.push({id:'s:3',title:'Cosa sanno i personaggi',body:RECAP['Cosa sanno i personaggi']||''}); out.push({id:'s:4',title:'L’ultima immagine',body:RECAP['L’ultima immagine']||''}); }
  for(const e of (S.comp||[])){ if(e.cat!==cat) continue; if(!IS_GM&&!e.pub) continue; out.push({id:'u:'+e.id,title:e.title,sub:e.pub?'':'solo master',body:e.text,custom:e}); }
  return out.filter(e=>!compQ||(e.title+' '+(e.sub||'')+' '+(e.body||'')).toLowerCase().includes(compQ.toLowerCase()));
}
function openCompendio(){ openModal(`<div class="compwrap"><aside class="compnav"><div class="eyebrow" style="margin-bottom:6px">Compendio di Aprutium</div><input type="text" id="compQ" placeholder="cerca…" value="${compQ.replace(/"/g,'&quot;')}"><div id="compCats"></div></aside><section id="compBody"></section></div>`,'comp'); renderCompendio(); const q=document.getElementById('compQ'); q.oninput=()=>{ compQ=q.value; renderCompendio(); }; }
function renderCompendio(){
  const cats=document.getElementById('compCats'), body=document.getElementById('compBody'); if(!cats||!body) return;
  cats.innerHTML=COMP_CATS.map(([k,l])=>`<button class="${compCat===k?'on':''}" data-cat="${k}">${l}<small>${compEntries(k).length}</small></button>`).join('');
  cats.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{ compCat=b.dataset.cat; renderCompendio(); });
  const list=compEntries(compCat);
  body.innerHTML=`<div class="row split"><h2 class="big" style="margin:0">${COMP_CATS.find(c=>c[0]===compCat)[1]}</h2>${IS_GM?`<button class="mini" id="compAdd">+ Voce</button>`:''}</div>`+(list.length?list.map(e=>`<article class="compent" data-id="${e.id}">${e.img?`<div class="ci" style="background-image:url(${e.img})"></div>`:''}<div><h3>${e.title}</h3>${e.sub?`<div class="note">${e.sub}</div>`:''}<p>${(e.body||'').replace(/\n/g,'<br>')}</p><div class="row">${e.open?`<button class="mini" data-open="${e.id}">${IS_GM&&e.id.startsWith('l:')?'Porta qui il gruppo':'Apri'}</button>`:''}${e.gmAction?`<button class="mini" data-gma="${e.id}">${e.gmAction.label}</button>`:''}${e.custom&&IS_GM?`<button class="mini" data-edit="${e.id}">Modifica</button><button class="mini" data-pub="${e.id}">${e.custom.pub?'Nascondi ai giocatori':'Mostra ai giocatori'}</button>`:''}</div></div></article>`).join(''):'<p class="note">Niente qui, per ora.</p>');
  body.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{ const e=list.find(x=>x.id===b.dataset.open); if(e&&e.open){ closeModal(); e.open(); } });
  body.querySelectorAll('[data-gma]').forEach(b=>b.onclick=()=>{ const e=list.find(x=>x.id===b.dataset.gma); if(e&&e.gmAction) e.gmAction.fn(); });
  body.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{ const e=list.find(x=>x.id===b.dataset.edit); editCompEntry(e.custom); });
  body.querySelectorAll('[data-pub]').forEach(b=>b.onclick=()=>{ const e=list.find(x=>x.id===b.dataset.pub); e.custom.pub=!e.custom.pub; save(true); renderCompendio(); });
  const add=body.querySelector('#compAdd'); if(add) add.onclick=()=>editCompEntry(null);
}
function editCompEntry(e){
  const body=document.getElementById('compBody'); const isNew=!e; e=e||{id:'c'+Date.now(),cat:compCat,title:'',text:'',pub:false};
  body.innerHTML=`<h2 class="big">${isNew?'Nuova voce':'Modifica voce'}</h2><div class="stack"><select id="ceCat">${COMP_CATS.map(([k,l])=>`<option value="${k}" ${e.cat===k?'selected':''}>${l}</option>`).join('')}</select><input type="text" id="ceTitle" placeholder="Titolo" value="${(e.title||'').replace(/"/g,'&quot;')}"><textarea id="ceText" rows="10" placeholder="Testo…">${(e.text||'').replace(/</g,'&lt;')}</textarea><label class="row"><input type="checkbox" id="cePub" ${e.pub?'checked':''}> visibile ai giocatori</label><div class="row"><button class="primary" id="ceSave">Salva</button><button id="ceCancel">Annulla</button>${isNew?'':'<button class="danger" id="ceDel">Elimina</button>'}</div></div>`;
  body.querySelector('#ceSave').onclick=()=>{ e.cat=body.querySelector('#ceCat').value; e.title=body.querySelector('#ceTitle').value.trim()||'Senza titolo'; e.text=body.querySelector('#ceText').value; e.pub=body.querySelector('#cePub').checked; S.comp=S.comp||[]; const i=S.comp.findIndex(x=>x.id===e.id); if(i>=0) S.comp[i]=e; else S.comp.push(e); compCat=e.cat; save(true); renderCompendio(); };
  body.querySelector('#ceCancel').onclick=renderCompendio;
  const del=body.querySelector('#ceDel'); if(del) del.onclick=()=>{ S.comp=(S.comp||[]).filter(x=>x.id!==e.id); save(true); renderCompendio(); };
}
document.getElementById('btnComp').onclick=openCompendio;
document.getElementById('btnArchive').onclick=archiveLog;
document.getElementById('btnClearLog').onclick=()=>{ const b=document.getElementById('btnClearLog'); if(b.dataset.arm){ delete b.dataset.arm; b.textContent='Svuota'; clearLog(); } else { b.dataset.arm='1'; b.textContent='Sicuro? Svuota'; setTimeout(()=>{ delete b.dataset.arm; b.textContent='Svuota'; },3000); } };
document.getElementById('btnOpenArchive').onclick=openArchive;
