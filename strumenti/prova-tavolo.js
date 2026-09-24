/* Prova automatica del tavolo Aprutium — OBBLIGATORIA PRIMA DI OGNI PUBBLICAZIONE.
 *
 *   node strumenti/prova-tavolo.js            (prova index.html)
 *   node strumenti/prova-tavolo.js src/tavolo.html
 *
 * Cosa fa, e perché esiste:
 * il tavolo salva su Firebase Realtime Database, che NON conserva le liste vuote,
 * gli oggetti vuoti e i valori nulli: quelle chiavi spariscono del tutto. Uno stato
 * salvato con `fog.ops: []` torna indietro senza `ops`, e ogni ciclo su quella lista
 * va in errore. L'11 settembre 2026 questo aveva ucciso tredici comandi del tavolo
 * (fra cui Inizia scontro, Prossimo turno, Porte e Rivela intorno al gruppo) senza
 * un solo messaggio d'errore visibile.
 *
 * Questa prova simula il giro su Firebase, poi preme TUTTI i bottoni nei due ruoli
 * e segnala quelli che vanno in errore. Se stampa anche un solo ROTTO, non si pubblica.
 */
const path = require('path');
const file = path.resolve(process.argv[2] || 'index.html');

(async () => {
  let chromium;
  try { ({ chromium } = require('playwright')); }
  catch (e) { console.error('Serve playwright: npm i playwright'); process.exit(2); }

  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });
  let rotti = 0;

  for (const ruolo of ['master', 'vicarus']) {
    const page = await browser.newPage();
    const erroriPagina = [];
    page.on('pageerror', e => erroriPagina.push(e.message));
    await page.goto('file://' + file + '?prova=1&ruolo=' + ruolo);
    await page.waitForTimeout(1800);

    const esito = await page.evaluate(() => {
      // come si comporta Firebase: butta via nulli, liste vuote e oggetti vuoti
      const firebase = v => {
        if (v == null) return undefined;
        if (Array.isArray(v)) { const a = v.map(firebase).filter(x => x !== undefined); return a.length ? a : undefined; }
        if (typeof v === 'object') { const o = {}; for (const k in v) { const x = firebase(v[k]); if (x !== undefined) o[k] = x; } return Object.keys(o).length ? o : undefined; }
        return v;
      };
      const base = (typeof normalize === 'function') ? normalize(structuredClone(DEFAULT_STATE)) : structuredClone(DEFAULT_STATE);
      S = merge(firebase(toRemote(base)) || {});
      try { applyScene(); render(); } catch (e) {}

      const rotte = [];
      let provati = 0;
      if (!TEST_MODE || ref || fbDb) rotte.push('Isolamento prova → collegamento alla partita reale ancora attivo');
      const premi = (el, nome) => {
        provati++;
        try {
          if (typeof el.onclick === 'function') el.onclick({ stopPropagation() {}, preventDefault() {}, target: el, clientX: 100, clientY: 100 });
          else el.click();
        } catch (e) { rotte.push(nome + ' → ' + e.name + ': ' + e.message); }
      };
      for (const el of document.querySelectorAll('button[id], [data-aoe], [data-gq]')) {
        if (el.closest('.gm') && !IS_GM) continue;
        if (el.closest('.pl') && IS_GM) continue;
        premi(el, (el.id || 'area ' + el.dataset.aoe) + ' ["' + (el.textContent || el.title || '').trim().slice(0, 30) + '"]');
      }
      const viste = {
        'Compendio': () => document.getElementById('btnComp').onclick(),
        'Scheda del personaggio': () => openSheet(Object.keys(S.tokens)[0]),
        'Scheda PNG': () => openPng(PNGS[0]),
        'Handout di scena': () => openSceneHandout(SCENE_HANDOUTS[0]),
        'Vista luogo': () => { S.scene = 'luogo:' + LUOGHI[0].id; applyScene(); },
        'Mappa del borgo': () => { S.scene = 'bellinde'; applyScene(); },
        'Mappa del dungeon': () => { S.scene = 'sotto'; applyScene(); },
        'Segnaposto luogo': () => openPlace(LUOGHI[0]),
      };
      for (const [nome, fn] of Object.entries(viste)) { provati++; try { fn(); } catch (e) { rotte.push(nome + ' → ' + e.name + ': ' + e.message); } }

      // Il Master deve poter togliere un PDI dalla mappa senza cancellarne la scheda.
      if (IS_GM) {
        provati++;
        try {
          S.scene = 'sotto'; applyScene();
          const p = POIS.find(x => x.id === 'porta_pietra');
          openPoi(p);
          if (!document.getElementById('poiRemove')) rotte.push('PDI → manca il comando visibile «Rimuovi dalla mappa»');
          closeModal();
        } catch (e) { rotte.push('PDI (rimozione dalla mappa) → ' + e.name + ': ' + e.message); }

        provati++;
        for (const p of POIS.filter(x => x.schemaVersion === 2)) {
          const errors = validatePoiDefinition(p);
          if (errors.length) rotte.push('PDI «' + p.title + '» → ' + errors.join('; '));
        }

        provati++;
        try {
          const epilogo = POIS.find(x => x.id === 'ultimo_custode');
          const sigillo = POIS.find(x => x.id === 'sigillo');
          if (!epilogo || epilogo.visibility !== 'hidden' || epilogo.image !== 'img/pdi-15-ultimo-custode.png' || !POI_ORDER.sotto.includes('ultimo_custode')) rotte.push('PDI 15 → scheda nascosta, immagine o guida non configurata');
          if (!sigillo || sigillo.modules.some(x => x.id === 'timer') || !JSON.stringify(sigillo).includes('FERMO') || !JSON.stringify(sigillo).includes('63 PF')) rotte.push('PDI 14 → regole del Custode non allineate');
          if (S.tokens.custode.hpMax !== 125 || S.tokens.custode.img !== 'img/monster-ultimo-custode.png') rotte.push('Custode → statistiche o ritratto non allineati');
          if (S.tokens.brak.img !== 'img/monster-vhaerun-brak.png' || !S.tokens.armigero1.img) rotte.push('Mostri → ritratti non collegati');
          openMonster('custode');
          if (!document.querySelector('#modal .portrait')) rotte.push('Scheda mostro → il ritratto non viene mostrato');
          closeModal();
        } catch (e) { rotte.push('PDI 14/15 e ritratti → ' + e.name + ': ' + e.message); }

        provati++;
        try {
          const a=S.tokens.adamus, m=S.tokens.maximus, oldA={form:a.form,size:a.size,thp:a.thp,formThp:a.formThp,preFormThp:a.preFormThp,speed:a.speed}, oldM={giant:m.giant,size:m.size};
          a.thp=8;
          setWildShape(true);
          if(a.form!=='toro'||a.size!==2||a.thp!==15||activeWildForm('adamus',a)?.name!=='Toro'||tokenActions('adamus',a)[0]?.n!=='Incornata') rotte.push('Adamus → Forma Selvatica del Toro non aggiorna scheda, PF temporanei, azioni e token');
          if(!document.querySelector('#modal #wildToggle')||!document.querySelector('#modal .sheethead')?.textContent.includes('Toro')) rotte.push('Adamus → scheda trasformata non visibile');
          const remoteA=toRemote(S).tokens.adamus;
          if(remoteA.form!=='toro'||remoteA.size!==2) rotte.push('Adamus → trasformazione non sincronizzata');
          setWildShape(false);
          if(a.thp!==8) rotte.push('Adamus → i PF temporanei precedenti non vengono ripristinati al ritorno');
          setGiantMight(true);
          if(!m.giant||m.size!==2||!tokenActions('maximus',m).some(x=>x.n.includes('Possanza'))) rotte.push('Maximus → Possanza del gigante non aggiorna azioni e token');
          if(!document.querySelector('#modal #giantToggle')||!document.querySelector('#modal .sheethead')?.textContent.includes('Grande')) rotte.push('Maximus → scheda gigante non visibile');
          const remoteM=toRemote(S).tokens.maximus;
          if(!remoteM.giant||remoteM.size!==2) rotte.push('Maximus → trasformazione non sincronizzata');
          setGiantMight(false);
          Object.assign(a,oldA); Object.assign(m,oldM); closeModal();
        } catch (e) { rotte.push('Trasformazioni Adamus/Maximus → '+e.name+': '+e.message); }

        provati++;
        try {
          const oldZenith=S.tokens.zenith?structuredClone(S.tokens.zenith):null;
          summonZenith(true);
          const z=S.tokens.zenith, remoteZ=toRemote(S).tokens.zenith;
          if(!z||z.owner!=='luigis'||z.hp!==30||z.ac!==16||z.speed!==12||z.actions[0]?.n!=='Colpo') rotte.push('Zenith → evocazione, scheda o controllo di Luigis non corretti');
          if(!remoteZ||remoteZ.owner!=='luigis'||remoteZ.speed!==12) rotte.push('Zenith → evocazione non sincronizzata');
          summonZenith(false);
          if(S.tokens.zenith) rotte.push('Zenith → congedo non riuscito');
          if(oldZenith) S.tokens.zenith=oldZenith;
          closeModal();
        } catch (e) { rotte.push('Evocazione di Zenith → '+e.name+': '+e.message); }

        provati++;
        try {
          const ids=['mattheus','maximus','luigis'], mt=S.tokens.mattheus, oldUsed=structuredClone(mt.used||{}), oldConds=Object.fromEntries(ids.map(id=>[id,structuredClone(S.tokens[id].conds||[])]));
          mt.used={...(mt.used||{}),1:0}; openBlessPicker('mattheus');
          for(const id of ids){ const c=document.querySelector(`#modal [name="blessTgt"][value="${id}"]`); if(c){ c.checked=true; c.dispatchEvent(new Event('change')); } }
          document.querySelector('#modal #blessGo')?.click();
          if(!ids.every(id=>hasCondition(S.tokens[id],'benedetto'))||!hasCondition(mt,'concentrazione')) rotte.push('Benedizione → non applica effetto e concentrazione ai bersagli');
          const bonus=blessBonus(S.tokens.maximus); if(bonus<1||bonus>4) rotte.push('Benedizione → il bonus automatico 1d4 non viene tirato');
          clearBlessing('mattheus'); mt.used=oldUsed; for(const id of ids) S.tokens[id].conds=oldConds[id]; closeModal();
        } catch (e) { rotte.push('Benedizione di Mattheus → '+e.name+': '+e.message); }

        provati++;
        try {
          const enemy=S.tokens.armigero1, oldHp=enemy.hp, oldLog=structuredClone(S.log), oldRandom=Math.random;
          Math.random=()=>0;
          openSpellSavePicker('mattheus','Sacred Flame');
          const target=document.querySelector('#modal [name="spellTgt"][value="armigero1"]');
          if(!target||!document.getElementById('spellSaveGo')) rotte.push('TS incantesimi → scelta automatica dei mostri non disponibile');
          else { target.checked=true; document.getElementById('spellSaveGo').click(); }
          const saveRoll=S.log.find(e=>e.kind==='roll'&&e.who?.includes('Fiamma sacra'));
          if(!saveRoll||saveRoll.skill!=='TS Des'||saveRoll.dc!==SHEETS.mattheus.spell.dc) rotte.push('TS incantesimi → tiro del mostro o CD dell’incantatore errati');
          if(enemy.hp>=oldHp) rotte.push('TS incantesimi → il fallimento non applica automaticamente il danno');
          const casterSaveSpells=Object.values(SHEETS).filter(s=>s.spell).flatMap(s=>s.spell.list).filter(n=>SPELL_SAVES[n]);
          if(!casterSaveSpells.includes('Moonbeam')||!casterSaveSpells.includes('Sacred Flame')||!casterSaveSpells.includes('Fireball')||!casterSaveSpells.includes('Compelled Duel')) rotte.push('TS incantesimi → non copre tutti gli incantatori');
          Math.random=oldRandom; enemy.hp=oldHp; S.log=oldLog; closeModal();
        } catch (e) { rotte.push('Tiri salvezza automatici dei mostri → '+e.name+': '+e.message); }
      }

      if (!IS_GM) {
        provati++;
        try {
          closeModal(); announcedRequestKey = '';
          S.request = { id: 'test-richiesta', skill: 'Percezione', dc: 13, targets: [me] };
          render();
          const notice = document.getElementById('requestNotice');
          if (!notice || notice.classList.contains('hidden') || notice.parentElement?.id !== 'secLog') rotte.push('Richiesta prova → avviso non visibile accanto al Registro');
          if (document.getElementById('modal').style.display !== 'flex' || !document.getElementById('requestPopupRoll')) rotte.push('Richiesta prova → popup non mostrato al giocatore');
          closeModal(); S.request = null; render();
        } catch (e) { rotte.push('Richiesta prova giocatore → ' + e.name + ': ' + e.message); }

        provati++;
        try {
          document.getElementById('dkDice').click();
          document.getElementById('diceExpr').value = '1d6';
          document.getElementById('diceGo').click();
          if (S.log[0]?.who !== S.tokens[me].name || dice3dOwner(S.log[0]) !== me) rotte.push('Dadi 3D → il tiro libero perde il colore del giocatore');
          closeModal();
        } catch (e) { rotte.push('Dadi 3D (tiro libero del giocatore) → ' + e.name + ': ' + e.message); }
      }

      provati++;
      try {
        const ids=['alessandros','adamus','luigis','mattheus','maximus','vicarus'];
        for(const id of ids){
          openSheet(id,'eq');
          const cards=[...document.querySelectorAll('#modal [data-inv-card]')], text=document.querySelector('#modal .sheetbody')?.textContent||'';
          if(cards.length<12||!text.includes('Valore')||!text.includes('Statistiche / bonus')||!document.getElementById('invSearch')) rotte.push('Zaino '+id+' → inventario incompleto o privo di dettagli e ricerca');
        }
        openSheet('vicarus','eq');
        const staff=[...document.querySelectorAll('#modal [data-inv-card]')].find(x=>x.textContent.includes('Bastone di Lyaras'));
        if(!staff||!staff.textContent.includes('Comando — 1 carica')||!staff.textContent.includes('Bastone arcano +2')) rotte.push('Zaino Vicarus → incantesimi, cariche o bonus del Bastone non visibili');
        const search=document.getElementById('invSearch'); search.value='filatterio'; search.dispatchEvent(new Event('input'));
        openSheet('mattheus','eq');
        if(![...document.querySelectorAll('#modal [data-inv-card]')].some(x=>x.textContent.includes('Filatterio di Lyaras'))) rotte.push('Zaino Mattheus → manca il Filatterio');
        sheetTab='car'; closeModal();
      } catch (e) { rotte.push('Zaini dettagliati dei personaggi → '+e.name+': '+e.message); }

      provati++;
      try {
        const ids=['alessandros','adamus','luigis','mattheus','maximus','vicarus'];
        for(const id of ids){
          openSheet(id,'sto');
          const text=document.querySelector('#modal .sheetbody')?.textContent||'';
          if(document.querySelectorAll('#modal .storychapter').length<4||document.querySelectorAll('#modal .storybond').length<4||!text.includes('Dove si trova adesso')||!text.includes('Galleria della Schiera')) rotte.push('Storia '+id+' → passato, avventura, legami o posizione attuale incompleti');
        }
        sheetTab='car'; closeModal();
      } catch (e) { rotte.push('Storie dettagliate dei personaggi → '+e.name+': '+e.message); }

      provati++;
      try {
        const ids = ['alessandros','adamus','luigis','mattheus','maximus','vicarus'];
        const colori = ids.map(id => dice3dTheme(id).background);
        if (new Set(colori).size !== ids.length) rotte.push('Dadi 3D → i giocatori non hanno sei colori distinti');
        for (const id of ids) if (dice3dTheme(id).background !== DICE_PLAYER_COLORS[id]) rotte.push('Dadi 3D → colore errato per ' + id);
        if (dice3dOwner({who:S.tokens.vicarus.name}) !== 'vicarus') rotte.push('Dadi 3D → il tiro non riconosce il giocatore');
      } catch (e) { rotte.push('Colori dadi 3D → ' + e.name + ': ' + e.message); }

      provati++;
      try {
        document.querySelectorAll('.ping').forEach(e => e.remove());
        lastPing = 0;
        S.ping = { id:'ping-prova-remota', t:Date.now()-60000, x:300, y:300, by:'Vicarus Cerullius', role:'vicarus' };
        renderPing();
        const ping = document.querySelector('.ping');
        if (!ping || ping.style.getPropertyValue('--gold') !== DICE_PLAYER_COLORS.vicarus || !(parseFloat(ping.style.getPropertyValue('--ping-inv')) > 0)) rotte.push('Ping giocatore → non visibile, non colorato o dipendente dall’orologio');
        ping?.remove(); S.ping = null;
      } catch (e) { rotte.push('Ping giocatore → ' + e.name + ': ' + e.message); }

      // Compendio: il tasto vero deve aprire il pannello a tre colonne (bug v45: il tasto puntava alla funzione vecchia)
      provati++;
      try { closeModal(); document.getElementById('btnComp').click(); if(!document.querySelector('.c3')) rotte.push('Compendio → il tasto apre la cornice vecchia, non il pannello a tre colonne'); closeModal(); }
      catch (e) { rotte.push('Compendio (clic sul tasto) → ' + e.name + ': ' + e.message); }
      const ver = (document.getElementById('ver') || {}).textContent;
      return { rotte, provati, ver };
    });

    if (ruolo === 'master') {
      try {
        await page.evaluate(async () => {
          const box = await dice3dLoad(), theme = dice3dTheme('vicarus');
          await box.updateConfig({ theme_customColorset: theme });
          if (box.colorData.background !== theme.background || box.colorData.texture.name !== 'none') throw new Error('il motore non applica il colore pieno del giocatore');
        });
      } catch (e) { esito.rotte.push('Dadi 3D → cambio colore reale non riuscito: ' + e.message); }
    }

    console.log(`\nRUOLO ${ruolo === 'master' ? 'MASTER' : 'GIOCATORE'} — versione ${esito.ver} — provati ${esito.provati} comandi`);
    if (esito.rotte.length) { rotti += esito.rotte.length; esito.rotte.forEach(x => console.log('  ROTTO: ' + x)); }
    else console.log('  tutto a posto');
    if (erroriPagina.length) { rotti += erroriPagina.length; erroriPagina.forEach(x => console.log('  ERRORE DI PAGINA: ' + x)); }
    await page.close();
  }

  // Ogni giocatore deve poter entrare direttamente col proprio personaggio dal link ?ruolo=… .
  for (const ruolo of ['alessandros', 'adamus', 'luigis', 'mattheus', 'maximus', 'vicarus']) {
    const page = await browser.newPage();
    await page.goto('file://' + file + '?prova=1&ruolo=' + ruolo);
    await page.waitForTimeout(400);
    const ok = await page.evaluate(r => ROLE === r && me === r && !IS_GM && !!S.tokens[r], ruolo);
    if (!ok) { rotti++; console.log('  ROTTO: link giocatore ?ruolo=' + ruolo); }
    await page.close();
  }

  await browser.close();
  console.log(rotti ? `\n✗ ${rotti} problemi: NON pubblicare.` : '\n✓ Nessun problema: si può pubblicare.');
  process.exit(rotti ? 1 : 0);
})();
