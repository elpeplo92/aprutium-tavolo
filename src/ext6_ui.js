/* ===== ESTENSIONI 6: il Gobbo — assistente del master dentro il tavolo ===== */
const GOBBO_RULES=`Sei il Gobbo: l'assistente al tavolo del Dungeon Master di "Aprutium", campagna D&D 5e (regole 2024) ambientata a Ea, in un Abruzzo medievale fantastico. Rispondi in italiano, al master, come un co-narratore esperto.
COME RISPONDI: frasi corte. Prima la cosa da dire o fare adesso, poi il perché. Dai testo pronto da leggere ai giocatori tra virgolette, e a parte le note per il master. I popolani di Bëllindë parlano in dialetto teramano ("Mo' che lo dite…", "Nen se venne"), i nobili e i chierici in italiano. Quando serve una prova proponi abilità e CD (regole 2024) e scrivi Successo: / Fallimento: con l'esito. Niente tiri inutili: se non c'è rischio o incertezza, non chiedere prove. Un fallimento non chiude mai la scena: cambia il prezzo.
CANONE: non inventare fatti sul mondo che non trovi nei dati qui sotto; se ti manca un'informazione dillo e proponi, marcando "(proposta)". Non rivelare ai giocatori i segreti del master. Rispetta lo stato attuale del tavolo (posizioni, punti ferita, condizioni, nebbia, chi è nascosto).
SCENE PARALLELE: se il gruppo è diviso, chiudi ogni taglio con un piccolo cliffhanger e passa all'altro gruppo.
Quando il master chiede "cosa succede", "come reagisce X", "che CD", "cosa dice", rispondi direttamente con il materiale giocabile, senza premesse.`;

