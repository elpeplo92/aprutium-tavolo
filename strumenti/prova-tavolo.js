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
    await page.goto('file://' + file + '?ruolo=' + ruolo);
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
      }

      // Compendio: il tasto vero deve aprire il pannello a tre colonne (bug v45: il tasto puntava alla funzione vecchia)
      provati++;
      try { closeModal(); document.getElementById('btnComp').click(); if(!document.querySelector('.c3')) rotte.push('Compendio → il tasto apre la cornice vecchia, non il pannello a tre colonne'); closeModal(); }
      catch (e) { rotte.push('Compendio (clic sul tasto) → ' + e.name + ': ' + e.message); }
      const ver = (document.getElementById('ver') || {}).textContent;
      return { rotte, provati, ver };
    });

    console.log(`\nRUOLO ${ruolo === 'master' ? 'MASTER' : 'GIOCATORE'} — versione ${esito.ver} — provati ${esito.provati} comandi`);
    if (esito.rotte.length) { rotti += esito.rotte.length; esito.rotte.forEach(x => console.log('  ROTTO: ' + x)); }
    else console.log('  tutto a posto');
    if (erroriPagina.length) { rotti += erroriPagina.length; erroriPagina.forEach(x => console.log('  ERRORE DI PAGINA: ' + x)); }
    await page.close();
  }

  // Ogni giocatore deve poter entrare direttamente col proprio personaggio dal link ?ruolo=… .
  for (const ruolo of ['alessandros', 'adamus', 'luigis', 'mattheus', 'maximus', 'vicarus']) {
    const page = await browser.newPage();
    await page.goto('file://' + file + '?ruolo=' + ruolo);
    await page.waitForTimeout(400);
    const ok = await page.evaluate(r => ROLE === r && me === r && !IS_GM && !!S.tokens[r], ruolo);
    if (!ok) { rotti++; console.log('  ROTTO: link giocatore ?ruolo=' + ruolo); }
    await page.close();
  }

  await browser.close();
  console.log(rotti ? `\n✗ ${rotti} problemi: NON pubblicare.` : '\n✓ Nessun problema: si può pubblicare.');
  process.exit(rotti ? 1 : 0);
})();
