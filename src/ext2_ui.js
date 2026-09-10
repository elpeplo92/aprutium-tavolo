/* ===== ESTENSIONI 2: tocca a te, condizioni, aree d'effetto, ping, morte, PF temporanei ===== */

/* ---------- suono ---------- */
let audioCtx=null;
function beep(kind){ try{ audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)(); const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); const t=audioCtx.currentTime; if(kind==='turn'){ o.frequency.setValueAtTime(660,t); o.frequency.setValueAtTime(880,t+.12); g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.25,t+.02); g.gain.exponentialRampToValueAtTime(.0001,t+.5); o.start(t); o.stop(t+.5); } else { o.frequency.setValueAtTime(440,t); g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.15,t+.02); g.gain.exponentialRampToValueAtTime(.0001,t+.25); o.start(t); o.stop(t+.25); } }catch(e){} }

/* ---------- tocca a te ---------- */
let lastTurnKey=null;
function checkTurn(){
  const key=S.mode==='scontro'?S.round+':'+S.turn+':'+(S.order[S.turn]||''):'x';
  if(key===lastTurnKey) return; const first=lastTurnKey===null; lastTurnKey=key;
  if(first||S.mode!=='scontro') return;
  const id=S.order[S.turn], t=S.tokens[id]; if(!t) return;
  const b=document.getElementById('turnBanner');
  if(!IS_GM&&id===me){ b.textContent='Tocca a te, '+t.name.split(' ')[0]; b.className='show me'; beep('turn'); }
  else { b.textContent='Tocca a '+t.name; b.className='show'; if(IS_GM&&t.kind==='nemico') beep('soft'); }
  clearTimeout(b._t); b._t=setTimeout(()=>b.className='',2600);
}

/* ---------- condizioni ---------- */
const CONDS=[['prono','Prono'],['afferrato','Afferrato'],['trattenuto','Trattenuto'],['spaventato','Spaventato'],['avvelenato','Avvelenato'],['affascinato','Affascinato'],['accecato','Accecato'],['assordato','Assordato'],['stordito','Stordito'],['incapacitato','Incapacitato'],['paralizzato','Paralizzato'],['invisibile','Invisibile'],['concentrazione','Concentrazione'],['benedetto','Benedetto'],['marchiato','Marchiato'],['scatto','In scatto']];
const CONDS_ABBR={prono:'PRN',afferrato:'AFF',trattenuto:'TRA',spaventato:'SPA',avvelenato:'VEL',affascinato:'CHA',accecato:'CIE',assordato:'SOR',stordito:'STO',incapacitato:'INC',paralizzato:'PAR',invisibile:'INV',concentrazione:'CON',benedetto:'BEN',marchiato:'MAR',scatto:'SCA'};
function condLabel(k){ const c=CONDS.find(x=>x[0]===k); return c?c[1]:k; }
function toggleCond(id,k,rounds){ const t=S.tokens[id]; if(!t) return; t.conds=t.conds||[]; const i=t.conds.findIndex(c=>c.n===k); if(i>=0){ t.conds.splice(i,1); log({kind:'sys',gm:t.kind==='nemico'&&!S.publicRolls,txt:`${t.name} non è più ${condLabel(k).toLowerCase()}`}); } else { t.conds.push({n:k,r:rounds||null}); log({kind:'sys',gm:t.kind==='nemico'&&!S.publicRolls,txt:`${t.name}: ${condLabel(k).toLowerCase()}${rounds?` per ${rounds} round`:''}`}); } save(); }
function tickConds(id){ const t=S.tokens[id]; if(!t||!t.conds) return; t.conds=t.conds.filter(c=>{ if(c.r==null) return true; c.r--; if(c.r<=0){ log({kind:'sys',txt:`${t.name}: finisce ${condLabel(c.n).toLowerCase()}`}); return false; } return true; }); }
function renderCondChips(){
  const box=document.getElementById('condBox'); if(!box) return; const t=S.tokens[selected]; if(!t){ box.innerHTML=''; return; }
  const have=new Set((t.conds||[]).map(c=>c.n));
  box.innerHTML=`<div class="row" style="margin-bottom:4px"><span class="eyebrow">Condizioni</span><span class="eyebrow">round:</span><input type="number" id="condRounds" placeholder="∞" style="width:52px"></div><div class="chips">`+CONDS.map(([k,l])=>`<button class="chip ${have.has(k)?'on':''}" data-cond="${k}">${l}${have.has(k)&&(t.conds.find(c=>c.n===k).r!=null)?` <small>${t.conds.find(c=>c.n===k).r}</small>`:''}</button>`).join('')+`</div>`;
  box.querySelectorAll('[data-cond]').forEach(b=>b.onclick=()=>toggleCond(selected,b.dataset.cond,+document.getElementById('condRounds').value||null));
}
function condHtml(t,small){ if(!t.conds||!t.conds.length) return ''; return `<div class="condrow ${small?'sm':''}">${t.conds.map(c=>`<span class="cond" title="${condLabel(c.n)}${c.r!=null?' · '+c.r+' round':''}">${small?CONDS_ABBR[c.n]||c.n.slice(0,3).toUpperCase():condLabel(c.n)}${c.r!=null?`<i>${c.r}</i>`:''}</span>`).join('')}</div>`; }