function gobboContext(){
  const L=[]; const sc=sceneOf(S.scene);
  L.push('SCENA ATTIVA: '+sc.name+' (fase: '+S.mode+(S.mode==='scontro'?', round '+S.round+', tocca a '+(S.tokens[S.order[S.turn]]||{}).name:'')+')');
  if(sc.id==='sotto'){ L.push('NOTE DEL MASTER SUL DUNGEON:\n'+S.gmNotes); L.push('PUNTI INTERATTIVI: '+POIS.map(p=>`[${POI_KIND_NAME[p.kind]||''}] ${p.title}: ${p.gm||''}${p.skill?` (prova ${p.skill} CD ${p.dc})`:''}`).join('\n')); }
  if(sc.id==='luogo'){ const l=sc.luogo; L.push('HANDOUT DEL LUOGO '+l.name+':\n'+Object.entries(l.fields).map(([k,v])=>k+': '+v).join('\n')+'\n'+l.secs.map(s=>s.checks?s.t+':\n'+s.checks.map(c=>`- ${c.t} · Successo: ${c.ok} · Fallimento: ${c.ko}`).join('\n'):s.t+':\n'+(s.txt||'')).join('\n\n')); const n=(S.notes||{})[l.id]; if(n) L.push('APPUNTI DEL MASTER SU QUESTO LUOGO: '+n);
    const names=[...new Set([...refsIn(l.secs.map(s=>s.txt||'').join(' '),'PNG')])]; const ps=names.map(findPng).filter(Boolean); if(ps.length) L.push('PNG PRESENTI:\n'+ps.map(p=>`${p.name} — ${(p.fields||{}).Ruolo||''}. ${p.descr||''} Voce: ${(p.fields||{}).Voce||''} Vuole: ${(p.fields||{})['Cosa vuole']||''} Sa: ${(p.fields||{}).Sa||''} Non sa: ${(p.fields||{})['Non sa']||''}`).join('\n')); }
  if(sc.id==='bellinde'){ L.push('Il gruppo è sulla mappa del borgo di Bëllindë. Luoghi: '+LUOGHI.map(l=>l.num+'. '+l.name).join(', ')); }
  L.push('PERSONAGGI E CREATURE AL TAVOLO:\n'+Object.entries(S.tokens).map(([id,t])=>`${t.name} (${t.kind==='pg'?(t.cls||'PG'):'nemico'+(t.hidden?', nascosto ai giocatori':'')}) PF ${t.hp}/${t.hpMax}${t.thp?' +'+t.thp+' temp':''} CA ${t.ac}${t.init!=null?' iniz '+t.init:''}${(t.conds||[]).length?' condizioni: '+t.conds.map(c=>c.n+(c.r?' '+c.r+'r':'')).join(', '):''}${t.kind==='nemico'&&t.tac?' · tattica: '+t.tac.slice(0,220):''}`).join('\n'));
  const pcs=Object.values(S.tokens).filter(t=>t.kind==='pg').map(t=>{ const sh=SHEETS[Object.keys(S.tokens).find(k=>S.tokens[k]===t)]; return sh?`${t.name}: ${t.cls}; abilità ${Object.entries(t.mods).filter(([k])=>!k.startsWith('TS')&&k!=='Iniziativa').map(([k,v])=>k+' '+fmtMod(v)).join(', ')}; TS ${Object.entries(t.mods).filter(([k])=>k.startsWith('TS')).map(([k,v])=>k.slice(3)+' '+fmtMod(v)).join(', ')}${sh.spell?'; CD incantesimi '+sh.spell.dc+', incantesimi: '+sh.spell.list.map(n=>(SPELLS[n]||{}).it||n).join(', '):''}; talenti: ${(sh.feats||[]).join(', ')}`:''; }).filter(Boolean);
  L.push('SCHEDE DEI PG:\n'+pcs.join('\n'));
  const comp=(S.comp||[]); if(comp.length) L.push('COMPENDIO (voci del master):\n'+comp.map(e=>`[${e.cat}] ${e.title}: ${e.text}`).join('\n'));
  L.push('COSA SANNO I PERSONAGGI (recap): '+(RECAP['Cosa sanno i personaggi']||''));
  L.push('ULTIMI EVENTI DEL REGISTRO (dal più recente):\n'+S.log.slice(0,18).map(e=>'- '+(e.txt||(e.who?`${e.who}: ${e.skill||e.name||''} ${e.tot??e.atk??''}${e.dmg!=null?' danno '+e.dmg:''}${e.dc?' (CD '+e.dc+(e.tot>=e.dc?' riuscita':' fallita')+')':''}`:''))).join('\n'));
  return L.join('\n\n').slice(0,58000);
}
let gobboTurns=[], gobboCtl=null;
async function gobboAsk(q){
  const out=document.getElementById('gobboOut'), st=document.getElementById('gobboState');
  const sample=await claude.use('sample'); if(!sample){ st.textContent='Il Gobbo non è disponibile in questa vista.'; return; }
  gobboTurns.push({role:'user',content:q}); if(gobboTurns.length>12) gobboTurns=gobboTurns.slice(-12);
  const box=document.createElement('div'); box.className='gq'; box.innerHTML=`<div class="who">Tu</div><div>${q.replace(/</g,'&lt;')}</div>`; out.appendChild(box);
  const ans=document.createElement('div'); ans.className='ga'; ans.innerHTML='<div class="who">Gobbo</div><div class="txt">Ci penso…</div>'; out.appendChild(ans); out.scrollTop=out.scrollHeight;
  const txt=ans.querySelector('.txt'); gobboCtl=new AbortController(); st.textContent='…'; document.getElementById('gobboStop').disabled=false;
  const input=[{role:'user',content:GOBBO_RULES+'\n\n=== STATO DEL TAVOLO ===\n'+gobboContext()},{role:'assistant',content:'Ho letto lo stato del tavolo. Dimmi cosa serve.'},...gobboTurns];
  try{
    const r=await sample(input,{cache:false,signal:gobboCtl.signal,modelTier:'default',onText:({text})=>{ txt.innerHTML=mdLite(text); out.scrollTop=out.scrollHeight; }});
    txt.innerHTML=mdLite(r.text); gobboTurns.push({role:'assistant',content:r.text}); st.textContent=r.truncated?'Risposta tagliata: chiedi meno per volta.':'';
  }catch(e){ if(e.code==='cancelled'){ st.textContent='Fermato.'; if(e.text) gobboTurns.push({role:'assistant',content:e.text}); } else if(e.code==='not_granted'){ st.textContent='Hai negato il consenso: il Gobbo usa il tuo account Claude.'; } else if(e.code==='rate_limited'){ st.textContent='Troppe richieste: aspetta un momento.'; } else { st.textContent='Errore: '+(e.message||e.code); } if(!e.text) ans.remove(); }
  finally{ gobboCtl=null; document.getElementById('gobboStop').disabled=true; }
}
function mdLite(t){ return (t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/^#+\s*(.+)$/gm,'<b>$1</b>').replace(/^[-•]\s+(.+)$/gm,'· $1').replace(/\n/g,'<br>'); }
document.getElementById('gobboAsk').onclick=()=>{ const q=document.getElementById('gobboQ').value.trim(); if(!q) return; document.getElementById('gobboQ').value=''; gobboAsk(q); };
document.getElementById('gobboQ').addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); document.getElementById('gobboAsk').click(); } });
document.getElementById('gobboStop').onclick=()=>{ if(gobboCtl) gobboCtl.abort(); };
document.getElementById('gobboClear').onclick=()=>{ gobboTurns=[]; document.getElementById('gobboOut').innerHTML=''; };
document.querySelectorAll('[data-gq]').forEach(b=>b.onclick=()=>gobboAsk(b.dataset.gq));
