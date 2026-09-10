/* ===== ESTENSIONI 7: Compendio di Aprutium v2 — archivio completo, tre stati, sezioni, loot assegnabile ===== */
const C2_SECTIONS=[
 ['mondo','Il Mondo'],['luoghi','Luoghi'],['persone','Personaggi'],['crociata','La Crociata'],['naviganti','I Naviganti Grigi'],['fazioni','Fazioni'],['miti','Miti e leggende'],['oggetti','Oggetti'],['quest','Quest'],['diario','Diario']
];
const C2_CITY={julianova:'Julia Nova',mushane:'Mushanè',bellinde:'Bëllindë',teramum:'Teramum',strada:'La strada',null:'Altrove'};
const C2_CITY_ORDER=['julianova','strada','mushane','bellinde','teramum',null];
const C2_ROMAN=['','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX'];
let c2Sec='luoghi', c2City=null, c2Q='', c2Open=null, c2Back=[];

/* stato effettivo di una voce = base + override del master (S.compOv[id]) */
function c2Ov(id){ return ((S.compOv||{})[id])||{}; }
function c2Entry(e){ const o=c2Ov(e.id); return Object.assign({},e,o); }
function c2All(){ return COMPENDIO.map(c2Entry); }
function c2Visible(e){
  if(IS_GM) return true;
  if(e.cat==='naviganti') return me==='adamus';
  const st=(e.state||'').replace(/a$/,'o');
  if(st==='segreto') return false;
  if(e.cat==='diario'||e.cat==='crociata') return true;
  return !!((e.pub&&e.pub.trim())||(e.status&&e.status.trim())||/^not/.test(st));
}
function c2Img(e){ if(!e.img) return ''; if(e.img.startsWith('BE_LUOGO:')){ const l=LUOGHI.find(x=>x.id===e.img.slice(9)); return l?l.img:''; } if(e.img.startsWith('BE_PNG:')){ const p=PNGS.find(x=>x.id===e.img.slice(7)); return p?p.img:''; } return COMP_IMG[e.img]||''; }
function c2StateLabel(e){ const st=(e.state||''); if(/^segret/.test(st)) return 'segreto'; if(/^not/.test(st)) return e.cat==='png'?'ne avete sentito parlare':'ne avete sentito parlare'; return ''; }
function c2SecOf(e){ return {luogo:'luoghi',png:'persone',fazione:'fazioni',mito:'miti',oggetto:'oggetti',quest:'quest',diario:'diario',crociata:'crociata',naviganti:'naviganti',mondo:'mondo'}[e.cat]||'mondo'; }
function c2List(){
  let L=c2All().filter(c2Visible);
  if(c2Q){ const q=c2Q.toLowerCase(); return L.filter(e=>(e.title+' '+(e.sub||'')+' '+(e.pub||'')+' '+(IS_GM?(e.gm||''):'')+' '+(e.status||'')).toLowerCase().includes(q)); }
  L=L.filter(e=>c2SecOf(e)===c2Sec);
  if((c2Sec==='luoghi'||c2Sec==='persone')&&c2City!==undefined&&c2City!==null) L=L.filter(e=>(e.city||null)===c2City);
  return L;
}
function openCompendio(){
  openModal(`<div class="compwrap"><aside class="compnav"><div class="eyebrow" style="margin-bottom:6px">Compendio di Aprutium</div><input type="text" id="compQ" placeholder="cerca in tutto…" value="${c2Q.replace(/"/g,'&quot;')}"><div id="compCats"></div></aside><section id="compBody"></section></div>`,'comp');
  renderCompendio(); const q=document.getElementById('compQ'); q.oninput=()=>{ c2Q=q.value; c2Open=null; renderCompendio(); };
}
function renderCompendio(){
  const cats=document.getElementById('compCats'), body=document.getElementById('compBody'); if(!cats||!body) return;
  const all=c2All().filter(c2Visible);
  cats.innerHTML=C2_SECTIONS.filter(([k])=>k!=='naviganti'||IS_GM||me==='adamus').map(([k,l])=>`<button class="${c2Sec===k&&!c2Q?'on':''}" data-sec="${k}">${l}<small>${k==='mondo'?'':all.filter(e=>c2SecOf(e)===k).length}</small></button>`).join('');
  cats.querySelectorAll('[data-sec]').forEach(b=>b.onclick=()=>{ c2Sec=b.dataset.sec; c2City=null; c2Q=''; c2Open=null; const q=document.getElementById('compQ'); if(q) q.value=''; renderCompendio(); });
  if(c2Open){ renderC2Entry(c2Open); return; }
  if(c2Q){ renderC2List(all.filter(e=>(e.title+' '+(e.sub||'')+' '+(e.pub||'')+' '+(IS_GM?(e.gm||''):'')+' '+(e.status||'')).toLowerCase().includes(c2Q.toLowerCase())),`Risultati per «${c2Q}»`,true); return; }
  if(c2Sec==='mondo') return renderC2Mondo();
  if(c2Sec==='diario') return renderC2Diario(all);
  if(c2Sec==='quest') return renderC2Quest(all);
  if((c2Sec==='luoghi'||c2Sec==='persone')&&c2City===null){
    const list=all.filter(e=>c2SecOf(e)===c2Sec); const cities=C2_CITY_ORDER.filter(c=>list.some(e=>(e.city||null)===c));
    body.innerHTML=`<div class="row split"><h2 class="big" style="margin:0">${c2Sec==='luoghi'?'Luoghi':'Personaggi'}</h2>${IS_GM?`<button class="mini" id="compAdd">+ Voce</button>`:''}</div><div class="c2cities">${cities.map(c=>{ const n=list.filter(e=>(e.city||null)===c); const cover=n.map(c2Img).find(Boolean)||''; return `<div class="c2city" data-city="${c===null?'':c}"><div class="cc" style="background-image:url(${cover})"></div><div><b>${C2_CITY[c]}</b><small>${n.length} voci · ${n.filter(e=>/^(visitat|incontrat)/.test(e.state||'')).length} ${c2Sec==='luoghi'?'visitati':'incontrati'}</small></div></div>`; }).join('')}</div>`;
    body.querySelectorAll('[data-city]').forEach(d=>d.onclick=()=>{ c2City=d.dataset.city||null; renderCompendio(); });
    const add=body.querySelector('#compAdd'); if(add) add.onclick=()=>editC2Entry(null);
    return;
  }
  const list=c2List();
  renderC2List(list,(c2Sec==='luoghi'||c2Sec==='persone')?C2_CITY[c2City]:C2_SECTIONS.find(s=>s[0]===c2Sec)[1],false,true);
}
function renderC2List(list,title,flat,grouped){
  const body=document.getElementById('compBody');
  const groups={}; for(const e of list){ const g=flat?'':(e.group||''); (groups[g]=groups[g]||[]).push(e); }
  let html=`<div class="row split"><h2 class="big" style="margin:0">${(c2City!==null&&!flat)?`<button class="mini" id="c2back">‹</button> `:''}${title}</h2>${IS_GM?`<button class="mini" id="compAdd">+ Voce</button>`:''}</div>`;
  if(!list.length) html+='<p class="note">Niente qui, per ora.</p>';
  for(const [g,es] of Object.entries(groups)){
    if(g) html+=`<h3 class="c2group">${g}</h3>`;
    html+=`<div class="c2grid">${es.map(e=>`<article class="c2card ${/^segret/.test(e.state||'')?'seg':''}" data-id="${e.id}">${c2Img(e)?`<div class="ci" style="background-image:url(${c2Img(e)})"></div>`:`<div class="ci empty">${e.title.slice(0,1)}</div>`}<div><b>${e.title}</b><small>${e.sub||''}</small>${e.status?`<em>${e.status}</em>`:''}${c2StateLabel(e)?`<span class="c2st">${c2StateLabel(e)}</span>`:''}</div></article>`).join('')}</div>`;
  }
  body.innerHTML=html;
  body.querySelectorAll('[data-id]').forEach(a=>a.onclick=()=>{ c2Open=a.dataset.id; renderCompendio(); });
  const bk=body.querySelector('#c2back'); if(bk) bk.onclick=()=>{ c2City=null; renderCompendio(); };
  const add=body.querySelector('#compAdd'); if(add) add.onclick=()=>editC2Entry(null);
}
function c2Text(t){ return (t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\[\[([^\]]+)\]\]/g,'<b>$1</b>').replace(/\n\n/g,'</p><p>').replace(/\n/g,'<br>'); }
function renderC2Entry(id){
  const body=document.getElementById('compBody'); const e=c2All().find(x=>x.id===id); if(!e){ c2Open=null; return renderCompendio(); }
  const img=c2Img(e); const links=(e.links||[]).map(l=>c2All().find(x=>x.id===l)).filter(x=>x&&c2Visible(x));
  const pgs=Object.entries(S.tokens).filter(([,x])=>x.kind==='pg');
  let html=`<div class="row split"><button class="mini" id="c2back">‹ indietro</button>${IS_GM?`<span class="row" style="gap:4px"><select id="c2state"><option value="visitato" ${/^(visitat|incontrat)/.test(e.state||'')?'selected':''}>${e.cat==='png'?'incontrato':'visitato / noto ai PG'}</option><option value="noto" ${/^not/.test(e.state||'')?'selected':''}>ne hanno sentito parlare</option><option value="segreto" ${/^segret/.test(e.state||'')?'selected':''}>segreto</option></select><button class="mini" id="c2edit">Modifica</button>${img?`<button class="mini" id="c2show">Mostra ai giocatori</button>`:''}</span>`:''}</div>`;
  html+=`<div class="sheethead" style="margin-top:10px">${img?`<div class="portrait" style="background-image:url(${img});width:120px;height:120px"></div>`:''}<div><div class="eyebrow">${(C2_CITY[e.city]&&e.city?C2_CITY[e.city]+' · ':'')}${e.group||C2_SECTIONS.find(s=>s[0]===c2SecOf(e))[1]}</div><h2 class="big" style="margin:2px 0">${e.title}</h2><div class="note">${e.sub||''}</div>${e.status?`<div class="c2status">${e.status}</div>`:''}${e.owner?`<div class="note">Lo tiene: <b>${e.owner}</b></div>`:''}${e.data?`<div class="note">${e.data}</div>`:''}</div></div>`;
  if(img&&(e.cat==='luogo'||e.cat==='diario'||e.cat==='mondo')) html+=`<img class="poiimg" src="${img}" alt="" style="max-height:52vh;object-fit:contain">`;
  if(e.cat==='quest') html+=`<div class="c2q"><span class="eyebrow">${e.stato==='principale'?'Filo principale':e.stato==='chiusa'?'Chiusa':'Aperta'}</span>${e.sanno?`<h3>Cosa sapete</h3><p>${c2Text(e.sanno)}</p>`:''}${e.prossimo?`<h3>Prossima mossa possibile</h3><p>${c2Text(e.prossimo)}</p>`:''}${e.esito?`<h3>Come è finita</h3><p>${c2Text(e.esito)}</p>`:''}</div>`;
  if(e.cat==='diario'&&e.eventi) html+=`<div class="c2q"><h3>In breve</h3><p>${e.eventi.map(x=>'· '+x).join('<br>')}</p></div>`;
  if(e.mech) html+=`<p class="note"><b>Regole:</b> ${e.mech}</p>`;
  if(e.pub) html+=`<div class="lore" style="max-width:none"><p>${c2Text(e.pub)}</p></div>`;
  else if(!IS_GM) html+=`<p class="note">Ne avete sentito parlare, ma non sapete altro.</p>`;
  if(IS_GM&&e.gm) html+=`<div class="gmbox"><div class="eyebrow">Solo master</div><p style="font-size:14px;line-height:1.5">${c2Text(e.gm)}</p></div>`;
  if(IS_GM&&e.cat==='oggetto') html+=`<div class="gmbox"><div class="eyebrow">Assegna</div><div class="row"><select id="c2who"><option value="Crociata">Crociata (loot comune)</option><option value="gruppo">Gruppo</option>${pgs.map(([i,x])=>`<option value="${i}">${x.name}</option>`).join('')}</select><button class="primary" id="c2assign">Assegna</button></div></div>`;
  if(links.length) html+=`<div class="c2links"><span class="eyebrow">Collegato a</span><div class="row">${links.map(l=>`<button class="mini" data-go="${l.id}">${l.title}</button>`).join('')}</div></div>`;
  if(e.atti&&e.atti.length) html+=`<p class="note">Atti: ${e.atti.map(n=>C2_ROMAN[n]||n).join(', ')}</p>`;
  body.innerHTML=html;
  body.querySelector('#c2back').onclick=()=>{ c2Open=c2Back.pop()||null; renderCompendio(); };
  body.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{ c2Back.push(c2Open); c2Open=b.dataset.go; renderCompendio(); });
  const st=body.querySelector('#c2state'); if(st) st.onchange=()=>{ c2SetOv(e.id,{state:st.value==='visitato'?(e.cat==='png'?'incontrato':'visitato'):st.value}); renderCompendio(); };
  const ed=body.querySelector('#c2edit'); if(ed) ed.onclick=()=>editC2Entry(e);
  const sh=body.querySelector('#c2show'); if(sh) sh.onclick=()=>{ showToPlayers({img,title:e.title}); toast('Mostrato ai giocatori'); };
  const as=body.querySelector('#c2assign'); if(as) as.onclick=()=>{ const who=body.querySelector('#c2who').value; const name=who==='Crociata'?'Crociata':who==='gruppo'?'Gruppo':S.tokens[who].name; c2SetOv(e.id,{owner:name}); if(S.tokens[who]){ S.inv=S.inv||{}; S.inv[who]=(S.inv[who]||[]).filter(x=>x.id!==e.id); S.inv[who].push({id:e.id,n:e.title,m:e.mech||''}); } for(const k of Object.keys(S.inv||{})){ if(k!==who) S.inv[k]=(S.inv[k]||[]).filter(x=>x.id!==e.id); } log({kind:'sys',txt:`${e.title} assegnato a ${name}`}); save(true); toast('Assegnato a '+name); renderCompendio(); };
}
function c2SetOv(id,patch){ S.compOv=S.compOv||{}; S.compOv[id]=Object.assign(S.compOv[id]||{},patch); save(true); }
function renderC2Mondo(){
  const body=document.getElementById('compBody');
  const maps=[['Geografia del Mondo di Ea.jpg','Il mondo di Ea'],['Nazioni del Mondo di Ea.jpg','Le nazioni di Ea'],['Ducato di Aprutium.jpg','Il Ducato d’Aprutium'],['Citta di Julianova.jpg','Julia Nova'],['Bellinde vista.jpg','Bëllindë'],['Emblema Impero Aureo.jpg','L’Impero Aureo']];
  const extra=c2All().filter(e=>e.cat==='mondo'&&c2Visible(e));
  body.innerHTML=`<h2 class="big">Il Mondo</h2><p class="lore">Ea. L’Impero Aureo. Il Ducato d’Aprutium, da Julia Nova sul mare a Teramum sui colli. Cliccate una mappa per aprirla.</p><div class="c2maps">${maps.filter(([f])=>COMP_IMG[f]).map(([f,t])=>`<div class="c2map" data-map="${f}"><div style="background-image:url(${COMP_IMG[f]})"></div><b>${t}</b></div>`).join('')}</div>${extra.length?`<div class="c2grid" style="margin-top:14px">${extra.map(e=>`<article class="c2card" data-id="${e.id}"><div class="ci empty">${e.title.slice(0,1)}</div><div><b>${e.title}</b><small>${e.sub||''}</small></div></article>`).join('')}</div>`:''}`;
  body.querySelectorAll('[data-map]').forEach(d=>d.onclick=()=>{ const f=d.dataset.map; const t=maps.find(m=>m[0]===f)[1]; body.innerHTML=`<div class="row split"><button class="mini" id="c2back">‹ indietro</button>${IS_GM?`<button class="mini" id="c2show">Mostra ai giocatori</button>`:''}</div><h2 class="big">${t}</h2><img class="poiimg" src="${COMP_IMG[f]}" alt="" style="max-height:78vh;object-fit:contain">`; body.querySelector('#c2back').onclick=renderCompendio; const s=body.querySelector('#c2show'); if(s) s.onclick=()=>{ showToPlayers({img:COMP_IMG[f],title:t}); toast('Mappa mostrata ai giocatori'); }; });
  body.querySelectorAll('[data-id]').forEach(a=>a.onclick=()=>{ c2Open=a.dataset.id; renderCompendio(); });
}
function renderC2Diario(all){
  const body=document.getElementById('compBody'); const list=all.filter(e=>e.cat==='diario').sort((a,b)=>(a.atti[0]||0)-(b.atti[0]||0));
  body.innerHTML=`<h2 class="big">Diario di bordo</h2><div class="c2timeline">${list.map(e=>`<div class="c2tl" data-id="${e.id}"><div class="n">${C2_ROMAN[e.atti[0]]||''}</div><div><b>${e.title}</b><small>${e.data||''}</small><p>${e.riga||''}</p></div></div>`).join('')}</div>`;
  body.querySelectorAll('[data-id]').forEach(a=>a.onclick=()=>{ c2Open=a.dataset.id; renderCompendio(); });
}
function renderC2Quest(all){
  const body=document.getElementById('compBody'); const list=all.filter(e=>e.cat==='quest');
  const sec=(t,es)=>es.length?`<h3 class="c2group">${t}</h3><div class="c2grid">${es.map(e=>`<article class="c2card" data-id="${e.id}"><div class="ci empty ${e.stato}">${e.stato==='principale'?'★':e.stato==='chiusa'?'✓':'?'}</div><div><b>${e.title}</b><small>${(e.sanno||e.sub||'').slice(0,110)}</small>${e.prossimo?`<em>Prossima mossa: ${e.prossimo.slice(0,90)}</em>`:''}</div></article>`).join('')}</div>`:'';
  body.innerHTML=`<div class="row split"><h2 class="big" style="margin:0">Quest</h2>${IS_GM?`<button class="mini" id="compAdd">+ Voce</button>`:''}</div>`+sec('Il filo principale',list.filter(e=>e.stato==='principale'))+sec('Questioni aperte',list.filter(e=>e.stato==='aperta'))+sec('Chiuse',list.filter(e=>e.stato==='chiusa'));
  body.querySelectorAll('[data-id]').forEach(a=>a.onclick=()=>{ c2Open=a.dataset.id; renderCompendio(); });
  const add=body.querySelector('#compAdd'); if(add) add.onclick=()=>editC2Entry(null);
}
/* modifica (master): sovrascrive i campi della voce; le voci nuove finiscono in S.comp2 */
function editC2Entry(e){
  const body=document.getElementById('compBody'); const isNew=!e;
  e=e||{id:'u'+Date.now(),cat:{luoghi:'luogo',persone:'png',fazioni:'fazione',miti:'mito',oggetti:'oggetto',quest:'quest',diario:'diario',crociata:'crociata',naviganti:'naviganti',mondo:'mondo'}[c2Sec]||'mondo',city:c2City||null,group:'',title:'',sub:'',status:'',pub:'',gm:'',state:'segreto',custom:true};
  body.innerHTML=`<h2 class="big">${isNew?'Nuova voce':'Modifica: '+e.title}</h2><div class="stack">
  <div class="row"><select id="ceCat">${['luogo','png','fazione','mito','oggetto','quest','crociata','naviganti','mondo'].map(k=>`<option value="${k}" ${e.cat===k?'selected':''}>${k}</option>`).join('')}</select><select id="ceCity">${['','julianova','strada','mushane','bellinde','teramum'].map(k=>`<option value="${k}" ${(e.city||'')===k?'selected':''}>${k||'nessuna città'}</option>`).join('')}</select><input type="text" id="ceGroup" placeholder="Gruppo (es. Concilio Ristretto)" value="${(e.group||'').replace(/"/g,'&quot;')}"></div>
  <input type="text" id="ceTitle" placeholder="Titolo" value="${(e.title||'').replace(/"/g,'&quot;')}"><input type="text" id="ceSub" placeholder="Sottotitolo / ruolo" value="${(e.sub||'').replace(/"/g,'&quot;')}"><input type="text" id="ceStatus" placeholder="Stato (PNG): vivo/morto, dove sta, come vi ha lasciati" value="${(e.status||'').replace(/"/g,'&quot;')}">
  <label class="eyebrow">Per i giocatori</label><textarea id="cePub" rows="8">${(e.pub||'').replace(/</g,'&lt;')}</textarea>
  <label class="eyebrow">Solo master</label><textarea id="ceGm" rows="6">${(e.gm||'').replace(/</g,'&lt;')}</textarea>
  <div class="row"><button class="primary" id="ceSave">Salva</button><button id="ceCancel">Annulla</button>${e.custom?'<button class="danger" id="ceDel">Elimina</button>':(isNew?'':'<button id="ceReset">Torna all’originale</button>')}</div></div>`;
  body.querySelector('#ceSave').onclick=()=>{ const v=k=>body.querySelector('#'+k).value; const patch={cat:v('ceCat'),city:v('ceCity')||null,group:v('ceGroup').trim(),title:v('ceTitle').trim()||'Senza titolo',sub:v('ceSub').trim(),status:v('ceStatus').trim(),pub:v('cePub'),gm:v('ceGm')};
    if(e.custom){ S.comp2=S.comp2||[]; const i=S.comp2.findIndex(x=>x.id===e.id); const ne=Object.assign({id:e.id,state:e.state||'segreto',custom:true,links:[],atti:[]},e,patch); if(i>=0) S.comp2[i]=ne; else S.comp2.push(ne); save(true); }
    else c2SetOv(e.id,patch);
    c2Open=e.id; renderCompendio(); };
  body.querySelector('#ceCancel').onclick=renderCompendio;
  const del=body.querySelector('#ceDel'); if(del) del.onclick=()=>{ S.comp2=(S.comp2||[]).filter(x=>x.id!==e.id); save(true); c2Open=null; renderCompendio(); };
  const rs=body.querySelector('#ceReset'); if(rs) rs.onclick=()=>{ if(S.compOv) delete S.compOv[e.id]; save(true); renderCompendio(); };
}
/* archivio effettivo = dati statici + voci create al tavolo (nuove) + voci del vecchio compendio (S.comp) */
const COMPENDIO_BASE=COMPENDIO_DATA;
Object.defineProperty(window,'COMPENDIO',{get(){ const old=(S.comp||[]).map(e=>({id:'old-'+e.id,cat:{luoghi:'luogo',persone:'png',crociata:'crociata',sanno:'quest',fazioni:'fazione',miti:'mito',quest:'quest',note:'mondo'}[e.cat]||'mondo',city:null,group:'Appunti del tavolo',title:e.title,sub:'',pub:e.pub?e.text:'',gm:e.pub?'':e.text,state:e.pub?'noto':'segreto',custom:false,links:[],atti:[]})); return COMPENDIO_BASE.concat(S.comp2||[],old); }});
/* inventario assegnato: compare nella scheda */
const _renderSheetOrig=renderSheet;
renderSheet=function(id){ _renderSheetOrig(id); const inv=(S.inv||{})[id]||[]; if(!inv.length) return; const box=document.querySelector('#modal .box'); if(!box) return; const h3=[...box.querySelectorAll('h3')].find(x=>x.textContent==='Equipaggiamento'); if(!h3) return; const ul=h3.nextElementSibling; for(const it of inv){ const li=document.createElement('li'); li.innerHTML=`<b>${it.n}</b>${it.m?' · '+it.m:''} <span class="note">(dal Compendio)</span>`; ul.appendChild(li); } };