/* ---------- aree d'effetto ---------- */
const aoeSvg=document.getElementById('aoe');
let aoeTool=null, aoeStart=null;
function setAoeTool(shape){ aoeTool=(aoeTool===shape)?null:shape; aoeStart=null; if(aoeTool){ if(fogTool) setFogTool(fogTool); if(editTool) setEditTool(editTool); measuring=false; stage.classList.remove('measuring'); document.getElementById('btnMeasure').classList.remove('primary'); } stage.classList.toggle('fogtool',!!aoeTool); document.querySelectorAll('[data-aoe]').forEach(b=>b.classList.toggle('primary',b.dataset.aoe===aoeTool)); }
document.querySelectorAll('[data-aoe]').forEach(b=>b.onclick=()=>setAoeTool(b.dataset.aoe));
document.getElementById('aoeClear').onclick=()=>{ S.aoe=null; save(true); };
function aoeClick(p){
  const size=+document.getElementById('aoeSize').value||6; const px=size/1.5*S.grid.size; // metri → pixel
  if(aoeTool==='cerchio'){ S.aoe={shape:'cerchio',x:p.x,y:p.y,r:px,m:size}; save(true); return; }
  if(!aoeStart){ aoeStart=p; drawAoe({shape:aoeTool,x:p.x,y:p.y,x2:p.x,y2:p.y,r:px,m:size,tmp:true}); return; }
  S.aoe={shape:aoeTool,x:aoeStart.x,y:aoeStart.y,x2:p.x,y2:p.y,r:px,m:size}; aoeStart=null; save(true);
}
function aoeShape(a){
  if(a.shape==='cerchio') return {type:'circle',cx:a.x,cy:a.y,r:a.r};
  const dx=a.x2-a.x, dy=a.y2-a.y, L=Math.hypot(dx,dy)||1, ux=dx/L, uy=dy/L;
  if(a.shape==='cono'){ const w=a.r; const bx=a.x+ux*a.r, by=a.y+uy*a.r; return {type:'poly',pts:[[a.x,a.y],[bx-uy*w/2,by+ux*w/2],[bx+uy*w/2,by-ux*w/2]]}; }
  const w=S.grid.size; const bx=a.x+ux*a.r, by=a.y+uy*a.r; return {type:'poly',pts:[[a.x-uy*w/2,a.y+ux*w/2],[bx-uy*w/2,by+ux*w/2],[bx+uy*w/2,by-ux*w/2],[a.x+uy*w/2,a.y-ux*w/2]]};
}
function pointIn(sh,x,y){ if(sh.type==='circle') return Math.hypot(sh.cx-x,sh.cy-y)<=sh.r+S.grid.size*.3; let inside=false; const P=sh.pts; for(let i=0,j=P.length-1;i<P.length;j=i++){ const [xi,yi]=P[i],[xj,yj]=P[j]; if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi)) inside=!inside; } return inside; }
function aoeTargets(a){ const sh=aoeShape(a); return Object.entries(S.tokens).filter(([id,t])=>pointIn(sh,t.x,t.y)).map(([id])=>id); }
function drawAoe(a){
  aoeSvg.setAttribute('viewBox',`0 0 ${MAP_W} ${MAP_H}`); aoeSvg.setAttribute('width',MAP_W); aoeSvg.setAttribute('height',MAP_H);
  if(!a){ aoeSvg.innerHTML=''; return; }
  const sh=aoeShape(a); const col=a.tmp?'rgba(201,162,74,.35)':'rgba(91,143,168,.35)', stroke=a.tmp?'#C9A24A':'#5B8FA8';
  aoeSvg.innerHTML=sh.type==='circle'?`<circle cx="${sh.cx}" cy="${sh.cy}" r="${sh.r}" fill="${col}" stroke="${stroke}" stroke-width="3"/>`:`<polygon points="${sh.pts.map(p=>p.join(',')).join(' ')}" fill="${col}" stroke="${stroke}" stroke-width="3"/>`;
  aoeSvg.innerHTML+=`<text x="${sh.type==='circle'?sh.cx:sh.pts[0][0]}" y="${(sh.type==='circle'?sh.cy:sh.pts[0][1])-8}" text-anchor="middle" font-family="Alegreya Sans" font-weight="700" font-size="16" fill="#E9DCC2" stroke="#000" stroke-width="3" paint-order="stroke">${a.shape} ${a.m} m</text>`;
}
function renderAoeBox(){
  const box=document.getElementById('aoeBox'); if(!box) return; const a=S.aoe;
  if(!a){ box.style.display='none'; return; }
  const ids=aoeTargets(a); box.style.display='';
  box.innerHTML=`<span class="eyebrow">Nell’area (${ids.length})</span> ${ids.map(id=>`<span class="tag">${S.tokens[id].name}</span>`).join(' ')||'<span class="note">nessuno</span>'}`+(IS_GM?`<div class="row" style="margin-top:6px"><select id="aoeTs"><option>TS Des</option><option>TS Cos</option><option>TS Sag</option><option>TS For</option><option>TS Int</option><option>TS Car</option></select><span class="eyebrow">CD</span><input type="number" id="aoeDc" value="13" style="width:56px"><button class="primary" id="aoeAsk">Chiedi il TS ai personaggi</button><button id="aoeRollEn">Tira per i nemici</button></div>`:'');
  const ask=box.querySelector('#aoeAsk'); if(ask) ask.onclick=()=>{ const sk=box.querySelector('#aoeTs').value, dc=+box.querySelector('#aoeDc').value||null; const pgs=ids.filter(i=>S.tokens[i].kind==='pg'); if(!pgs.length){ toast('Nessun personaggio nell’area'); return; } S.request={id:'r-'+Date.now(),skill:sk,dc,targets:pgs}; log({kind:'sys',txt:`Il master chiede un ${sk} a ${pgs.map(i=>S.tokens[i].name).join(', ')}`}); save(true); };
  const re=box.querySelector('#aoeRollEn'); if(re) re.onclick=()=>{ const sk=box.querySelector('#aoeTs').value, dc=+box.querySelector('#aoeDc').value||null; for(const i of ids.filter(i=>S.tokens[i].kind==='nemico')){ const t=S.tokens[i]; const r=d20(), mod=t.mods[sk]??0, tot=r+mod; log({kind:'roll',gm:!S.publicRolls,who:t.name,skill:sk,r,mod,tot,dc}); } save(true); };
}

/* ---------- ping ---------- */
let lastPing=0;
function doPing(p){ S.ping={x:Math.round(p.x),y:Math.round(p.y),t:Date.now(),by:IS_GM?'Master':(S.tokens[me]?S.tokens[me].name:'?')}; save(true); }
function renderPing(){ const p=S.ping; if(!p||p.t===lastPing||Date.now()-p.t>6000) return; lastPing=p.t; const el=document.createElement('div'); el.className='ping'; el.style.left=p.x+'px'; el.style.top=p.y+'px'; el.innerHTML='<i></i><i></i><span>'+p.by+'</span>'; document.getElementById('world').appendChild(el); beep('soft'); setTimeout(()=>el.remove(),2600); }
stage.addEventListener('dblclick',e=>{ if(e.target.closest('.tok, button, #confirm, #zoomctl')) return; doPing(toMap(e)); });

/* ---------- morte e PF temporanei ---------- */
function deathSave(id){ const t=S.tokens[id]; if(!t) return; t.ds=t.ds||{s:0,f:0}; const r=d20(); let txt;
  if(r===20){ t.hp=1; t.ds={s:0,f:0}; txt=`${t.name} tira 20: si rialza con 1 PF!`; }
  else if(r===1){ t.ds.f+=2; txt=`${t.name} tira 1: due fallimenti`; }
  else if(r>=10){ t.ds.s++; txt=`${t.name} tira ${r}: successo`; }
  else { t.ds.f++; txt=`${t.name} tira ${r}: fallimento`; }
  if(t.ds.s>=3){ t.ds={s:0,f:0,stable:true}; txt+=' — è stabile'; }
  if(t.ds.f>=3){ txt+=' — è MORTO'; }
  log({kind:'hit',txt}); save(true);
}
function dsHtml(t){ if(t.kind!=='pg'||t.hp>0) return ''; const d=t.ds||{s:0,f:0}; if(d.stable) return '<div class="ds stable">stabile</div>'; return `<div class="ds"><span class="ok">${'●'.repeat(d.s)}${'○'.repeat(3-d.s)}</span><span class="ko">${'●'.repeat(Math.min(3,d.f))}${'○'.repeat(Math.max(0,3-d.f))}</span></div>`; }
function applyDamage(t,v){ // v>0 danni
  let left=v; if(t.thp){ const use=Math.min(t.thp,left); t.thp-=use; left-=use; } t.hp=Math.max(0,t.hp-left); if(t.hp>0) t.ds={s:0,f:0};
}
