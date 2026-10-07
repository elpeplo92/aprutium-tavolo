# Aprutium Tavolo — istruzioni per Claude

Questo repository È il tavolo da gioco virtuale (VTT) della campagna D&D 5e (2024)
"Aprutium — Atto Terzo" di Giuseppe (Dungeon Master). Sei il suo assistente tecnico e
di regia. Lavori in italiano, in autonomia: modifichi, ricostruisci, pubblichi.
Sito pubblico: https://elpeplo92.github.io/aprutium-tavolo/ (GitHub Pages, branch `main`, root).

Il contesto narrativo (Atti I–XVI, PNG, luoghi, manuale del mondo) sta nel Progetto
claude.ai "Dungeon Master Aprutium": usa `project_search`/`project_read` quando servono fatti
di gioco. Qui trovi solo ciò che serve per far funzionare e aggiornare il tavolo.

## Regola numero uno: niente spoiler

Il sito è pubblico e i giocatori lo aprono. Tutto ciò che è `pub` / visibile ai giocatori
deve contenere SOLO ciò che i personaggi sanno già. I segreti vanno in `gm` (testi solo master)
o restano fuori. Cose che i giocatori NON sanno (settembre 2026): Ceruso è in fuga; Micuccio;
il Sigillo. Nel dubbio, non scriverlo nel testo pubblico. Chiedi a Giuseppe se non sei sicuro.
Attenzione: i testi `gm` sono comunque nel sorgente della pagina (la password master
blocca il ruolo, non il codice). Vero segreto = solo nel nodo Firebase `master/` (ancora non usato).

## Struttura del repo

| Percorso | Cosa è |
|---|---|
| `src/tavolo.html` | **IL SORGENTE.** Un solo file HTML+CSS+JS (~1,5 MB) che usa le immagini di `img/`. Si modifica solo questo. |
| `img/` | Immagini del tavolo (mappe, ritratti), nome = md5 del contenuto. Per aggiungerne una: metti il file in `img/` e riferiscilo come `img/nome.jpg` nel sorgente. |
| `build.py` | `python3 build.py` copia il sorgente in `index.html` e controlla che le immagini esistano. `--inline` produce `dist/tavolo-unico.html` (tutto in un file, solo per l'artifact claude.ai). `--extract FILE` fa il contrario. |
| `index.html` | **GENERATO** da build.py. Non modificarlo a mano. |
| (archiviati) | I vecchi moduli `src/ext*_ui.js` e `src/poi_imgs.js`, già dentro tavolo.html, sono in `7_Aprutium/_ARCHIVIO_2026-10-05/` dal 05/10/2026. |
| `contenuti/mondo/*.json` | **FONTE UNICA della sezione "Il Mondo di Ea"** (v45; chiavi in forma tavolo, non ancora tradotte allo schema italiano): un file per voce — atlante, 28 nazioni + Terre Neutrali, 10 province, Ducato, 8 contee, 43 borghi. Schema: `id` (= nome file), `cat:"mondo"`, `livello` (atlante/nazione/provincia/ducato/contea/borgo), `parent`, `group`, `title`, `sub`, `img` e `mappa` (NOME LEGGIBILE dell'immagine, es. `Mappa di Teramum.jpg`), `colore` (tinta della scheda senza immagine), `scheda` (coppie chiave/valore), `state`, `pub`, `gm`, `atti`, `links`, `tag`, `tavolo` (scena da aprire). **Si modificano QUESTI file, non il blocco nel sorgente.** |
| `contenuti/luoghi/*.json` | **FONTE UNICA dei Luoghi** (v49, riordinati v52-53): 98 file — Julia Nova 61 (15 quartieri + 46 luoghi), Mushanè 22, Bëllindë 15. Schema del doc "Formato dei contenuti" (chiavi italiane): `id`, `tipo:"luogo"`, `titolo`, `sottotitolo`, `citta`, `gruppo`, `livello` (quartiere/luogo), `parent` (id del quartiere o del borgo del Mondo: `borgo-giglie`, `borgo-mushane`, `borgo-bellinde`), `img` (nome leggibile `Luogo — <titolo>.jpg`), `mappa` (immagine della mappa, solo i 15 quartieri), `stato`, `atti`, `scheda`, `pub` e `gm` (ELENCHI di blocchi `{t,txt}`), `prove` (`{t,skill,dc,ok,ko}`), `links`, `tavolo`, `segnaposto` (`{scena:"bellinde",id:"l1",num,x,y}` — solo i 15 di Bëllindë). `build.py` li traduce nella forma del tavolo (`_runtime`) e dai 15 con segnaposto genera anche l'array `LUOGHI` (handout a doppia sezione sulla mappa): **una cosa, un file**. |
| `contenuti/scene/*.json` | **FONTE UNICA delle scene-mappa** (v102): un file per scena (`sotto`, `bellinde`). `id` (= nome file = `S.scene`), `nome`, `menu` (voce del menu Scena), `ordine`, `mappa` {`img`, `larghezza`, `altezza`, `griglia`, `muri` (maschera: una stringa per riga di caselle da 30px, `1` = calpestabile)}, `regole` {`nebbia`, `muri`, `token`: tutti/gruppo/nessuno, `strumentiDungeon`, `segnaposto` (i segnaposto dei Luoghi)}, `punti` (i PDI **già in ordine di gioco**: l'ordine del file è l'ordine della Guida), `guida` (id di `SCENE_HANDOUTS`). `build.py` li controlla e li scrive nel blocco `/*@SCENE*/const SCENE_DATA=…/*@/SCENE*/`; `SCENES`, `POIS`, `POI_ORDER`, `SCENE_GUIDE`, `MASK` sono derivati da lì. **Mai cambiare gli `id` di scene e punti**: sono le chiavi di `S.scene`, `S.poiPos`, `S.poiRev` su Firebase. |
| `contenuti/_immagini.json` | Nome leggibile → `img/xxx.jpg` (locale, definitivo) oppure URL `https://d8j0ntlcm91z4.cloudfront.net/...` (provvisorio: render Higgsfield). Vale per tutte le categorie (Mondo e Luoghi). `c2Img` e `build.py` accettano `img/...` e `http(s)://...`. Al 12/09/2026 (v50): Mondo 47 locali + 45 URL; Luoghi 107 URL. Le immagini definitive le fornisce Giuseppe in `7_Aprutium/05_Immagini/Immagini Compendio - Il mondo/` (nomi `Nazione - X.jpg`, `Provincia - X.jpg`, `Contea - X.jpg`, `Borgo - X.jpg`, `Luogo - X.jpg`) oppure le scarica con `Sito/SCARICA-IMMAGINI-MONDO.bat` / `SCARICA-IMMAGINI-LUOGHI.bat`; Claude le riduce (1920 px, jpg q85), nome md5, le scrive in `Sito/img/` con `device_commit_files` (≤20 MB a file, ≤100 MB a chiamata; le immagini NON vanno nel tgz) e cambia SOLO questa tabella. Le mappe (`mappa`) sono export Azgaar o mappe dei quartieri: non si rigenerano. |
| `comp/data7.js` | Dati del Compendio (`COMPENDIO_DATA`, 375 voci + `COMP_IMG`) già inclusi in tavolo.html. Rigenerato da `comp/out/*.json`. |
| `comp/out/*.json` | Voci del Compendio per città/categoria (julianova, mushane, bellinde, fazioni, miti, oggetti, crociata, quest, diario). Schema in `comp/SCHEMA.md`. |
| `strumenti/prova-tavolo.js` | **La prova da lanciare prima di ogni pubblicazione.** `node strumenti/prova-tavolo.js` (oppure su `src/tavolo.html`). Preme tutti i bottoni nei due ruoli dopo aver simulato il giro dei dati su Firebase. |
| (archiviato) | Il vecchio `PUBBLICA-TAVOLO.bat` e i pacchetti tgz sono in `7_Aprutium/_ARCHIVIO_2026-10-05/`: si pubblica solo con `git push`. |
| `.nojekyll` | Obbligatorio per GitHub Pages (serve i file così come sono). |

## Come si struttura un luogo (regola di Giuseppe, 12/09/2026)

Ogni città del Compendio si costruisce a livelli, dall'alto in basso, e ogni livello ha **due immagini**:
`img` (l'illustrazione: com'è visto) e `mappa` (la mappa VTT: dove stanno le cose). Modello: la cartella
`7_Aprutium/01_Tavolo/Scene/Bëllindë/` (mappe) e `03_Compendio/02 Luoghi/Bëllindë/` (illustrazioni).

1. **La città** (voce del Mondo, `borgo-*`): `img` = veduta della città (`Julia Nova - veduta della città.png`,
   `Bëllindë - veduta del borgo.jpg`); `mappa` = mappa VTT della città con i punti d'interesse numerati
   (`Julia Nova - mappa con i punti d'interesse.png`; per Bëllindë la mappa illustrata del borgo, che è anche la scena del tavolo).
2. **I quartieri** (solo se la città è grande: Julia Nova ne ha 15, `livello: quartiere`): `img` = illustrazione del
   quartiere; `mappa` = mappa VTT del quartiere (`Q-NN … (dettaglio).png`).
3. **I luoghi** dentro i quartieri (o direttamente sotto la città, se è piccola come Bëllindë e Mushanè):
   `img` = illustrazione del luogo (`LUOGO - <nome>.png`); `mappa` = mappa VTT del luogo, quando esiste.

Le immagini le fa Giuseppe (Midjourney) e le mette in `01_Tavolo/Scene/<Città>/` (mappe) e `03_Compendio/02 Luoghi/<Città>/` (illustrazioni) con questi nomi; il nome del
file è la chiave in `contenuti/_immagini.json`. Nel Compendio: `img` è la copertina della scheda, `mappa` si apre
con «Apri mappa». Un luogo che Giuseppe non ha raccontato al tavolo non entra nel Compendio, anche se sta nella Guida
(12/09: tolti da Julia Nova Giardini della Rimembranza, Ala Ovest, Cortile della Milizia, Pozzo di Mara, Piazza del
Silenzio, Trabocco della Luna, Botola della Necropoli, Magazzino Neròn; Laboratorio di Torvus fuso nella Grande Forgia → 61 luoghi).

## Come si pubblica una nuova versione (procedura standard)

1. Modifica `src/tavolo.html`.
2. Alza il numero di versione: cerca `title="Versione della pagina">v45</span>` → v46, ecc.
   Una versione per ogni pubblicazione, sempre. Giuseppe controlla il numero in alto a destra
   nella pagina per capire se vede quella nuova (i browser fanno cache).
3. `python3 build.py` → prima rigenera i blocchi `/*@CONTENUTI*/…/*@/CONTENUTI*/` (tutte le voci di `contenuti/<categoria>/`) e `/*@LUOGHI*/…/*@/LUOGHI*/` (handout di Bëllindë) dentro `src/tavolo.html` (o solo quello: `python3 build.py --contenuti`), poi copia in `index.html`. Deve stampare "ok: ... versione vNN ... immagini usate" senza MANCANTI.
4. **Prova obbligatoria: `node strumenti/prova-tavolo.js`.** Simula il giro dei dati su Firebase e
   preme tutti i bottoni nei due ruoli. Deve finire con "Nessun problema: si può pubblicare".
   Se stampa anche un solo ROTTO, non si pubblica. Guardare solo la console del browser NON basta:
   i guasti di questo tavolo sono quasi sempre muti (un `onclick` che va in errore non stampa nulla
   e lascia il bottone lì, inerte). Serve premere i bottoni davvero.
5. `git add -A && git commit -m "v46: cosa è cambiato" && git push origin main`.
6. Dopo ~1 minuto è online. Dì a Giuseppe il numero di versione e cosa è cambiato, in due righe.

Non c'è più un piano B col .bat e i pacchetti tgz (archiviati il 05/10/2026): se il push non funziona, lo si dice a Giuseppe.

## Firebase (stato condiviso live)

- Progetto `aprutium-a8021`, piano Spark (gratis). Realtime Database europe-west1.
  La config pubblica è nel `<script>` in testa a `src/tavolo.html` (`window.FIREBASE_CONFIG`) — è normale che sia visibile, non è un segreto.
- Auth: **Anonima** per i giocatori; **Email/password** per il master, utente `master@aprutium.it`
  (la password la conosce solo Giuseppe: non chiedergliela, non scriverla mai nel repo).
- Regole: `partita/**` lettura/scrittura per utenti autenticati; `master/**` solo per master@aprutium.it.
- **Piano Spark: 100 connessioni simultanee.** Una connessione = una scheda del browser aperta.
  Sette persone al tavolo non lo sfiorano; tenerlo a mente solo se un giorno il link gira largo.
  Altri tetti (validi su tutti i piani): profondità 32 livelli, stringa singola max 10 MB,
  scrittura singola max 16 MB. Fonte: https://firebase.google.com/docs/database/usage/limits
- **COSA PERDE FIREBASE — la trappola che ha già fatto danni.** Realtime Database non è un archivio
  JSON fedele. Butta via, senza avvisare:
  · le liste vuote (`[]`) — la chiave sparisce del tutto;
  · gli oggetti vuoti (`{}`) — idem;
  · i valori `null` — idem.
  Inoltre un `undefined` dentro i dati fa fallire l'intera scrittura.
  Un salvataggio con `fog.ops: []` torna indietro senza `ops`, e `for (const o of f.ops)` va in errore.
  L'11/09/2026 questo aveva ucciso 13 comandi (Inizia scontro, Prossimo turno, Termina, Porte,
  Rivela intorno al gruppo, aree degli incantesimi, bestiario, tiri segreti/visibili, Annulla
  movimento, TS contro morte, Tira libero) — tutti muti, nessun messaggio. Il tasto Muri restava
  incastrato acceso e il tasto Porte non si accendeva mai, perché `drawFog()` andava in errore
  prima del cambio di colore.
  **La difesa è la funzione `normalize(s)` in testa al sorgente**, chiamata da `merge()` a ogni
  lettura: ricostruisce la forma dello stato. Ogni campo nuovo dello stato va aggiunto a
  `SHAPE_ARR` (liste) o `SHAPE_OBJ` (oggetti), altrimenti il problema si ripresenta identico.
  Controprova fatta: stesso codice con un database fedele → 0 errori; con Firebase → 13 comandi morti.
- La pagina scrive/legge un solo documento: `partita/stato` (JSON con `tokens`, `log`, `poiPos`,
  `compOv`, `comp2`, `inv`, ecc.). Funzioni chiave in tavolo.html: `fbConnect()`, `fbMasterLogin()`,
  l'adapter espone `db.doc(path).get/set/onSnapshot` come il vecchio db degli artifact.
- Chi apre il sito sceglie: "Sono il Master" (chiede la password) o "Sono un giocatore"
  (anonimo). `?ruolo=vicarus` ecc. forza il personaggio.
- Per cambiare lo stato di gioco senza passare dalla pagina: Giuseppe può darti accesso alla
  console Firebase dal suo Chrome (Claude in Chrome) oppure aggiornare `stato/stato_fb.json` qui e
  caricarlo dalla pagina stessa via `javascript_tool` (`firebase.database().ref('partita/stato').set(...)`).
  Le chiamate dirette a googleapis/firebaseio dal container Claude sono bloccate dalla rete.

## Il Compendio a tre colonne (v45, Luoghi ad albero dalla v49)

Il Compendio è un pannello a tre colonne: elenco a sinistra (sezioni, Raccolte, Visibilità), griglia di schede
al centro, dettaglio a destra (`#compDetail`). La sezione "Il Mondo di Ea" è ad albero: chip per livello
(Mappe, Nazioni, Province, Ducato, Contee, Borghi), briciole di pane, tab Panoramica / Collegamenti / Note.
Codice: blocco "ESTENSIONE 8" in fondo al sorgente (`openCompendio`, `renderCompendio`, `c3RenderBody`,
`c3RenderDetail`). La sezione "Luoghi" è anch'essa ad albero (chip per città, briciole fino al borgo, `C3_TREE=['mondo','luogo']`): il dettaglio mostra `scheda`, i blocchi `pub`/`gm` con i loro titoli e le `prove` con il tasto «Chiedi» (crea `S.request` come il tasto Chiedi prova del tavolo). `c2Plain()` appiattisce pub/gm a stringa per ricerca, editor e vecchie sezioni. Le altre sezioni (Personaggi, Fazioni…) usano ancora `renderC2Entry`, che scrive nel pannello di dettaglio. I collegamenti `[PNG — Nome]`, `[LUOGO — Nome]` ecc. nei testi diventano link se la voce esiste ed è visibile, altrimenti resta il nome.
Preferiti e Recenti stanno in `localStorage` (per persona, per browser); le Note del master in
`S.notes['c2:'+id]` (Firebase, condivise fra i dispositivi del master).

## Cose note / limiti

- **TRAPPOLA FIREBASE — leggere prima di toccare lo stato.** Realtime Database non conserva gli
  array vuoti: la chiave sparisce del tutto. Uno stato salvato con `fog.ops: []`, `log: []`,
  `order: []` torna indietro SENZA quelle chiavi, e ogni `for...of` su di loro va in errore.
  In v44 questo aveva spento la nebbia, il tasto Porte (che non diventava più giallo perché
  `drawFog()` andava in errore prima del toggle della classe), il tasto Muri (che restava
  incastrato acceso) e "Rivela intorno al gruppo". La correzione è la funzione `normalize(s)`
  in testa al sorgente, chiamata da `merge()` a ogni lettura: ricostruisce la forma dello stato.
  **Qualunque nuovo campo array o oggetto dello stato va aggiunto a `SHAPE_ARR` / `SHAPE_OBJ`.**
- Il "Gobbo" (co-narratore live, sezione `#secGobbo`) usa `claude.use('sample')`: funziona SOLO
  nell'artifact claude.ai. Dalla v44 la sezione si nasconde da sola sul sito pubblico (dove
  `window.claude` non esiste) invece di offrire bottoni muti. Per farlo funzionare sul sito
  servirebbe un backend: mai chiavi API nel client.
- Esiste ancora l'artifact claude.ai del tavolo (v42, https://claude.ai/code/artifact/a30177dd-72ce-45df-a4aa-1aa72f45e8ee)
  con il suo db separato: è il vecchio canale, il sito è quello buono. Non tenerli sincronizzati a mano.
- I giocatori (personaggi): Alessandro→Alessandros Cerullius, Vincenzo→Vicarus Cerullius,
  Adamo→Adamus Marotianus, Massimo→Maximus Grazianus, Matteo→Mattheus Pilos, Luigi→Luigis Barbas.
  La sezione "Naviganti Grigi / Perla Silenziosa" del Compendio è visibile SOLO ad Adamus e al master.
- Compendio: tre stati per voce (visitato/incontrato, noto, segreto); override del master in
  `S.compOv[id]`, voci nuove in `S.comp2`, inventario per PG in `S.inv[pgId]`, tutti sincronizzati live.
- `python3 build.py` in una copia di lavoro senza la cartella `img/` completa stampa MANCANTI ed esce con errore 1: è
  normale se il pacchetto che consegni non contiene `img/` (il repo su GitHub le ha già). Controlla che la lista
  siano solo immagini vecchie già online, poi lancia comunque `node strumenti/prova-tavolo.js`.
- Mappa attuale: Bëllindë. I POI sono trascinabili dal master (`S.poiPos`).

## Come lavora Giuseppe

Diretto, frasi corte, niente gergo; vuole la raccomandazione prima del ragionamento e niente
"opzioni a menù". Se sta per fare un errore diglielo subito. Lavora no stop: non proporre pause.
Non conosce git/Firebase/GitHub: non chiedergli operazioni tecniche se puoi farle tu; se proprio
servono, una sola istruzione per volta, con lo screenshot in mente. Quando gli riporti un lavoro:
numero di versione, cosa è cambiato, cosa deve controllare lui. Basta.

## v55 (12/09/2026) — nuova grafica

- Font: `Cinzel` solo per il logo (`--logo`), `Cormorant Garamond` per i titoli (`--display`), `Source Sans 3` per il testo (`--ui`). Corpo 16px; nel CSS le taglie sono state alzate di un gradino (11→13, 12→14, 13→15, 14→15). Giuseppe trovava i testi troppo piccoli: **non tornare sotto i 13px**.
- Barra in alto unica: logo · tab con icone **Tavolo / Diario / Compendio** (`#navTavolo`, `#navDiario`, `#btnComp`) · fase · presenza «N online» · «Vista» (il vecchio SEI, `#roleSel`). Il Compendio resta una finestra sopra il tavolo (`#modal`, che ora parte sotto la barra: `inset:60px 0 0 0`, z-index 8; header z-index 9). Diario = `openArchive()` (le sessioni archiviate dal Registro).
- Il menu Scena del master sta nel pannello destro (prima sezione); i giocatori vedono il nome della scena nell'HUD in alto a destra insieme alla scala.
- Colonna sinistra 196px, medaglioni 170px. Pannello destro 340px, sezioni come schede (`.sec` con bordo e raggio; `.sec:empty` nascosta).
- Dock in basso al centro (`#dock`): Muovi · Misura · Tira dadi · Ping. Ping = un clic sulla mappa (il doppio clic funziona ancora). Tira dadi = modale con d4…d100 + espressione, va nel Registro come evento `sys`. Zoom in basso a destra (`#zoomlbl`, `#zin2/#zout2`); i vecchi `#zin/#zout` restano nascosti.
- Presenza: `partita/presenza/<uid>` con `onDisconnect().remove()`; conteggio in `#liveTxt`.
- Il Gobbo (assistente AI nel tavolo) è stato **tolto** su richiesta di Giuseppe: non era usabile sul sito pubblico. Il Gobbo è Claude in chat.

## v57 (12/09/2026)

- Palette: dal marrone al **blu notte** (`--ground:#070A11 --panel:#0E131D --panel2:#151C2A --line:#263042`, inchiostro `#E8E3D6`). L'oro resta. I colori dei token (marroni/verdi nel JS) non si toccano.
- Colonna sinistra 184px; i medaglioni hanno altezza `clamp(92px,calc((100vh - 168px)/6),170px)`: i sei PG stanno sempre tutti nello schermo.
- Riquadro iniziativa del master, tre clic: 1° chiede al giocatore (si illumina), 2° tira al posto suo, 3° azzera (`.init.reset`, torna il d20). L'azzeramento toglie il PG da `S.order` e da `S.request`.
- Compendio: la × generale della finestra è nascosta (si esce con la tab Tavolo o Esc); la scheda si chiude con «‹ Torna all'elenco».

## v58 (12/09/2026)

- Schede dei PG a sinistra **orizzontali** (come nel mockup di Giuseppe): ritratto 68px a sinistra con il badge iniziativa sull'angolo, a destra nome (solo il primo nome per i PG, il nome intero nel `title`), PF «26 / 36» e barra. Colonna 236px. Struttura: `.med > .pic(.init,.disc) + .info(.nm,.hpn,.hpbar,.condrow,.ds)`. Il `.med` non ha più l'immagine di sfondo: sta su `.pic`.

## v59 (12/09/2026) — punti d'interesse (PDI) e token dei PG

- **Token dei PG**: `PG_TOKENS` (id → `img/<md5>.png`, i file `TOKEN - PG …` di `05_Immagini\Token Roll20`, con l'anello verde già dentro l'immagine). Classe `.tok.hastok`: niente bordo colorato né sfondo; resta solo il bagliore oro del turno attivo. Alias in `_immagini.json`.
- **PDI, tipi** (`poiKind`): porta, trappola, enigma, dettaglio, scontro, stanza, corridoio, scena, persona. I vecchi `lore→dettaglio`, `boss→scontro`, `passaggio→porta`. Icone in `POI_ICONS` (+ `unknown` = «?»).
- **Visibilità**: i giocatori vedono ogni PDI come «?» finché il master non lo svela (`S.poiRev[id]`, in `SHAPE_OBJ` e in `merge`). Tipi **nascosti** (`poiHidden`: trappola, dettaglio, porta con `segreta:true`) non compaiono affatto finché non svelati. Il master vede sempre l'icona vera; se non svelato ha anello tratteggiato + badge «?» (`.poi.unrev`).
- **Scheda PDI (master)**: «Svela/Nascondi ai giocatori»; «Da leggere ai giocatori» = `text`; Note del master = `gm`; per i nascosti «Per notarlo: Percezione CD `spotDc`» (default 13, campo `spot` per cambiare abilità) a un PG o a tutto il gruppo → `S.request.poi=id`; `poiCheckReveal(tot)` (in `doRoll` e `rollFor`) svela da solo se qualcuno passa. La prova del punto (`skill/dc/ok/ko`) resta separata, anche lei a uno o a tutti.
- I giocatori che cliccano un «?» vedono solo «Qualcosa, qui — il master vi dirà cosa vedete».
- Regola di Giuseppe: ogni PDI ha immagine, testo da leggere, note master; prova quasi sempre; bottino solo dove c'è (da fare: voci con «Assegna a…» PG/Party/Crociata → `S.inv`). Prossimo: aggiungere a Sotto Bëllindë i PDI stanza/corridoio/scena dagli handout (lista da approvare).

## v60 (12/09/2026) — nebbia

- `drawFog` in tre passi: (1) maschera delle zone svelate su un canvas fuori schermo (`fogMask`), (2) coltre blu notte `rgb(6,9,15)` + texture di fumo procedurale (`fogNoise`, 512px, blob replicati sui bordi per non vedere le giunture) ritagliata con `destination-out` e `filter:blur(9px)` → bordi sfumati anche sui poligoni di linea di vista, (3) `#fogsmoke`: strato CSS con fumo che si muove (animazioni 46s/71s), mascherato con `mask-image` = dataURL del canvas della nebbia. Il master vede la coltre al 62%.
- `img/161b43d7ae87.jpg` nella copia di lavoro è una copia del PNG di Giuseppe (serve solo agli screenshot; il repo ha il suo).

## v61 (12/09/2026) — colonna «Guida della scena»

- Quarta colonna `#guide` (solo master; `body.isgm` → griglia `236px 1fr 320px 340px`) tra la mappa e la Regia. Sopra `#guideTop`: `#luogoGM` (handout del luogo, per le scene-luogo) oppure `#sceneGuide` (per le scene-mappa: le schede di `SCENE_HANDOUTS` elencate da `SCENE_GUIDE[scena]` in ordine di gioco, ognuna apribile lì o «Apri» a tutto schermo). Sotto `#guideLog`: il **Registro** (`#secLog`), spostato lì da `applyRole` quando si è master; per i giocatori resta nella colonna destra.
- Nelle scene-luogo si nascondono dock, zoom, strumenti e HUD (`renderGuide`).
- Decisione di Giuseppe: il Registro sta sotto la guida della scena, così segue i tiri mentre legge.

## v62–v63 (12/09/2026)

- v62: tolto `will-change:transform` da `#world` (bloccava la resa a 100% e ingrandiva come una foto: token e mappa sgranati allo zoom).
- v63: azioni del giocatore a gruppi **Azione / Azione bonus / Reazione / Senza azione** (`ACT_ECO`) con icona e colore per tipo (`ACT_ICON`: mischia, distanza, incantesimo, cura, speciale). Ogni azione in `DEFAULT_STATE` ha `tipo` ed `eco`; se mancano, `actTipo()` indovina dal nome. Tolta la nota «Trascina il tuo token…».

## v64 (12/09/2026) — azioni complete dei PG (regole 2024)

- Pannello Azioni del giocatore: tre schede **Azione / Azione bonus / Reazione** (`actTab`), ogni voce con icona, nota breve (`note`: slot, CD, maestria, usi) e tiro. In fondo «Per tutti»: le azioni generiche del regolamento (`GENERIC_ACTS`: Attacco, Scatto, Disimpegno, Schivata, Aiuto, Nascondersi, Cercare, Studiare, Influenzare, Usare oggetto, Prepararsi; reazione: Azione preparata). Le voci senza tiro vanno nel Registro come nota.
- Le liste stanno in `DEFAULT_STATE.tokens[pg].actions` e sono generate da `scarica/azioni_v64.py` (fonte: `SHEETS` + regole 2024). Rifare da lì, non a mano.
- Dubbi sulle schede segnalati a Giuseppe (v64): CA di Alessandros 22 (cotta 16 + scudo 2 = 18); Vicarus tiro incantesimi era +10 (con Bastone +2 dovrebbe essere +8, CD 16) e ha 5 trucchetti invece di 4; Adamus ha 11 incantesimi preparati (max 9) e Trovare famiglio non è druidico (ok solo via Compagno selvatico); Mattheus ha due talenti di 4° (Robusto e Condottiero ispiratore) ma un solo aumento al 4°; Alessandros ha 7 incantesimi preparati oltre a Punizione divina (max 5).

## v65 (12/09/2026) — bersaglio e danno automatico

- `doAction` con `atk` o `dmg` apre `openTargetPicker`: elenco dei token in vista (`targetsFor`: prima gli avversari, ordinati per distanza in metri; omonimi numerati; PF visibili se master o PG; CA solo al master). «Solo il tiro, senza bersaglio» = comportamento vecchio (`plainRoll`).
- Attacco (`resolveAttack`): d20 + `atk` contro la CA del bersaglio; 20 = critico (dadi raddoppiati, `rollDmg`), 1 = mancato; se colpisce `applyDamage` (PF temporanei prima) e nel Registro «COLPITO/MANCATO → bersaglio (a N PF)». Multiattacco = due tiri sullo stesso bersaglio.
- Incantesimo con TS (`resolveSave`): danno tirato una volta, poi per ogni bersaglio i pulsanti Tutto / Metà / Niente (chi ha lanciato o il master decide dopo il TS). Vale per PG e mostri.
- Font `Draconis` per il logo/titoli (`--logo`): `@font-face` che cerca `Sito/font/Draconis.ttf` (o `.otf`); se il file manca resta Cinzel. Giuseppe deve mettere il file lì.

## v66 (12/09/2026) — font Draconis

- `Sito/font/Draconis.otf` e `Draconis-Bold.otf` (da `7_Aprutium\Font Draconis`, licenza Pixel Sagas: uso personale). `--logo` e `--display` = Draconis: logo (32px), titoli di sezione `h2` (18px, senza maiuscoletto forzato), titoli delle modali (30px), nomi nelle schede. Il testo corrente resta Source Sans 3: Draconis è condensato e sotto i 16px non si legge. La cartella `font/` va nel pacchetto.

## v67 (12/09/2026)

- Logo: immagine `img/logo-aprutium.png` (PNG trasparente di Giuseppe, ridotto a 900px) dentro `h1`, alto 46px. Il testo «APRUTIUM» non c'è più.
- Draconis è ora anche il font del testo corrente (`--ui`), corpo 18px, interlinea 1.5, spaziatura .02em. Richiesta di Giuseppe: «va usato su tutto». Se qualcosa risulta illeggibile, alzare il corpo, non cambiare font.

## v68 (12/09/2026)

- Corpo 20px, tutte le taglie del CSS +2px. Draconis anche in corsivo e grassetto corsivo (`font/Draconis-Italic.otf`, `Draconis-BoldItalic.otf`). Grassetto: nomi, titoli, etichette, pulsanti primari, chi tira nel Registro. Corsivo: note, testi da leggere ai giocatori, note del master. Regola in fondo al CSS («grassetto e corsivo (v68)»).

## v69 (12/09/2026)

- Tutte le taglie del CSS +3px (corpo 23px). Colonne: 250 / mappa / 340 (guida) / 370 (regia). Giuseppe vuole caratteri grandi: prima di ridurre qualcosa, chiedere.

## v70 (12/09/2026) — font dei manuali D&D

- I manuali 5e usano Bookmania (testo), Mrs Eaves Small Caps (titoli di sezione), Scala Sans (tabelle e blocchi statistiche), Modesto Condensed (titoli dei capitoli). Cloni liberi (CC-BY-SA 4.0, pacchetto Solbera, `font/LICENSE-Solbera-CC-BY-SA.txt`): **Bookinsanity**, **Mr Eaves Small Caps**, **Scaly Sans / Scaly Sans Caps**, **Nodesto Caps Condensed**. Tutti in `font/`.
- Variabili: `--ui` Bookinsanity (testo corrente, corsivo per note e testi da leggere), `--caps` Mr Eaves (h2, eyebrow, tab, summary), `--display` Nodesto (titoli grandi, nomi nelle schede), `--sans` Scaly Sans (pulsanti, select, numeri, PF, tabelle, note delle azioni). Draconis non è più usato (i file restano). Corpo 21px.

## v71 (12/09/2026) — scala tipografica rimessa in ordine

- Dopo i tre aumenti a gradini le taglie erano incoerenti. Ora scala fissa in fondo al CSS («scala tipografica (v71)»): corpo 19 · piccolo 15/17 · sezioni 22 (Mr Eaves) · titoli 30/34 (Nodesto) · logo 46px. Colonne: 224 (gruppo) / mappa / 300 (guida) / 330 (regia) — la mappa deve restare almeno metà schermo a 2000px.
- Per cambiare le taglie si tocca SOLO quel blocco finale, non i valori sparsi.

## v72 (12/09/2026) — guida della scena punto per punto

- Tolta la sezione «Note del master» dal pannello destro (obsoleta per Giuseppe). I dati restano in `S.gmNotes`; i riferimenti a `notesToggle`/`gmNotes` sono protetti da `if`.
- `renderGuide()` per le scene-mappa elenca i PDI della scena **in ordine di gioco** (`POI_ORDER[scena]`, per `sotto`: pozzo → murata crollata → intercapedine → solchi → linea → rilievi → catene → memorie → micuccio → sigillo → murata) come schede `.gpoi` apribili: numero, icona del tipo, titolo, stato (svelato / nascosto / ?), «Da leggere ai giocatori», «Note del master», prova, e i tasti «Vai sulla mappa» (`centerOn`), «Apri», «Chiedi Percezione al gruppo» (richiesta con `poi` → svelamento automatico), «Chiedi <abilità> al gruppo», «Svela ai giocatori / Nascondi». Sotto seguono le «Schede della scena» (`SCENE_GUIDE`). Una scena nuova va aggiunta sia a `POI_ORDER` sia a `SCENE_GUIDE`.
- Controllo fatto sull'handout «ESPLORAZIONE — Sotto Bëllindë»: i suoi punti (pozzo, porta murata crollata, intercapedine, Aree 1–6, cuore/Quarto Sigillo, uscita) sono tutti coperti dagli 11 PDI esistenti. Nessun PDI nuovo creato.

## v73 (13/09/2026) — dadi 3D sulla mappa

- Libreria `dice/dice-box-threejs.umd.js` (MIT, `dice/LICENSE-dice-box-threejs.txt`; three.js + cannon) con `dice/textures/` e `dice/sounds/`. Scelta perché accetta l'esito **predeterminato** (`1d20+2d8@17,5,3`): il tiro lo decide sempre il tavolo (`Math.random` di chi tira, sincronizzato via Firebase) e tutti i tavoli aperti vedono cadere gli stessi numeri. La `@3d-dice/dice-box` normale non lo permette (il risultato lo decide la fisica).
- Meccanica: `d20()` e `rollExpr()` annotano ogni dado in `DICE_BUF`; `log(ev)` lo scrive in `ev.dice` (`"20:17,8:5,8:3"`, solo se tirato negli ultimi 3 s). `render()` chiama `dice3dSync()`: ogni evento del Registro con `dice` non ancora visto (`D3.seen`) viene animato con `dice3dRoll` → `dice3dNotation` (raggruppa per faccia; d100 = d100 decine + d10 unità). Nei primi 4 s dalla pagina non si anima nulla (il Registro arrivato da Firebase). Gli eventi `gm` (tiri segreti dei nemici) non si animano ai giocatori.
- Il caricamento è pigro: lo script parte al primo tiro. Contenitore `#dice3d` (sopra mappa e token, sotto il dock, `pointer-events:none`). Dadi oro (`theme_customColorset` «aprutium», texture bronze03, metal), `baseScale:150`. Spariscono dopo 4,5 s; tiri in coda a 1,2 s l'uno dall'altro.
- Impostazioni nella finestra «Tira dadi»: «Dadi 3D sulla mappa» (`localStorage.dadi3d`, per browser) e «Suono dei dadi» (`dadi3dSuono`, spento di default; i browser bloccano l'audio finché non si clicca).
- La cartella `dice/` va nel pacchetto tgz (≈3 MB, una volta sola).

## v102 (26/09/2026) — una scena, un file

- Le scene-mappa non sono più sparse in sei posti del sorgente: stanno in `contenuti/scene/<id>.json` (vedi tabella in alto). Una scena nuova = un file nuovo + `python3 build.py`; compare da sola nel menu Scena.
- Il codice non controlla più il nome della scena (`CUR.id==='sotto'` / `'bellinde'`): legge le proprietà della scena aperta. `CUR.pois` (la scena ha punti), `poiInScene(p)` (il punto appartiene alla scena aperta: ogni PDI ha `p.scene`), `CUR.tokens` (`true` / `'party'` / `false`), `CUR.places`, `CUR.dungeon` (mostra le sezioni `.dungeon-only`), `CUR.mask` + `curMask()` (maschera dei muri della scena aperta).
- Migrazione verificata: dati caricati identici alla v101 (16 PDI, ordine, guida, scene, maschera), stessi conteggi a schermo in sotto / borgo / luogo, `prova-tavolo.js` verde in entrambe. Id invariati: lo stato Firebase della partita resta valido.
- `strumenti/prova-tavolo.js` gira anche su Windows: indirizzo del file con `pathToFileURL`, accetta `playwright-core`. Esempio: `CHROMIUM="C:/Program Files/Google/Chrome/Application/chrome.exe" node strumenti/prova-tavolo.js`.
- Ancora nel codice, non nella scena: porte e muri dipinti (`S.doors`, `S.walls`: stato della partita) e i token di partenza (`DEFAULT_STATE.tokens`).
- Scoperto, NON introdotto in v102: `SCENE_GUIDE` (le schede narrative della scena) non è letto da nessuna funzione; la Guida mostra solo i PDI. Il dato `guida` resta nei file in attesa di una decisione di Giuseppe.
- `AVVENTURA.md`, `MODELLO-DATI.md`, `CONFINI-E-CONSEGNA.md`, `INTERFACCIA.md` (archiviati il 05/10/2026 in `7_Aprutium/_ARCHIVIO_2026-10-05/`) descrivevano la v74: la parte «la scena come unità dati» è superata da questa versione.

## v103 (27/09/2026) — moduli dei PDI, scoperta, fase, scheda, grafica

- **PDI v3** (per ora solo `pozzo`, in `contenuti/scene/sotto.json`): `breve`, `moduli` in ordine di gioco con `tipo`, `parte` (indizio/evento/nascosto), `seme` (frase esatta del testo, evidenziata e cliccabile per il master), `innesco`, `leggi`, `note`, `prove` (abilità, CD, `gruppo`: chi/tutti/migliore/meta, `esiti` a fasce che si accendono da sole coi tiri), `dopo`, `rilancio`, `daqui`, `bozza`. «Mostra a…» (tutti o singoli PG) → `S.show.to`; resta nel punto come «Cosa avete scoperto qui». Codice: blocco «PDI v3» (`v3RenderMods`, `v3Ask`, `v3Record`, `v3ShowDialog`). build.py controlla semi, id e «Da qui». Le bozze del Pozzo sono da far approvare a Giuseppe.
- **Scoperta dei PDI**: ai giocatori un punto esiste solo se svelato (`poiVisible` → `poiRevealed`). Il tavolo del MASTER (`spotScan` in `render`, solo dopo `FB_LOADED`) confronta la Percezione passiva dei PG che hanno il punto in vista (9 m, linea libera, `nota.entro`) con la CD (`nota.cd`; 0 per gli evidenti, CD di scoperta per i nascosti) → `S.poiSpot` (lampeggia, «Da svelare» nella Guida) o `S.poiMiss`. Una Percezione libera del PG confronta con tutti i punti in vista (`spotActive`). `necessario:true` → avviso rosso. Svela = a tutti.
- **Pulsante della fase** in cima alla colonna del gruppo (`renderPhaseBtn`): Esplorazione / Fermi tutti (qualcuno ha notato un punto: i giocatori non muovono finché il master svela o «Fai ripartire», `poiSpot[pid].hold`) / Scontro «Tocca a: …». Il menu del master usa i vecchi `btnStart/btnNext/btnEnd`.
- **Layout**: Registro sotto i personaggi (`#railLog`) per tutti, con icone Archivio/Archivia/Svuota; Guida della scena anche ai giocatori (`renderPlayerGuide`: punti svelati + scoperte personali); colonne 244 / mappa / clamp(300,21vw,460) / 330.
- **Scheda del personaggio** (`renderSheet`, finestra a tutto schermo): intestazione con CA/Iniziativa/Velocità/Competenza e condizioni; sezioni Panoramica · Capacità · Incantesimi · Inventario (tabella + filtri + carta pergamena dell'oggetto) · Diario. «Diario» in alto è diventato «Scheda» (id `navDiario`): il master apre il PG selezionato, il giocatore il proprio. Il diario delle sessioni è l'icona Archivio del Registro.
- **Grafica** (blocco «STILE DEFINITIVO» in fondo al CSS): fondo quasi nero liscio, un filo ottone sottile, titoli Mr Eaves maiuscoletto oro con ✦ (il glifo va disegnato con un font di sistema), testo Scaly Sans, pergamena solo nella Guida (a tutta colonna) e nella carta dell'oggetto; personaggi come elenco senza cornici. Giuseppe ha bocciato: pergamena ovunque, cornici ornate SVG, riga irregolare, sfondi nuvolati, cornici generate con Higgsfield. Draconis tolto.
- Nuovi campi di stato (in `SHAPE_OBJ`, `merge`, `toRemote`): `poiRoll`, `poiSeen`, `poiSpot`, `poiMiss`. Verificato: dallo stesso stato reale v102 e v103 riscrivono identici token, posizioni, nebbia, porte, iniziativa.
- `prova-tavolo.js`: lo zaino è ora una tabella (`[data-invi]` + `.invcard`); la prova clicca ogni oggetto.

## v104 (27/09/2026) — scheda del personaggio a sette sezioni

- `renderSheet`: Panoramica · Inventario · Attacchi · Incantesimi (solo incantatori: Maximus non l'ha) · Capacità e Talenti · Background · Diario. Vecchi nomi accettati da `openSheet`: `car`→pan, `eq`→inv, `sto`→bg.
- **Attacchi** (`sheetAttacksHtml`): le azioni del PG con colpire o danno (non le cure), divise per Azione / Azione bonus / Reazione; «Attacca» chiude la scheda e chiama `doAction` (scelta del bersaglio, danno automatico). Con la Forma selvatica attiva mostra gli attacchi della forma. I trucchetti stanno già nelle azioni del PG (con i bonus degli oggetti, es. Bastone di Vicarus +11): non ripeterli dalla lista incantesimi.
- **Capacità e Talenti** (`sheetFeaturesHtml`): privilegi di classe, azioni senza tiro («Usa»), talenti, lingue / Percezione passiva / dadi vita.
- **Background** (`sheetBackgroundHtml`): ritratto, origine, legami e la storia di `CHAR_STORIES` (mai `sh.lore`: contiene segreti).
- **Diario** (`sheetDiaryHtml`): pagine personali in `S.diari[pgId][pNNN]={t,tit,txt,by}` (nuovo campo di stato: in `SHAPE_OBJ`, `merge`, `toRemote`). Lo vedono e scrivono solo il PG e il master; «Elimina» chiede conferma con un secondo clic.

## v104 (27/09/2026) — Sotto Bëllindë al canone, Guida della scena completa

- Canone dei PDI in `CANONE-PDI.md` (scena, punto, moduli, prove, scoperta, regole di scrittura). Tutti i 16 PDI di `sotto.json` sono v3; i 15 oltre al Pozzo sono stati completati con aggiunte segnate `bozza` (breve, parte, seme, innesco, dopo, rilancio, daqui) e le istruzioni per il master sono state tolte dai campi mostrabili. Nessun testo originale perso (verificato riga per riga).
- Ogni PDI ha `nota.cd` (Percezione passiva, mostrata al master); `nota.auto:false` = mai scoperto da solo (Ultimo Custode, stesso punto del Sigillo).
- Scena: `citta` (menu Scena raggruppato per città, luoghi rientrati sotto la mappa, «16. Sotto Bëllindë»), `intro` = {leggi, note, ingressi[{da, primo, poi, note}], bozza}. «Mostra ai giocatori» registra `S.poiSeen['_intro__<scena>__leggi']`: l'introduzione resta nella Guida dei giocatori.
- Guida della scena: menu Scena dentro la pergamena (`placeSceneSel`), handout del luogo dentro la Guida (`LUOGO_GM`), testi del luogo per i giocatori nella loro Guida (il pannello `.lv-text` sulla mappa è nascosto), immagine piccola di ogni PDI.
- Salvataggio automatico dello «spot» solo dopo `FB_LOADED` (evita di scrivere lo stato iniziale su Firebase).

## v105 (27/09/2026) — Registro a destra

- `#secLog` sta in fondo a `#side` per tutti (`applyRole`), ancorato in basso (`position:sticky`), con maniglia in cima (`logResizerInit`) che lo allarga verso l'alto: 120 px – 80% dello schermo, altezza salvata in `localStorage['aprutium.logH']` (per browser). `#railLog` è nascosto.

## v106 (27/09/2026) — premi dei PDI, Percezione passiva visibile, Vhaerun e l'ascia

- **Premi con un tasto** (blocco «PREMI DEI PDI» dopo `v3RenderMods`): un modulo può avere `pe` (PE totali del gruppo) e `bottino` (elenco `{n,q,cat,peso,valore,stats,desc,a,monete}`; `a` = PG o `crociata` proposto; `monete` = `{mo:120}`). Nella Guida/scheda del punto compare «Premi» con «Assegna PE…» (totale modificabile, spunta chi era presente, divisione in parti uguali) e «Assegna bottino…» (a chi va ogni oggetto). Stato nuovo (in `SHAPE_OBJ`, `merge`, `toRemote`): `S.pe[pg]` PE guadagnati al tavolo, sommati al primo numero di `SHEETS[pg].xp` (`sheetXp`); `S.monete[pg]`; `S.crociata[id]` armeria; `S.premi[poi__mod__pe|bot]` cosa è già stato dato, con «Annulla» (doppio clic). Gli oggetti vanno in `S.inv[pg]` e nello zaino li legge `invFromState`. Avviso nel Registro quando un PG raggiunge i PE del livello successivo.
- **Percezione passiva**: in Selezione (`#selPass`) e come quinto riquadro nell'intestazione della scheda. `spotScan` ora avvisa il master con un toast quando un PG nota un punto o ci passa vicino senza notarlo; la Guida ha il riquadro «Passati vicino senza notarlo» per tutti i punti (non solo i necessari). Il meccanismo era già corretto: il 27/09 Alessandros (passiva 10) è passato a 7,5 m dai Solchi (CD 12) col resto del gruppo a 28 m.
- **Sotto Bëllindë**: l'ascia di Vhaerun è una bipenne con due lune, la chiave del dispositivo centrale della Sala delle Ordinanze (sostituisce il «simbolo del rango»); nuovo modulo `rilievi/vhaerun` «Il ritorno di Vhaerun» (la voce del Custode lo riprende quando l'ascia tocca l'incavo; comandi FERMO/INDIETRO/COLPISCI; sotto 55 PF si ferma se lo chiamano per nome, Persuasione/Intimidire CD 15); l'ascia resta chiusa nel dispositivo fino alla purificazione del Sigillo (bottino di `sigillo/ricompense`); riposo breve nella Camera delle Memorie; `pe` su linea, catene, rilievi, vhaerun, micuccio, sigillo; bottino su linea (Crociata), sigillo, ultimo_custode.

## v107 (27/09/2026) — inventario come la mockup, niente «bozza»

- **Niente «bozza»**: tolti i campi `bozza` / `breveBozza` da tutti i contenuti e le etichette dalla pagina. Giuseppe non vuole la scritta: quello che sta nel sito è il testo buono. Non rimetterli.
- **Inventario** (`sheetInventoryHtml` + `sheetInvBind`, blocco «INVENTARIO (v107)»): quattro colonne come la mockup — Equipaggiamento (10 slot: Testa, Amuleto, Mantello, Anello 1-2, Armatura, Mani, Stivali, Mano primaria/secondaria; carico in kg), Inventario (ricerca, filtri Tutti/Armi/Armature/Consumabili/Magici/Missione/Altro, ordinamento con verso, rarità colorata, «E» sugli equipaggiati, menu ⋯), carta pergamena (danno grande dall'azione del PG, tiro per colpire, proprietà, peso, valore con moneta, fonte; Equipaggia/Togli, Usa, Aggiungi alla barra, Trasferisci, Lascia), colonna destra (Confronto equipaggiato, Dettagli e lore, Calcolo CA che somma sempre alla CA del token con «Altri bonus»). Pesi: i dati Roll20 sono in lb, a schermo 1 lb = 0,5 kg (come il manuale 2024 italiano).
- Rarità: i dati non ce l'hanno. Si usa `rar` se presente, altrimenti Comune / Magico / Missione (Oggetti e indizi). Non inventare rarità.
- Stato nuovo (in `SHAPE_OBJ`, `merge`, `toRemote`): `S.equip[pg][slot]` (chiave oggetto o `'-'`; senza scelta, gli slot si riempiono da soli: armatura che dà la CA del token, scudo, arma del primo attacco), `S.invOut[pg][chiave]` (pezzi della scheda ceduti/lasciati/consumati), `S.hotbar[pg].s1…s8`. Chiavi: `n:<nome>` per gli oggetti della scheda, `i:<id>` per quelli di `S.inv`.
- **Barra rapida**: 8 caselle in fondo all'inventario (trascina righe dello zaino o carte degli Attacchi, oppure + su una casella vuota); la stessa barra compare sul Tavolo sopra il dock (`#hotbarTable`, `renderTableHotbar`): il giocatore vede la sua, il master quella del PG selezionato. Le pozioni di guarigione tirano e applicano la cura (`INV_HEAL`) e scalano la quantità.

## v108 (27/09/2026) — adattamento allo schermo

- Blocco CSS «ADATTAMENTO ALLO SCHERMO (v108)» in fondo allo stile. Riferimento: 1920×1080 al 100% (Giuseppe). I giocatori con portatili o con lo zoom di Windows al 125-150% hanno 1280-1536 px utili: sotto 1700 e 1440 px le colonne del Tavolo si stringono (rail 200/190, Guida, colonna destra 300/270) e la mappa guadagna spazio; la pagina non scorre più (`#app>*{min-height:0}`, `#railWrap` scorre da solo).
- Registro: al massimo 48% della colonna destra (36% sotto gli 800 px di altezza), altezza iniziale 30% dello schermo.
- Scheda: sotto 1600 px di larghezza o 860 di altezza il corpo scorre invece di schiacciare i riquadri; statistiche su una seconda riga; inventario a due colonne; sotto 760 px di altezza scorre tutta la finestra della scheda. I caratteri del testo NON si rimpiccioliscono (regola di Giuseppe), tranne i nomi nella colonna dei personaggi sotto 1440 px.
- Prova: `res.js` (Playwright) a 1920×940, 1536×730, 1366×650, 1280×600, master e giocatore, Tavolo + Panoramica + Inventario.

## v109 (27/09/2026) — il dopo-Sigillo, la strada, Teramum

- PDI 16 `murata` (id invariato) ora è «La scala a chiocciola»: moduli `salire` (esce all'aperto), `prova` (la porta murata), `aprire_porta` (il passaggio sale fino alla chiesa di San Vincenzo, dietro la parete nord imbiancata). Tolto «→ S27» dal testo da leggere dell'Ultimo Custode.
- Nuove voci del Compendio, tutte `stato: "segreto"` (solo master finché Giuseppe non le svela): `be-dopo-il-quarto-sigillo` (risalita, ritorno in paese, notte, partenza), `st-da-bellinde-a-teramum` (città «strada»: tre incontri — guado del Tordinum, osteria de lu Passe, Cashtalladdë), `te-arrivo-a-teramum` (vista, le sei porte, Guardia, sigilli, accampamento), 4 rioni (`te-rione-san-giorgio`, `te-rione-san-leonardo`, `te-quartiere-dei-tigli`, `te-sestiere-del-fiume`) e i 6 luoghi del canone (`te-palazzo-ducale`, `te-basilica-aurea`, `te-arena-sprofondata`, `te-biblioteca-incompiuta`, `te-tempio-di-mortus`, `te-citta-sepolta`). Immagini da fare (nomi «Luogo — …» / «Rione — …»).
- Proposte e conflitti di canone stanno nei blocchi gm «Da decidere» di ogni voce (popolazione 25.000/55.000, Guardia, voti del Consiglio, forgia di annullamento Basilica/Cattedrale Ducale, padre di Maximus, PNG minori nuovi). Da ratificare con Giuseppe.
- Ancora da decidere: «Pieve» → «Abbazia di San Vincenzo» (con Don Fulgenzio abate).
- (v109, seconda parte) La strada divisa in tre voci figlie di `st-da-bellinde-a-teramum` (ora `livello: quartiere`): `st-1-guado-di-sant-atto`, `st-2-osteria-de-lu-passe`, `st-3-da-colleatterato` (Colleatterato sostituisce Cashtalladdë come terza sosta, decisione di Giuseppe).
- **Immagini Higgsfield** (gpt_image_2_5, qualità alta, 2k, 16:9, stile fotografico cinematografico come le immagini dei luoghi di Bëllindë): 16 illustrazioni per le nuove voci + la battlemap del guado. Scaricate subito (niente URL Higgsfield nel sito), ridotte a 1920 px JPG q85, nome md5 in `img/`, chiavi in `contenuti/_immagini.json`; gli originali PNG in `05_Immagini/Mappe Teramum/Higgsfield/`. La battlemap è ridotta a 1448×1086 (48×36 caselle, come Sotto Bëllindë).
- **Scena nuova `guado`** (`contenuti/scene/guado.json`, menu «La strada per Teramum → 1. Il guado di Sant’Atto»): battlemap, griglia, niente nebbia né muri, un PDI `guado_casale` con moduli gente / scontro (`pe: 3300`) / casale. Bestiario: `forgiato_ferale` (Ghoul) e `forgiato_veterano` (Guerriero Veterano).
- `build.py`: corretto un difetto in `scene()` — la variabile `d` (cartella delle scene) veniva sovrascritta dal ciclo sui «Da qui» e la seconda scena non si trovava più.

## v110 (27/09/2026) — tutte le scene dopo la porta murata

- Regola di Giuseppe: **tutto ciò che viene dopo la porta murata si crea da zero** sul canone del mondo e su ciò che è successo al tavolo; le vecchie schede S19/S27/S28 del «dopo» non valgono.
- **Scene nuove** (`contenuti/scene/`, tutte v3 con più PDI, moduli, dialoghi profondi, prove, PE, bottino, immagini di punto e di dettaglio):
  Bëllindë → `bellinde_dopo` (mappa del borgo; risalita, Camposanto, Micuccio a casa, Rocca, San Vincenzo, Campo, Porta di Levante);
  La strada per Teramum → `guado` (8 PDI), `osteria`, `colleatterato`;
  Teramum → `teramum_porta` (arrivo, Porta de lu Solë), `teramum` (mappa della città, 19 PDI: rioni, porte, ingressi alle scene), `te_palazzo`, `te_basilica`, `te_biblioteca`, `te_arena`, `te_mortus`, `te_sepolta`.
  Scritte da 5 agenti con un brief comune (`BRIEF.md` nello scratchpad della sessione): regole in cima a questo file + `CANONE-PDI.md`.
- **Personaggi nuovi**: `contenuti/png/<id>.json` (forma del tavolo: `cat:"png"`, `title`, `sub`, `img`, `state`, `gm` lungo con Sa / Non sa / Voce / Cosa vuole / Se gli chiedono di… / Battute). `COMPENDIO_BASE` ora toglie dal vecchio Compendio solo luoghi e mondo per intero, le altre categorie voce per voce (`_CONT_IDS`): un PNG nuovo non cancella i 134 vecchi.
- **Bestiario aggiuntivo**: `contenuti/_bestiario/<id>.json` (forma del `BESTIARIO`), scritto da `build.py` (`bestiario()`) nel blocco `/*@BESTIARIO*/const BESTIARIO_EXTRA=…/*@/BESTIARIO*/` e aggiunto a `BESTIARIO`. Statistiche 2024 scritte a memoria dagli agenti: da verificare.
- `build.py`: le cartelle che iniziano con `_` non sono categorie del Compendio; nelle scene i nomi leggibili delle immagini (`mappa.img`, `punti[].image`, `moduli[].immagine`) si traducono con `_immagini.json` e quelli non ancora generati sono elencati («IMMAGINI DELLE SCENE NON ANCORA GENERATE»).
- **Immagini**: ~155 generate con Higgsfield (gpt_image_2_5, alta qualità, 2k) dai manifest degli agenti, con uno stile comune per tipo (illustrazione 16:9, battlemap 4:3 ridotta a 1448×1086, ritratto 4:5 a 900 px), scaricate in `img/` (md5) e registrate in `_immagini.json`; originali in `05_Immagini/Scene e illustrazioni/Higgsfield - dopo il Sigillo/`. Script: `queue.py` (prep / batch / jobs / get) nello scratchpad.
- Conflitti di canone lasciati aperti e segnalati nei «Da decidere»: padre di Maximus (CC-02: alcuni file seguono gli Atti → Lucius Grazianus), forgia di annullamento (Basilica / Cattedrale Ducale), morte di Rocco, gola della Vezzola / Tordinum, numero di sigilli, nomi di Savinellus e de Spina.

## v111 (27/09/2026) — schede dei PG complete dalla scheda Roll20

- Fonte di verità: i PDF Roll20 in `7_Aprutium/02_Personaggi e schede/Schede PG (PDF)/` (testo estratto con pypdf). Un file per PG in `contenuti/pg/<id>.json` (specie, classe, CA, PF, iniziativa, caratteristiche, TS e abilità con competenza/maestria, competenze, sensi, resistenze, risorse, privilegi / tratti di specie / talenti con descrizione completa, attacchi, incantesimi + `incantesimi_nuovi`, inventario completo, carico, monete, aspetto, personalità, storia della scheda, progressione, note, `differenze`). Scritti da 6 agenti con `PG_BRIEF.md` (scratchpad).
- `build.py` → `pg()`: blocco `/*@PG*/const PG_DATA=…/*@/PG*/` dopo `PLAYER_V85` (senza `differenze`). Due applicazioni: subito dopo `PLAYER_V85` (PF, CA, iniziativa, abilità, TS; attacchi aggiornati per nome normalizzato `pgNorm`, quelli mancanti aggiunti) e dopo `INVENTORIES` (`pgApplySheets`: `SHEETS[id].pg`, caratteristiche, competenza, PE, passiva, lingue, monete, incantesimi e slot, `SPELLS` nuovi, inventario completo). La cartella `pg` non è una categoria del Compendio.
- Scheda: Capacità e Talenti con privilegi/talenti/tratti a tendina con descrizione, **Risorse** con pallini da spendere (`t.res[i]`, campo `res` in `LIVE`; il riposo breve azzera quelle con «breve» nel recupero, il lungo tutte), Competenze; Panoramica con ● competenza / ◆ maestria su abilità e TS; Background con specie, aspetto, personalità, storia della scheda, progressione, note.
- Correzioni: cure di Mattheus (Discepolo della vita = 2 + livello dello slot, niente per i trucchetti; prima +7 fisso); Zenith CA 17 e Legame primevo (+3 a TS e prove; `prova-tavolo.js` aggiornata a CA 17); attacchi di Vicarus +9 (non +11).
- Da decidere con Giuseppe (scritto nelle `differenze` dei file): CA di Alessandros 22 (per le regole 18-20), CA di Vicarus 11 (con Resilienza draconica 15), forme selvatiche di Adamus (scheda: Orso, Cavallo, Lupo, Cervo; sito: Toro), incantesimi preparati di Adamus, PE di Luigis 465/14.000, fede di Mattheus «Morthus» nella scheda, Intimidire di Maximus, descrizioni di alcuni incantesimi in `SPELLS` non aggiornate al 2024 (Immagine speculare, Alterare se stesso, Tocco folgorante, Salto, Trova cavalcatura).

## v112 (27/09/2026) — incantesimi completi e regole automatiche

- **Incantesimi**: testo di regolamento completo 2024 per tutti i 95 incantesimi dei PG in `contenuti/_incantesimi/{druido,chierico_paladino,stregone_ranger}.json` (chiave = nome inglese di `SPELLS`; campi it, l, scuola, t, r, componenti, durata, conc, rituale, d, superiore, atk, dmg, heal). `build.py` → `incantesimi()` scrive `SPELLS_EXTRA`, fuso in `SPELLS` subito dopo la sua definizione. Nella scheda ogni incantesimo si apre con livello/scuola, tempo, gittata, componenti, durata, testo e «Livelli superiori» (`spellFullHtml`). Scritti a memoria dagli agenti: da ricontrollare dove segnalato (Aura di vitalità, Potenziare caratteristica, Evoca bestia, Trova destriero). `castSpell` riconosce Benedizione dalla chiave `Bless`; `SPELL_DMG_MOD` (Arma spirituale, Lama infuocata) aggiunge il modificatore da incantatore al danno.
- **Regole automatiche** (blocco «REGOLE AUTOMATICHE (v112)» dopo le schede Roll20): `PG_AUTO` per PG (numeri corretti delle armi in `fix`, effetti da accendere `toggles`, `passivi`), `FX_GENERALI` (Guida). Stato del token: `t.fx` (effetti accesi), `t.adv` ('v'/'s', si consuma al prossimo d20), `t.fxT` (una volta per turno) — in `LIVE`. `fxD20` (vantaggio/svantaggio: manuale, Stregoneria innata sugli attacchi con incantesimo, Runa della pietra su Intuizione, Possanza del gigante su Atletica e TS For), `fxAtkBonus` (Arma sacra +Car), `fxDamage` + `fxRoll` (Attaccante selvaggio una volta per turno, armi possenti 1-2→3 sulle armi a due mani, Adepto elementale 1→2 sui danni da fuoco, Favore divino +1d4, Marchio del cacciatore +1d6, Possanza +1d6 una volta per turno), `fxReduce` (Maestro delle armature pesanti −3 dalle armi), `fxGuidance`. Collegati a `resolveAttack`, `plainRoll`, `rollFor`, `doRoll`, `castSpell`, `resolveSpellSave` (CD +1 con Stregoneria innata). `fxIsSpell` riconosce gli incantesimi anche quando l'azione è «a distanza». Pannello «Effetti e tiri» nella Panoramica e negli Attacchi. Prova dedicata: `fx-test.js` nello scratchpad (15 controlli).
- Numeri corretti: Alessandros spada lunga +6 / 1d8+5 a una mano (Duellare) e colpo senz'armi +6 (la scheda Roll20 aveva Arma sacra inclusa); Maximus Randello pesante +1 e Spadone +1 +8 con danni.
- Verificato: prove e TS di tutti e sei tornano con caratteristica + competenza (Mattheus Arcano e Religione +Sag per Taumaturgo).

## v113 (27/09/2026) — lancio degli incantesimi, vantaggio su ogni tiro, oggetti magici

- **Lancio** (blocco «LANCIO DEGLI INCANTESIMI (v113)»): `castSpell(id,name,opt)` apre una finestra (slot di livello uguale o superiore oppure «senza slot», bersagli, vantaggio/svantaggio per gli attacchi); `resolveCast` applica tutto: attacco contro la CA con danni, TS di ogni bersaglio (`spellSaveOf`: `SPELL_SAVES` o, se manca, la caratteristica e il «metà» letti dal testo; mostri con `monsterSaveMod`, PG coi loro TS) con danno pieno/metà e condizioni, cure su più bersagli (Discepolo della vita solo con slot), effetti senza tiro nel Registro. Il vecchio lancio immediato resta come `castSpellImmediato`. Benedizione continua col suo selettore.
- **Trucchetti**: `cantripExpr` riporta i dadi (scritti al 5° livello) a quelli del livello del PG (1/2/3/4 dadi a 1/5/11/17), anche per le azioni-trucchetto in `fxDamage`. **Livelli superiori**: `upcastExtra` legge «+NdM per ogni livello (o ogni due livelli) di slot superiore» dal campo `superiore`. Rintocco dei morti usa d12 sul bersaglio ferito.
- **Vantaggio su ogni tiro**: finestra `askAdvThen` prima delle prove dalla scheda, del tiro libero e della prova richiesta (btnRoll/btnFree); tre tasti nel popup della richiesta del master; scelta Normale/Vantaggio/Svantaggio nel selettore dei bersagli degli attacchi e nel lancio. Tutto passa da `t.adv` → `fxD20`.
- **Oggetti magici**: sezione «Dagli oggetti magici» nell'Incantesimi della scheda (`itemSpellsHtml`/`itemSpellsBind`): cariche da `N cariche` nelle statistiche (spese in `t.ich[chiave]`, in `LIVE`), incantesimi riconosciuti in `SPELLS` e lanciati senza slot. La scheda Incantesimi compare anche a chi ha solo oggetti con incantesimi. Equipaggiamento: armi magiche in mano per prime; elmi/cappelli in testa; armature magiche nell'armatura.
- Dati: Alessandros ha l'**Armatura dei Cerullius** (armatura completa CA 18, riforgiata da Torvus, consegnata da Oswald — Compendio `ogg-armatura-cerullius`) al posto della cotta di maglia, e la **Scimitarra +1** di Mushanè (+7, 1d6+6 con Duellare); Adamus l'**Elmo del toro** (proprietà da stabilire: non è nel canone); nel Compendio `contenuti/oggetti/ogg-cappello-del-camuffamento.json` (da assegnare col tasto Assegna, che ora porta nello zaino anche incantesimi e descrizione) e l'incantesimo Camuffare se stesso (`_incantesimi/oggetti.json`). Nel canone «Mattia» è il giocatore di Matthios di Sirmio, non Mattheus.
- CA di Alessandros: con armatura completa + scudo le regole danno 20; il token resta 22 finché Giuseppe non decide (il calcolo CA mostra «Altri bonus +2»).

## v114 (27/09/2026) — Stregoneria, catalogo delle azioni, barra rapida, competenze

- **Fonte della magia** (blocco «STREGONERIA (v114)»): nell'Incantesimi della scheda, slot → punti (= livello) e punti → slot (1° 2, 2° 3, 3° 5, 4° 6, 5° 7); slot creati in `t.xs[l]` (in `LIVE`, spariscono col riposo lungo; il lancio li considera e li spende dopo quelli normali). **Metamagia**: `META_DEFS` (10 opzioni 2024) filtrate da `metaKnown(id)` sui privilegi «Metamagia: …» della scheda; checkbox nella finestra di lancio, costo in punti (Duplicato = livello), `resolveCast(…,meta,mcost)`; Intensificato = svantaggio al TS del primo bersaglio.
- **Catalogo delle azioni** (`actionCatalog`): azioni del token (tranne gli incantesimi che il PG conosce, che passano dalla finestra di lancio), incantesimi (tempo di lancio → Azione/Azione bonus/Reazione), incantesimi degli oggetti (`useItemSpell`), risorse della scheda (`useResource`: Recupero energie cura 1d10+livello, Forma selvatica, Possanza del gigante, Stregoneria innata attivano i loro effetti; le altre vanno nel Registro), azioni per tutti. `renderActions` (il vecchio è `renderActionsOld`) le mostra a destra per tipo e per gruppo (Attacchi, Capacità, Incantesimi, Oggetti, Per tutti, apribili). **Barra rapida** `#quickbar` sopra il dock (`renderQuickBar`, al posto di `#hotbarTable`): primo livello Rapide (la barra dei preferiti) / Azione / Azione bonus / Reazione / Senza azione / Incantesimi / Oggetti / Per tutti, secondo livello le voci.
- **Elmo del toro** (Adamus): «Forza del toro — 1 carica», 1 volta per riposo lungo: effetto `forzaToro` (vantaggio a Atletica, prove e TS di Forza), anche come interruttore negli Effetti. Cariche degli oggetti: anche «1 carica» al singolare; il riposo lungo azzera cariche spese, slot creati ed effetti.
- **Competenze**: `competenze_fonti` in ogni `contenuti/pg/<id>.json` (classe, sottoclasse, specie, background, talenti, maestrie, lingue, `verifica`), mostrate in Capacità e Talenti («Da dove vengono le competenze»); le incongruenze in «Da verificare (solo master)». Principali: Sottocomune (lingua rara) per tutti senza fonte; Maximus senza Intimidire del Soldato, 8 abilità su 7, flauti senza fonte, niente Arnesi da fabbro; Luigis 7 abilità su 6; Vicarus 7 su 8 (manca una scelta di Abile); Mattheus Robusto come terzo talento di origine; Adamus Kit da erborista doppio; «Esperto» dovrebbe essere «Abile (Skilled)».

## v115 (27/09/2026) — CA corrette, risorse che attivano gli effetti, prova dei meccanismi

- CA decise da Giuseppe dopo l'audit dei level up (`02_Personaggi e schede/Audit level up PG (27-09-2026).md`): Alessandros 20 (Armatura dei Cerullius 18 + scudo), Vicarus 15 (Resilienza draconica 10 + Des + Car; passivo `draconica` in `PG_AUTO`, mostrato nel Calcolo CA).
- I pallini delle **Risorse** nella scheda ora applicano l'effetto della risorsa quando la si spende (`useResource(id,i,true)`): Stregoneria innata accende il vantaggio agli attacchi con incantesimo e la CD +1, Recupero energie cura, Possanza/Forma selvatica si attivano. Prima contavano solo l'uso (segnalazione di Vicarus). La finestra di lancio dice quando Stregoneria innata è attiva.
- Tasti Riposo breve / Riposo lungo anche in Capacità e Talenti (Maximus non li aveva: stavano solo in Incantesimi).
- Prova dei meccanismi `mech-test.js` (scratchpad): per ogni PG, da giocatore, apre tutte le sezioni, usa ogni voce del catalogo delle azioni rispondendo alle finestre, controlla Stregoneria innata dal pallino, Forza del toro, riposo lungo. Esito: nessun errore; «Benedizione» risulta senza effetto solo perché la prova non gestisce il suo selettore (coperto da `prova-tavolo.js`).

## v116 (27/09/2026) — Metamagia tra le azioni

- Catalogo delle azioni: per chi ha punti stregoneria, una voce per ogni Metamagia conosciuta (Incantesimo rapido in **Azione bonus**, le altre in Azione) che apre `openMetaPicker` (solo gli incantesimi adatti: rapido → tempo di lancio Azione; intensificato → con TS; cercante → con attacco; e con uno slot libero) e poi la finestra di lancio con la metamagia già spuntata (`castSpell(id,en,{meta:[k]})`); il Registro scrive «lanciato con un’azione bonus». Più «Fonte della magia: crea uno slot» (Azione bonus) e «…: slot in punti» (Senza azione), che aprono l'Incantesimi della scheda.

## v117 (27/09/2026) — immagini degli oggetti e icone delle abilità

- **Dati**: `contenuti/_icone.json` → blocco `/*@ICONE*/const ICONE_DATA=…/*@/ICONE*/` (scritto da `build.py` → `icone()`). `oggetti[nome inventario]` e `abilita["gruppo|nome"]` = `[piccola, grande]` (`img/<md5>`). Gruppi: quelli di `actionCatalog` (Attacchi, Capacità, Incantesimi, Oggetti, Per tutti) e delle schede (Talento, Privilegio, Tratto, Risorsa). Gli attacchi con un'arma usano l'immagine dell'oggetto.
- **Immagini**: 84 oggetti (PNG trasparenti, piccola 160 px, grande 512 px) e 168 icone stile «abilità di League of Legends» (JPG, 128 e 512 px), generate con Higgsfield (gpt_image_2_5). Originali e fogli di controllo in `05_Immagini/Immagini Compendio - Oggetti/` e `05_Immagini/Icone abilita/` (con `_oggetti-inventario.json` e `_icone-abilita.json`).
- **Codice** (blocco «IMMAGINI DI OGGETTI E ABILITÀ (v117)» dopo SPELLS_EXTRA): `icoItem`, `icoAbil(nome,gruppo)`, `icoAct`, `icoSpell`, `icoImg`, `icoText` (testo del riquadro: incantesimo, privilegio/talento, risorsa, azione per tutti), `tipAttrs`. Riquadro `#abtip` al passaggio del mouse su ogni elemento con `data-tip-t` (immagine grande, nome, riga breve, descrizione tagliata a 420 caratteri).
- Dove si vedono: righe dell'inventario, slot dell'equipaggiamento, carta dell'oggetto (grande, a destra del titolo), barra rapida della scheda e del Tavolo (`hbInfo`), barra rapida a due livelli, pannello Azioni, carte degli attacchi e delle capacità, incantesimi, privilegi, talenti e tratti della scheda. Dove manca un'immagine resta l'icona SVG di prima.
- Nome nuovo (incantesimo, talento, oggetto) = nessuna immagine finché non si genera e si aggiunge a `_icone.json`.

## v118 (27/09/2026) — barra rapida a quadratini, pozioni e consumabili, torcia

- **Barra rapida** (`renderQuickBar`, blocco «BARRA RAPIDA (v118)»): sopra le categorie, sotto le azioni in quadratini (icona + nome, riquadro al passaggio del mouse). «★ Rapide» aperta di default (le 8 caselle di `S.hotbar`); Azione · Azione bonus · Reazione · **Gratuite** (prima «Senza azione») · Incantesimi · Oggetti · **Comuni** (prima «Per tutti»: Scatto, Schivata… valgono per tutti). La stellina ☆ su un quadratino lo mette nelle Rapide come `{k:'cat',ref:'gruppo|nome'}` (`hbCat`, `hbUse`, `hbInfo`); la × lo toglie; ▾ nasconde i quadratini. Etichette singolari nelle carte (`ACT_ECO`: «Gratuita»).
- **Oggetti nella barra**: `actionCatalog` aggiunge pozioni, consumabili, triboli e fonti di luce (`invUsable`, gruppo Oggetti; pozioni e luce = azione bonus). `invRun`: se l'oggetto si lancia (olio, acqua santa, triboli → `invThrowAct`) apre l'attacco, altrimenti `invUse` (le pozioni curano e scalano). Prima le pozioni si potevano usare solo se erano già nelle Rapide.
- **Consumo**: olio, acqua santa e triboli lanciati con la loro azione tolgono un pezzo dallo zaino dopo il tiro (`actItem`, `actSpend` in `openTargetPicker`); se non ne restano, `doAction` avvisa e non tira.
- **Luce**: `LIGHTS` (torcia 6+6 m, consuma una torcia; lampada e lanterna 4,5+9 m). `lightToggle` → `t.light={key,n,b,d}` (in `LIVE`), va in mano secondaria se non c'è lo scudo, alone `.tlight` sul token, nebbia svelata a `sightPx(t)` = max(9 m, luce) quando accende e a ogni movimento (anche «Rivela intorno al gruppo»). Si accende/spegne dalla barra (Oggetti) o dalla carta dell'oggetto (Accendi/Spegni); togliere l'oggetto dalla mano la spegne. La durata di 1 ora non è contata: si spegne a mano.

## v120 (27/09/2026) — simboli dei tasti

- **Audit**: 228 tasti nel sorgente, 211 erano solo testo o glifi di carattere (◯ ◺ ╱ ✕ ⋯ ⇅ ▦ ☰ ‹ ✎ ★ ◷ ◉ ◎ 🔒 🗺 ⤢ 👥 🎲), che cambiano aspetto da un computer all'altro. Avevano già un'icona solo la barra in alto, il dock, gli strumenti della mappa (nebbia, muri, porte) e le tre icone del Registro.
- **Simboli** (blocco «SIMBOLI DEI TASTI (v120)» in fondo allo script, CSS omonimo in fondo allo stile): `UI_ICO`, 106 disegni a filo (24×24, tratto 1.8, colore della scritta), stessa mano delle icone di Tavolo / Scheda / Compendio. Dentro: comandi (ok, x, più, meno, indietro, ordina, griglia, elenco), mappa (aree cerchio/cono/linea, metti/togli/vai sulla mappa, nebbia ×4), scontro (spade, prossimo, bandiera, fulmine dell'iniziativa), tiri (d4…d100, vantaggio, svantaggio, tutto/metà/niente), scheda (zaino, pergamena, libro, talento), oggetti (equipaggia, togli, torcia, pozione, dai), riposi, premi (PE, bottino), economia delle azioni (● azione, ▲ bonus, ↩ reazione, ◆ gratuita) e le 16 condizioni (`c_prono` … `c_scatto`).
- **Come si applicano**: i template dei tasti NON si toccano. `uiIcoAll()` decora ogni `<button>` senza `svg`/`img` dopo ogni disegno della pagina (MutationObserver + `requestAnimationFrame`). Scelta: `UI_ICO_ID` (per id) → `uiIcoKey` (per attributo `data-*`) → `UI_ICO_TXT` (per scritta, così i tasti che cambiano scritta cambiano simbolo: Svela/Nascondi, segreti/visibili, Vai/Posiziona). Le scritte restano tutte e i caratteri non cambiano misura; spariscono solo i glifi. I tasti che erano un glifo solo diventano simbolo solo (`.uico-only`, con `aria-label`). `uiIcoGlyph` fa lo stesso per la stellina dei preferiti e la × delle Rapide, che non sono `<button>`.
- **Senza simbolo, apposta**: i tasti che portano un nome o un contenuto — titoli dei moduli dei PDI (`data-v3mod`), abilità e TS della scheda (`data-roll`), effetti (`data-fx`), città e categorie del Compendio (`data-liv`, `data-sec` ha già `C3_ICON`), schede Panoramica/Collegamenti/Note del dettaglio (`.c3tabs`: non c'è spazio), quadratini della barra rapida (hanno l'immagine dell'azione).
- **Tasto nuovo**: aggiungere l'id a `UI_ICO_ID` o una riga a `UI_ICO_TXT`. Simbolo nuovo: una voce in `UI_ICO` (solo il contenuto dell'`<svg>`). Il `svg.uico` ha `pointer-events:none`: `ev.target` resta il tasto.
- **Schede Azione / Azione bonus / Reazione / Gratuite** (`.acttabs`, colonna del giocatore): uscivano dalla colonna già in v118 («Gratuite» tagliata). Ora due righe da due.
- I disegni stanno anche in `7_Aprutium/05_Immagini/Icone dei tasti/` (un `.svg` per simbolo + il foglio `_simboli.png`).
- `prova-tavolo.js` al momento della consegna: giocatore a posto; master 1 ROTTO «TS incantesimi → non copre tutti gli incantatori», che NON dipende dai simboli: la prova cerca Fiamma sacra (`Sacred Flame`) tra gli incantesimi di Mattheus e `contenuti/pg/mattheus.json` l'ha tolta il 27/09 (background da Accolito a Saggio). Va aggiornata la prova (riga 162) con un altro incantesimo con TS di Mattheus.

## v120 (27/09/2026) — adattamento allo schermo 2 (barra rapida)

- Blocco CSS «ADATTAMENTO ALLO SCHERMO 2 (v119)» dopo la luce del token. La barra rapida della v118 andava a capo: a 1366×650 copriva il 73% dell'altezza della mappa, a 1280×600 l'80%. Ora categorie e quadratini stanno su una riga ciascuno e scorrono di lato; la barra è larga quanto serve (left/right:12px; width:fit-content, non più 	ranslateX(-50%)). Aperta occupa ~138 px sotto i 1000 px di altezza (dock su una riga, quadratini 68×84, niente riga di aiuto), ~187 px sopra.
- qbOpen si ricorda per browser (localStorage['aprutium.qbOpen'], qbSetOpen); la prima volta parte chiusa sotto gli 800 px di altezza.
- Dock solo simboli quando la mappa è stretta (1201-1400, 901-1170, ≤680 px di larghezza); white-space:nowrap sui nomi.
- ≤1200 px: Guida e colonna destra una sopra l'altra nella terza colonna (mappa 534 px a 1024). ≤900 px (tablet verticale, telefoni): tutto in colonna, mappa al 72% dello schermo, la pagina scorre; intestazione su due righe (logo + Vista, poi Tavolo/Scheda/Compendio), #modal parte a 120 px; Compendio a una colonna.
- Corretto: sotto i 1100 px il dettaglio del Compendio (.c3det) copriva sempre l'elenco anche senza scheda aperta (la classe hidden non veniva mai messa): ora c3RenderDetail la mette.
- Misure (scratchpad 
es.js, modali.js): 10 risoluzioni da 2560×1300 a 390×800, master e giocatore; nessuno scorrimento orizzontale.
## v121 (27/09/2026) — incantesimi di druido e chierico, Mattheus Saggio, Maximus

- **Regola del tavolo** (Giuseppe, 27/09): niente preparazione degli incantesimi. Chi nel 2024 prepara dalla lista intera (Druido, Chierico) conosce tutta la lista della classe per i livelli di slot che ha e lancia spendendo uno slot. Stregone (Vicarus), Ranger (Luigis) e Paladino (Alessandros) restano con la loro lista fissa. Luigis ha 7 incantesimi da ranger su 6 (Marchio del cacciatore escluso): deve dire quale togliere.
- **Adamus** (`contenuti/pg/adamus.json`): +14 incantesimi di 3° livello (lista del druido del PHB 2024: Invocare il fulmine, Luce diurna, Dissolvi magie, Arma elementale, Morte apparente, Fondersi nella pietra, Protezione dall'energia, Revivificare, Tempesta di nevischio, Parlare con i vegetali, Evoca folletto, Respirare sott'acqua, Camminare sull'acqua, Muro di vento). **Mattheus**: +37 della lista del chierico (1°-3°). Liste controllate sull'elenco del `07_Manuali D&D ufficiali/Manuale del Giocatore.docx` (che NON contiene le descrizioni degli incantesimi, solo gli elenchi).
- **Testi**: `contenuti/_incantesimi/nuovi_adamus_mattheus.json` (29 voci) tradotti dall'SRD 5.2.1; Arma elementale, Morte apparente ed Evoca folletto non sono nell'SRD: a memoria del PHB 2024, da ricontrollare sul cartaceo.
- **Icone**: 29 nuove (Higgsfield gpt_image_2_5, stesso prompt «League of Legends» della v117) in `_icone.json` e in `05_Immagini/Icone abilita/` (foglio `_FOGLIO - incantesimi Adamus e Mattheus.png`).
- **Mattheus da Accolito a Saggio** (richiesta del giocatore): Iniziato alla magia (Mago) con Dardo di fuoco, Mano magica e Scudo (Saggezza); lascia Religione (+3 col Taumaturgo), prende Arcano (+6); toglie Fiamma sacra (anche dalle azioni di `DEFAULT_STATE` e `PLAYER_V85`). `prova-tavolo.js` riga 162: Fiamma sacra → Rintocco dei morti.
- **Maximus**: tolta la «Progressione futura» (era della 2014). Il suo piano aggiornato sta nel suo Diario sul sito (`S.diari.maximus`); la versione corretta per le regole 2024 è nelle `differenze` di `maximus.json` (Veloce dà Des o Cos, Sentinella For o Des, «Specializzazione armi» non esiste: la copre Maestria nelle armi). Da usare al level up.
- Nella v121 sono inclusi anche i lavori delle sessioni parallele: v120 (simboli dei tasti) e «Adattamento allo schermo 2».

## v122 (27/09/2026) — incantesimi a più colpi: Raggio rovente e Dardo incantato

- **Difetto** (segnalato da Giuseppe): Raggio rovente tirava UN solo d20 contro un solo bersaglio, a qualunque slot. Dardo incantato tirava 3d4+3 in blocco e a slot superiore non aggiungeva dardi (`upcastExtra` cerca «+NdM per ogni livello», qui il testo dice «un dardo in più»).
- **Regola 2024**: Raggio rovente = 3 raggi, +1 per ogni livello di slot sopra il 2° (slot di 3° → 4 raggi); ogni raggio ha il suo tiro per colpire e i suoi 2d6 da fuoco, sullo stesso bersaglio o su bersagli diversi. Dardo incantato = 3 dardi, +1 per livello sopra il 1°; 1d4+1 da forza ciascuno, colpiscono sempre.
- **Codice**: blocco «INCANTESIMI A PIÙ COLPI (v122)» (in fondo allo script, prima dei simboli dei tasti). `SPELL_MULTI` (una riga per incantesimo: `n` colpi di base, `dmg` per colpo, `atk` sì/no, nomi), `multiCount(nome,slot)`, `castSpellMulti` (finestra: slot con il numero di colpi, vantaggio/svantaggio, metamagia, − / + accanto a ogni bersaglio, non lancia finché i colpi non sono tutti assegnati), `resolveCastMulti` (un evento `atk` nel Registro per ogni raggio, coi suoi dadi 3D; critico, Adepto elementale, Marchio del cacciatore, Benedizione e Stregoneria innata valgono raggio per raggio; il vantaggio scelto nella finestra vale per tutti i raggi del lancio). `castSpell` e `doAction` sono ridefiniti lì e per tutti gli altri incantesimi chiamano quelli di prima (`castSpellUno`, `doActionUno`): «Attacca» su «Raggio rovente (3 raggi)» nella scheda apre la stessa finestra.
- Incantesimo nuovo dello stesso tipo (es. Deflagrazione occulta): una riga in `SPELL_MULTI`.
- Prova dedicata `multi-test.js` (scratchpad): 21 controlli. `prova-tavolo.js` verde nei due ruoli.
- **Da sistemare, non fatto**: nella scheda Attacchi Esplosione stregonesca, Sfera cromatica e Raggio rovente compaiono come «Attacco in mischia» (sono a distanza): è solo l'etichetta, il tiro è giusto.

## v123 (27/09/2026) — Legame di interdizione

- **Verifica chiesta da Giuseppe** (Alessandros lo ha lanciato su Maximus): nel tavolo il Legame era solo testo. Lanciarlo scriveva una riga nel Registro e non applicava niente.
- **Regola 2024** (Warding Bond, 2° livello, contatto, 1 ora, senza concentrazione, due anelli di platino da 50 mo): chi lo riceve ha CA +1, +1 ai tiri salvezza e resistenza a tutti i danni; ogni volta che subisce danni, chi lo ha lanciato subisce la stessa quantità. Finisce se chi lo ha lanciato va a 0 PF, se i due sono a più di 18 m, se viene lanciato di nuovo su uno dei due.
- **Codice**: blocco «LEGAME DI INTERDIZIONE (v123)» in fondo allo script. Condizione nuova `legame` in `CONDS` (sigla LEG), con `source` = id di chi l'ha lanciato: sta in `t.conds`, quindi è già sincronizzata. `bondOf/bondOn`, `tokAc(t,base)` (CA con il +1), `bondEnd`, `bondEndAll`, `bondRest`, `bondCheck` (0 PF e distanza), `castBond` (finestra di lancio: solo alleati, a contatto per i giocatori, il master può scegliere chiunque; «Senza slot» rimette un Legame già lanciato al tavolo). Ridefiniti lì, con il vecchio chiamato dentro: `applyDamage` (metà dei danni a chi è protetto, arrotondata per difetto, la stessa quantità a chi ha lanciato, riga di spiegazione nel Registro), `fxGuidance` e `tokenSaveMod` (+1 ai TS), `castSpell`.
- **Agganci nel codice esistente** (11, script `legame-edits.js` nello scratchpad): `tokAc` al posto di `tg.ac` / `t.ac` in `resolveAttack`, `resolveCast`, `resolveCastMulti`, Selezione, intestazione e Attacchi della scheda, Calcolo CA (riga «Legame di interdizione +1»), elenchi dei bersagli; `bondRest(id)` nei due tasti Riposo; `bondCheck()` in `render()` accanto a `spotScan()` (solo tavolo del master, non durante un trascinamento).
- La resistenza vale anche per i danni tolti a mano dal master (−10, −5, −1, Togli): il Registro scrive quanti ne ha subiti davvero.
- **Non fatto**: +1 al tiro salvezza contro la morte; controllo degli anelli di platino; durata di 1 ora (finisce con un riposo o a mano).
- Prova dedicata `legame-test.js` (scratchpad): 34 controlli. `multi-test.js` 21. `prova-tavolo.js` verde nei due ruoli.

## v124 (27/09/2026) — condizioni sui token più piccole

- Richiesta di Giuseppe: i segnali delle condizioni sotto i token erano enormi (carattere 15 contro gli 8 del nome: ogni sigla era più grande del token, e si impilavano in colonna).
- Blocco CSS «CONDIZIONI SUI TOKEN (v124)» in fondo allo stile: `.tok .condrow .cond` a 7 px, in riga sotto il nome (a capo oltre 66 px); con il mouse sopra o col token selezionato salgono a 9 px, come fa il nome. Colonna dei personaggi, Selezione e scheda non cambiano.
- È una riduzione chiesta da lui: la regola «caratteri grandi, prima di ridurre chiedere» resta valida per tutto il resto.

## v125 (27/09/2026) — Arma sacra, bonus di Alessandros, riposo breve

- **Verifica chiesta da Giuseppe.** I numeri di Alessandros erano giusti: Spada lunga +6 / 1d8+5 a una mano (Duellare) e 1d10+3 a due mani, Scimitarra +1 +7 / 1d6+6, Colpo senz'armi +6 / 4, Giavellotto +6 / 1d6+3, incantesimi +5 e CD 13, Attaccante selvaggio una volta per turno, Attacco extra = due tiri. Con Arma sacra accesa il +2 (Carisma) c'era.
- **Cosa non andava nell'Arma sacra**: si accendeva SOLO dall'interruttore in «Effetti e tiri». Il tasto «Arma sacra» tra le azioni e il pallino di Incanalare divinità scrivevano una riga nel Registro e basta. Accesa, valeva su tutte le armi insieme (giavellotto lanciato compreso), non spendeva l'uso di Incanalare divinità e l'arma non faceva luce.
- **Regola 2024**: quando fai l'azione Attacco spendi 1 uso di Incanalare divinità e scegli UN'arma da mischia che impugni; per 10 minuti aggiungi il Carisma (minimo +1) ai tiri per colpire con quell'arma, a ogni colpo puoi fare danni radiosi, l'arma fa luce intensa 6 m + fioca 6 m. Non costa un'azione.
- **Codice**: blocco «ARMA SACRA (v125)». `sacraOpen(id,opt)` è l'unica finestra (arma, usi rimasti, «già attivata al tavolo: non spendere l'uso»); ci arrivano `doAction` (azione «Arma sacra…», ora tra le Gratuite: `actEco`), `useResource` su Incanalare divinità (`sacraChannel`: Arma sacra / Percezione del divino / Annulla che restituisce l'uso) e l'interruttore `data-fx="armaSacra"` (`fxBind`). `t.fx.armaSacra` = nome dell'arma; `sacraApplies(t,a)` decide se l'attacco prende il bonus (solo mischia, solo quell'arma; `true` dei vecchi salvataggi = tutte le armi da mischia). Luce: `t.light={key:'armaSacra',b:6,d:6}` se non c'è già un'altra luce accesa. `sacraEnd` la spegne (interruttore, riposo).
- **`SPELL_FX`**: lanciare Favore divino o Marchio del cacciatore accende da solo l'effetto (`resolveCast`); prima si lanciava l'incantesimo e poi si doveva accendere a mano l'interruttore. Favore divino nel 2024 non richiede concentrazione (testo dell'interruttore corretto).
- **Riposo breve** (`restShortOne`): le risorse «1 uso a/con riposo breve, tutti a riposo lungo» (Incanalare divinità, e le altre tre con lo stesso testo) recuperano UN uso, non tutti; i Punti stregoneria («riposo lungo (in parte con Ripristino stregonesco…)») non tornano più da soli col riposo breve.
- Agganci nel codice esistente: 6 (`sacra-edits.js` nello scratchpad). Prove: `sacra-test.js` 46 controlli, `legame-test.js` 34, `multi-test.js` 21, `prova-tavolo.js` verde nei due ruoli.
- **Non fatto / da decidere**: i 10 minuti non sono contati; danni radiosi a scelta li dichiara il giocatore (il tavolo non distingue i tipi di danno); Duellare sul giavellotto lanciato (+2 danni: per le regole vale se non impugna altre armi) non applicato; tra le azioni di Alessandros ci sono doppioni (Cura ferite ×2, Punizione divina ×2, Acqua santa ×2).

## v126 (27/09/2026) — Duellare sul giavellotto

- Deciso da Giuseppe: Duellare (+2 ai danni) vale anche sul giavellotto lanciato da Alessandros, se in mano non ha altre armi (lo scudo non conta). `PG_AUTO.alessandros.fix.Giavellotto` = +6, 1d6+5. L'Arma sacra sul giavellotto lanciato continua a non valere.

## v127 (28/09/2026) — lo stendardo preso dai giocatori

- Fatto del tavolo (Giuseppe): i giocatori hanno preso UNO dei due stendardi rossi dalla parete in fondo alla Stanza del Quarto Sigillo. Ne resta uno.
- `contenuti/scene/sotto.json`, PDI `sigillo`, modulo `custode_storia`: aggiunti `note` (il fatto, e che cosa ne sanno i PG secondo la prova di Storia) e `bottino` con «Stendardo rosso color ruggine» (categoria Oggetti e indizi, valore non stabilito). Il master lo dà con «Assegna bottino…» nella Guida.
- La descrizione dell'oggetto dice solo ciò che i PG hanno visto (rosso, liso, color ruggine, palo di ferro): niente Schiera, niente Sigillo. Peso, valore e proprietà non sono nel canone: non inventati.
- Da decidere (Giuseppe): che cosa succede se lo mostrano a qualcuno che sa riconoscerlo.

## v128 (29/09/2026) — Tavolo, Scheda e Compendio ridisegnati

- Osservazione di Giuseppe: nell'audit dei tasti (v120) i tre tasti della barra in alto erano stati saltati perché un'icona l'avevano già, «ma potevano essere fatti più belli».
- Blocco «BARRA IN ALTO (v128)» (CSS in fondo allo stile, JS in fondo allo script): al posto dell'icona a filo, un emblema pieno in oro a rilievo, della stessa pasta del logo — mappa col segnaposto (Tavolo), scudo col busto (Scheda), libro aperto (Compendio). `NAV_ART` = contenuto dell'`<svg>` 32×32 di ogni tasto; i colori sono i due gradienti `#navOro` e `#navBronzo` in `#navDefs` (un `<svg>` invisibile in testa al body). La scritta sta in `<span class="navlbl">` (eredita il carattere del tasto: Mr Eaves).
- Stati: spento = targa scura, filo d'ottone, emblema bronzo; mouse sopra = oro; acceso = targa illuminata, scritta in oro, rombo sotto.
- Il dock (Muovi, Misura, Tira dadi, Ping) usa gli stessi due gradienti per il tratto delle icone e la stessa targa accesa.
- Non cambiano misura dei caratteri e margini: valgono ancora scala tipografica e adattamento allo schermo (controllato a 1920, 1366, 1200, 1000, 800 e 420 px).
- Bocciati da Giuseppe in passato e NON usati: cornici ornate, pergamena, cornici generate. Gli emblemi stanno anche in `05_Immagini/Icone dei tasti/BARRA - *.svg`.

## v129 (29/09/2026) — secondo audit dei tasti: tutto in oro

- Richiesta di Giuseppe: rifare l'audit dei tasti contando anche ciò che il primo (v120) aveva saltato, e rifarlo. Rapporto: `7_Aprutium/Revisioni/Audit dei tasti 2 - arte e simboli (v129, 29-09-2026).md` (182 tipi di elemento premibile, cosa è cambiato, cosa è rimasto com'era e perché).
- **Una lingua sola** per tutto ciò che si preme, quella della barra in alto (v128): bronzo spento, oro col mouse sopra e acceso, targa illuminata quando è scelto.
- Blocco «TASTI IN ORO (v129)»: la variabile CSS `--uico` è il colore del tratto dei simboli (`svg.uico{stroke:var(--uico,currentColor)}`); vale `url(#uiBronzo)` sui tasti delle zone scure, `url(#uiOro)` su `:hover` e `.on`, e `currentColor` (con `!important`) su tasti oro pieni, rossi, disattivati, sulla pergamena della Guida e sulla carta dell'oggetto. I gradienti `#uiOro` / `#uiBronzo` hanno `gradientUnits="userSpaceOnUse"` (0–24): con le coordinate relative le linee dritte (il «meno», il righello) sparirebbero.
- Blocco «SIMBOLI DEI TASTI»: `UI_ICO` ha 126 disegni (nuovi: `wall`, `door`, `ruler`, `archive`, `pin`, `l_corona`, `l_torre`, `l_casa`, e le abilità `s_*`). Regole nuove in `uiIcoKey`: `data-roll` (scudo per i TS, `UI_ICO_SKILL` per le 18 abilità), `data-v3mod` (`uiIcoModulo`: dal tipo del modulo o dal titolo), `data-liv` (`UI_ICO_LIV`, segnaposto per le città). `uiIcoFx` mette negli effetti da accendere l'immagine dell'abilità (`icoAbil`). `uiIcoSwap` ridisegna le icone vecchie di strumenti della mappa e Registro (`UI_ICO_SWAP`) a ogni passata, perché `btnClearLog` rimette la sua quando si disarma.
- Altri ritocchi: pallini di risorse e slot come gemme d'oro, caselle di spunta oro, casella dei metri delle aree leggibile, schede Panoramica/Collegamenti/Note con il simbolo sopra, segnaposto dei luoghi come medaglioni, `.shskills .sk` a quattro colonne quando c'è il simbolo.
- Lasciati com'erano: punti d'interesse sulla mappa (il colore dice il tipo), ritratti, quadratini con illustrazione, menu a tendina, collegamenti nel testo.
- **Attenzione agli script dello scratchpad** (`patch.js` dei simboli): la vecchia versione, rilanciata, toglieva dallo stile tutti i blocchi scritti DOPO quello dei simboli. Corretto: ora ogni blocco finisce dove comincia il successivo («/* ===== ») e torna al suo posto. Chi riscrive un blocco a mano controlli con `grep -c '===== ' src/tavolo.html` prima e dopo.

## v130 (29/09/2026) — via le due tasselle sulla mappa

- Richiesta di Giuseppe (guardando insieme la pagina): tolte dalla mappa, in alto a destra, le tasselle `#hudScale` («1 casella = 1,5 m») e `#hudSel` (nome e PF del token selezionato). `#hud` resta solo per `#sceneName` (il nome della scena, ai giocatori).
- `#hudScale` era testo fisso, mai aggiornato dal codice. `#hudSel` era scritto da `render()`: le due righe sono state sostituite.
- L'unica informazione che stava solo lì — il movimento rimasto al token selezionato durante lo scontro — ora è nella **Selezione** del master (`#selMovLbl` / `#selMov`, «Movimento 9 / 9 m», visibile solo in scontro). I giocatori il loro movimento lo avevano già in «Il tuo personaggio».
- Effetto collaterale buono: spariscono dall'HUD i PF dei mostri, che un giocatore vedeva cliccando un nemico (guasto segnalato nell'audit v121).
- **Da aggiornare**: gli strumenti dell'altro audit in `Revisioni/audit-tavolo-strumenti/` (`sc10-permessi.js`, `verifica29.js`) leggono ancora `hudSel` e su questa versione si fermano con un errore.

## v131 (29/09/2026) — testata, titoli delle sezioni, tasto della fase

- Richiesta di Giuseppe, indicando gli elementi sulla pagina: rifare il look di «Atto Terzo», del numero di versione, del selettore Vista, dei titoli delle sezioni (Scontro, Selezione, Registro…) e del tasto della fase.
- Blocco CSS «TESTATA E FASE (v131)» in fondo allo stile (solo stile, nessuna riga di JavaScript):
  - **Marchio**: «Atto Terzo» in oro con un rombo davanti; la versione in una capsula (`#ver`, 15 px, non più al 60% di opacità: Giuseppe la legge per capire se vede la versione nuova).
  - **Vista** (`.pill.ctl`, `#roleSel`): targa come i tasti della barra, occhio d'oro, menu senza la freccia del browser.
  - **Menu a tendina** (tutti i `select`): `appearance:none` e freccia d'oro disegnata; marrone scuro sulla pergamena della Guida.
  - **Titoli delle sezioni** (`.sec h2.collh`, `.shpanel h2`): scritta in oro, rombo al posto del glifo ✦, filo che sfuma a destra. Sezione chiusa = rombo vuoto. Il nome del token selezionato va a capo sotto «Selezione».
  - **Tasto della fase** (`.phasebtn`): icona in un medaglione; esplorazione = targa scura con scritta oro, Fermi tutti = targa d'oro, scontro = targa rossa con bagliore. La freccetta ▾ è disegnata (angolo in alto a destra). Il testo non si spezza a metà parola (controllato a 1920, 1536, 1366 e 1000 px).
  - **Barre di scorrimento**: sottili e scure (`scrollbar-width`, `scrollbar-color`), marroni sulla pergamena.
- Molte regole vecchie su `.collh` e `.phasebtn` hanno `!important`: per questo il blocco lo usa dove serve.

## v132 (29/09/2026) — via l'etichetta col nome della scena

- Richiesta di Giuseppe: tolta dalla mappa l'etichetta `#sceneName` (il nome della scena, in alto a destra, solo per i giocatori). Era l'ultima delle tre tasselle di `#hud` (le altre due tolte nella v130): `#hud` resta nella pagina ma vuoto, perché due controlli dei clic lo nominano ancora.
- Tolta anche la riga di `applyScene()` che la riscriveva.
- Ai giocatori il nome della scena resta in cima alla Guida della scena (controllato su Sotto Bëllindë, il borgo, un luogo e il guado); il master ha il menu Scena.

## v133 (30/09/2026) — segnali delle condizioni a medaglione

- Richiesta di Giuseppe: rifare le etichette di stato (Benedetto, Prono, Legame…) sotto i token e nella colonna dei personaggi: erano sigle di tre lettere (PRN, BEN, LEG) in rosso.
- Blocco «SEGNALI DELLE CONDIZIONI (v133)»: `condBadges()` (chiamata da `uiIcoAll`, quindi dopo ogni disegno della pagina) sostituisce il testo di ogni `.condrow .cond` con il simbolo della condizione (`UI_ICO.c_*`) in un medaglione tondo: bordo rosso se nuoce, oro se è buona (`COND_BUONE`: benedetto, concentrazione, legame, invisibile, scatto). I round restanti sono un numerino sull'angolo; il nome completo resta nel suggerimento. Nella scheda (`.shcond`) il simbolo va accanto al nome, con lo stesso colore.
- Il testo lo scrive ancora `condHtml()` (sigle da `CONDS_ABBR`): non è stato toccato. Una condizione senza simbolo resta com'era (sigla).
- Misure: sui token 13 px (18 col mouse sopra o selezionato), nella colonna 24 px. I caratteri del resto della pagina non cambiano.

## v134 (30/09/2026) — simboli anche nelle schede nascoste del browser

- I simboli dei tasti e i segnali delle condizioni si applicavano con `requestAnimationFrame`, che in una scheda del browser non visibile non parte: chi tornava sulla scheda dopo un aggiornamento vedeva per un attimo le sigle vecchie (visto nel browser dell'app). Ora la passata usa `setTimeout(…,0)`.
- Corretto lo script `patch.js` dello scratchpad (blocco dei simboli) anche sul lato script: prima, rilanciato, cancellava i blocchi scritti dopo il suo (era successo al blocco delle condizioni). Ora ogni blocco finisce dove comincia il successivo e torna al suo posto, e lanciarlo due volte non cambia nulla.

## v135 (30/09/2026) — le correzioni dell'audit dei tasti, secondo le regole 2024

- Richiesta di Giuseppe: sistemare **tutti** i punti dell'audit (`Revisioni/Audit tasti e meccaniche del tavolo v121 (27-09-2026).md`, ricontrollati sulla v127) seguendo D&D 5e 2024 (SRD 5.2.1). Esito: 27 punti su 29 corretti e verificati (`Revisioni/audit-tavolo-strumenti/verifica29.js`); restano il n. 14 (immagine de «La scala a chiocciola») e il n. 29 (ritratti di Rocco Serrafredda e di Titta), che sono immagini da fare da Giuseppe.
- Le correzioni sono scritte come **serie di modifiche rigiocabili** (`Revisioni/audit-tavolo-strumenti/correzioni-v135/`: `applica.js` legge `patches/elenco-*.json` e i pezzi `g1…g6-*.js`, si applica sul sorgente e si ferma se un aggancio non è più unico; `patches/contenuti.js` corregge i JSON dei contenuti). Sono state riapplicate sulla v132 e poi sulla v134 dell'altra sessione senza toccarne i blocchi. Nel sorgente ogni pezzo nuovo porta il commento `v135 —`.
- **Scontro**: `sortOrder()` tiene il turno a chi ce l'ha quando entra o esce un combattente (a inizio scontro resta 0); «Prossimo» salta i mostri a 0 PF e i PG morti o stabili, un PG a 0 PF tiene il turno per il tiro contro la morte.
- **Morte (regole 2024)**: `applyDamage` nuova (prima i PF temporanei; danni a 0 PF = un fallimento, due se critico, morte se ≥ PF massimi; un PG stabile colpito non è più stabile; danno massiccio; i mostri muoiono a 0 PF); `applyHeal` ritorna `{v,dead}` e non cura i morti; `isDead`, `deathSave`, `reviveToken` (Selezione del master: tiro contro la morte, stabilizza, riporta in vita con 1 PF).
- **Selezione del master**: «Togli» (`gmDamage`) e il nuovo «Cura» (`#healGo`, `gmHeal`) accettano solo numeri positivi e finiscono nel Registro; i PF in coda alle righe del Registro (`hpTail`) li vede il master, e tutti solo se il bersaglio è un PG o un compagno; il giocatore non vede i PF dei mostri.
- **Risorse della scheda** (`resLink/resUsed/resSet`): i pallini sono legati allo stato vero (slot `t.used`, punti stregoneria `t.pts`, Dadi Vita `t.hd`, cariche `t.ich`); risorse oltre 12 mostrano «x / max» e «Usa». `useResource` nuova: un uso si spende solo se l'azione va in porto (`CAST_PEND`, `castPaid/castUnpaid`); Imposizione delle mani apre `layOnHands` (bersaglio, punti, 5 punti tolgono Avvelenato); Recupero energie cura 1d10 + livello; Rinascita selvatica spende un uso di Forma selvatica e ridà uno slot di 1°; le risorse «incantesimo gratuito» aprono il lancio già senza slot.
- **Riposi**: breve = `restShortOpen` (spesa dei Dadi Vita: dado + Cos, `t.hd` in `LIVE`), ricarica degli oggetti («recupera 1d6+4 cariche»); lungo = `restLong` (tutti i PF e i Dadi Vita, via PF temporanei, tiri contro la morte, condizioni, effetti, forme; chiude la concentrazione).
- **Oggetti**: pozioni con `invHealOpen` (bevuta o data a un alleato entro 1,5 m; a PF pieni non si consuma); gli oggetti con cariche (`useItemSpell`) spendono la carica solo al lancio confermato.
- **Incantesimi** (`SPELL_RULES` + `spellRule`, `castSpell`/`resolveCast` riscritti): modi atk/ts/colpo/danno/cura/effetto/bacche/stabile/rianima/ristora; niente danno immediato per i potenziamenti (Marchio del cacciatore mette `marchiato` e il +1d6 vale sui colpi, Arma elementale, Crescita di spine…); niente TS inventati dal testo; Bacche benefiche = «Bacca benefica ×10» nello zaino (1 PF l'una); Preghiera di guarigione e Aura di vitalità senza modificatore (Mattheus aggiunge Discepolo della vita: 2 + livello dello slot); un giocatore a 0 PF non lancia. **Concentrazione**: `concOf/concStart/concEnd` (una alla volta; lanciarne un'altra chiude la prima; togliere la condizione chiude l'incantesimo); quando chi si concentra subisce danni il Registro ricorda il TS Cos CD max(10, danni/2), a 0 PF finisce.
- **Token per scena**: mostri e PNG hanno `t.sc` (in `LIVE`); PG e compagni stanno sempre nella scena aperta e le loro posizioni per scena stanno in `S.pos[scena][id]` (segnalino del gruppo `__party`) — `pos` aggiunto a `SHAPE_OBJ`, `merge`, `toRemote`. Cambiare scena chiude lo scontro e toglie l'area d'effetto. `visible`, bersagli, Benedizione, aree, inizio scontro guardano solo la scena aperta; il Bestiario mette il mostro nella scena aperta. `normalize` rende `conds` sempre una lista di voci valide.
- **Classe Armatura dall'equipaggiamento**: `pgAcBase` (scheda), `invCaSum`, `pgAcResid` (bonus della scheda che l'equipaggiamento non spiega), `pgAcNow`; `tokAc(t)` dà la CA vera (forma selvatica → CA della forma, PG → equipaggiamento, +1 col Legame): togliere armatura e scudo cambia la CA nella scheda, nella Selezione e nei tiri per colpire. `invArmorCA` legge anche «CA 11 + mod. Des». Arma a due mani e scudo si escludono (`invHold`); attaccare con un'arma non in mano la impugna (`invDrawFor`, regola 2024). La scheda di Luigis e di Adamus prende i numeri di Zenith e del Toro da `ZENITH`/`WILD_FORMS`.
- **`doAction`**: un'azione della lista che è una risorsa (`resIndexFor`: Recupero energie, Azione impetuosa, Possanza del gigante, Imposizione delle mani, Forma selvatica, Stregoneria innata) va a `useResource`; una che è un incantesimo conosciuto (`spellKeyIt`) va a `castSpell`; un giocatore a 0 PF non agisce.
- **Condizioni** (`renderCondChips`): le condizioni attive stanno fuori dal `<summary>`, il riquadro si ridisegna solo se cambia (chiave) e i clic sono delegati al contenitore, così un aggiornamento da Firebase tra pressione e rilascio non perde il clic; tasto «Togli tutte» (`#condClear`); una condizione con nome sconosciuto si vede e si toglie.
- **Abilità** (`skillKey`, `abilAbbr`, `skillMod`, `skillKnown`): maiuscole e accenti non contano, «Arcana» = Arcano, una caratteristica è una prova di caratteristica, gli strumenti usano Des + competenza, «X o Y» prende la migliore. `rollFor`/`doRoll` usano `skillMod`.
- **Guida**: la chiave di `renderGuide` include `S.premi`; «Assegna PE» e «Assegna bottino» rifiutano la seconda assegnazione.
- **Punti nei muri**: `spotAnchor` — un PDI su una casella di muro si nota dalla casella libera più vicina.
- **Contenuti**: `scene/sotto.json` — posizione a «Strano Corridoio» (585,135) e a «La Galleria della Schiera» (1005,285), «L'Ultimo Custode» spostato a (1005,795) (era sopra il Sigillo); nomi delle abilità corretti in guado, osteria, teramum_porta, te_palazzo, be-stazione-di-posta, be-piazza-grande, be-borgo-vecchio; be-camposanto «Esaminare il corpo» → Medicina.
- **Anteprima del master** (richiesta di Giuseppe, 30/09): scegliere una scena dal menu «Scena» non sposta più il gruppo: il master la guarda da solo (`GM_VIEW`, solo locale) e sotto il menu compare la barra `#gmPeek` con «Porta qui il gruppo» (= `gotoScene`) e «Torna dal gruppo». In anteprima non si vedono i personaggi né il segnalino del gruppo, i punti non vengono notati e lo scontro non si inizia; mostri, punti, Guida e Bestiario lavorano sulla scena guardata (`viewKey()`, `gmPeeking()`, `sceneView()`). I giocatori vedono sempre `S.scene`.
- **Da decidere con Giuseppe (non fatti)**: i 32 mostri del Bestiario senza tiri salvezza; i giocatori non possono disegnare aree d'effetto; una sola richiesta di tiro alla volta; il salvataggio dell'intero stato può sovrascrivere modifiche contemporanee.
- Prove: `prova-tavolo.js` verde nei due ruoli; `verifica29.js` 27/29; scenari e crawler dell'audit rilanciati sulla versione.
- **Cartelle delle fonti**: dal 29/09 `05_Immagini`, `04_Luoghi` ecc. non esistono più: il materiale sta in `00_Progetto`, `01_Tavolo` (Scene/<città>/…/PDI, Bestiario, Token, Personaggi giocanti, Interfaccia), `02_Diario`, `03_Compendio` (01 Il Mondo, 02 Luoghi, 03 Personaggi/<città>/Ritratti, 08 Oggetti), `04_Materiali`. I vecchi percorsi citati più su valgono con la tabella `Revisioni/Audit cartelle e fonti (29-09-2026)/registro riordino.csv`.

## v136 (30/09/2026) — la Crociata sulla mappa del Ducato

- Richiesta di Giuseppe: il sistema della Crociata (statistiche, personaggi, risorse, movimento sulla mappa del Ducato) al posto del vecchio meccanismo Roll20, che non era scritto da nessuna parte. Schema approvato da lui il 30/09.
- **Scena `ducato`** (`contenuti/scene/ducato.json`, menu «Il Ducato d'Aprutium → Mappa del Ducato — la Crociata», `ordine` 0.5, `regole.crociata:true`, `token:"nessuno"`, niente punti): sfondo = `Ducato d'Aprutium - vista dall'alto (Grok).jpg` (scelta di Giuseppe; 2256×880, `img/0ebba2eeaea7.jpg`). `sceneFromData` → `CUR.crusade`.
- **Dati**: `contenuti/_crociata.json` → blocco `/*@CROCIATA*/const CROCIATA_DATA=…` (funzione `crociata()` di build.py, controlla id e scene delle tappe). Dentro: membri (Atto XVI + Registro della Crociata), posti dell'ordine di marcia, carri, armeria, sostegni, garanti, prove, problemi, regole della coesione, valori iniziali del Registro, 43 città con le coordinate dei puntini della mappa Grok (trovate in automatico), 3 tappe della strada per Teramum (guado, osteria, Colleatterato → le loro scene).
- **Stato**: `S.marcia` (in `SHAPE_OBJ`, `merge`, `toRemote`); `croS()` ricostruisce la forma, tutte le liste sono oggetti con chiave. Viveri e foraggio in razioni (giorni = razioni ÷ bocche, ÷ bestie), acqua in giorni.
- **Mappa** (blocco JS e CSS «LA CROCIATA (v136)»): stendardo animato (trascinabile dal master: sposta senza far passare giorni; clic = Registro), rombi delle città (clic = scheda con Compendio, stima dei giorni, «Marcia fin qui»), tappe nascoste ai giocatori finché la colonna non ci arriva, traccia del cammino, targa in alto a destra con viveri/acqua/foraggio. Segnaposto e stendardo restano della stessa misura a ogni zoom (`--croInv`).
- **Marcia** (`croMarch`): la colonna si ferma alla prima tappa non raggiunta entro `raggioTappa` px dal tratto; consumi proporzionali al tratto fatto; tutti i tavoli animano lo stendardo da `S.marcia.viaggio`; il master riceve la scheda «Fermi tutti» con il testo da leggere della scena e «Porta il gruppo». **Velocità = proposta da confermare**: 1 lega = 58 px (Bëllindë–Teramum IV leghe), 4 leghe al giorno; il master corregge i giorni prima di ogni marcia.
- **Guida della scena** (`croRenderGuide`): pannello della Crociata, tappe con note, Svela/Nascondi, «Sposta i segnaposto sulla mappa» (correzioni in `S.marcia.cityPos`).
- **Registro della Crociata** (`croOpenRegistro`): Il quadro · Forza · Ordine di marcia · Logistica (autonomia, treno, carri, armeria + bottino di `S.crociata`) · Tesoro · Morale e sostegni · Prove e problemi · Diario di marcia. Tutti leggono, solo il master cambia; ogni cambio va nel Diario.
- **Da decidere con Giuseppe**: il Registro e l'Atto XVI dicono 39 persone, ma l'elenco dà 7 + 20 + 11 = 38 (gli «specialisti e civili» sono detti 12 ma ne sono nominati 11). Effetti dei posti dell'ordine di marcia (per ora solo assegnazione). Sistema Expeditio del Manuale (solo nomi): lasciato fuori.
- Script rigiocabile: scratchpad della sessione, `patch-cro.js` (+ `cro.js`, `cro.css`) — va applicato su una copia pulita del sorgente.
- Nella stessa versione: punto «dove_eravamo» di Sotto Bëllindë (dall'altra sessione, `img/51568aca6aae.jpg`).

## v137 (30/09/2026) — i riposi in cima alla scheda

- Richiesta di Giuseppe: i giocatori non trovavano il modo di ripristinare punti ferita, slot e capacità. I tasti «Riposo breve» e «Riposo lungo» (gli stessi `#restShort`/`#restLong` di prima, con `restShortOpen`/`restLong`) ora stanno nella testata della scheda, accanto a CA/Iniziativa/Velocità (`div.shrest`, stile `.shrest` dopo `.shstats`), e non più in fondo a «Capacità e talenti». Li vede chi può agire col personaggio (il giocatore sulla propria scheda, il master su tutte).
- `restCan`: un personaggio **stabile** a 0 PF può riposare — torna a 1 PF (glossario 2024 «Stable»: dopo 1d4 ore) e il riposo comincia, con una riga nel Registro; chi è a 0 PF e non è stabile no (serve una cura o stabilizzarsi), come prima.
- Correzione incrementale sopra la versione pubblicata (patch set `patches2/` in `Revisioni/audit-tavolo-strumenti/correzioni-v135/`, applicato con `applica2.js`).

## v138 (30/09/2026) — Leader ispiratore di Mattheus

- Richiesta di Giuseppe: «Esibizione rinvigorente (Leader ispiratore)» non faceva niente (scalava l'uso e scriveva la nota nel Registro). Ora `useResource` apre `inspiringLeader(id,i)`: finestra con gli alleati entro 9 m (Mattheus compreso, fino a sei, già spuntati), ognuno ottiene PF temporanei pari a livello + il modificatore più alto fra Saggezza e Carisma (5 + 4 = 9); i PF temporanei non si sommano (resta il valore più alto); l'uso si spende solo con «Ispira». Regola 2024 del talento (SRD 5.2.1, «Inspiring Leader»: alla fine di un riposo breve o lungo).
- Correzione incrementale (`patches2/elenco-10.json` + `leader.js` in `Revisioni/audit-tavolo-strumenti/correzioni-v135/`); le patch già pubblicate stanno in `patches2-fatti/`.

## v139 (01/10/2026) — l'Ascia bipenne delle Due Lune a Maximus

- Richiesta di Giuseppe: l'ascia di Vhaerun (la chiave del dispositivo della Sala delle Ordinanze, ripresa dopo la purificazione del Sigillo) va a Maximus come attacco e come oggetto, con l'immagine.
- `contenuti/pg/maximus.json`: attacco «Ascia bipenne delle Due Lune» (+8, 1d12+5 taglienti: For +4, competenza +3, +1 magico; Pesante, Due mani, maestria Fendere) e voce dell'inventario in «Armi magiche» con le statistiche e la descrizione del bottino di `sigillo/ricompense` in `sotto.json` (peso 7 lb = 3,5 kg, valore non stabilito). Lo stesso nome nei due posti: la scheda Attacchi, l'inventario e la mano primaria si collegano da soli (`invActFor`).
- Immagine: generata con Higgsfield (gpt_image_2_5) nello stile degli oggetti della v117, sfondo tolto in locale (PIL), grande 768 e piccola 160 px; `img/283df4ed6d4b.png` e `img/e69198198185.png`; registrata in `contenuti/_icone.json` (`oggetti` e `abilita["Attacchi|…"]`) e in `03_Compendio/08 Oggetti/{Grandi,Piccole}/OGGETTO - Ascia bipenne delle Due Lune.png` + `_oggetti-inventario.json`. Script: `registra.py` nello scratchpad (copiato in `Revisioni/audit-tavolo-strumenti/correzioni-v135/`).
- Il bottino del modulo `sigillo/ricompense` resta com'è: se il master lo assegna di nuovo dalla Guida, Maximus avrebbe l'ascia due volte.

## v140 (04/10/2026) — menu «Luoghi e passaggi», X del Registro della Crociata

- Richiesta di Giuseppe (dopo la partita del 30/09): il menu delle scene era una tendina di 29 nomi senza anteprima né stato. Ora in cima alla Guida c'è il tasto **«Luoghi e passaggi»** (`#btnLuoghi`, con sotto `#scenaNow` = luogo · passaggio aperto). La tendina `#sceneSel` resta nascosta: il codice vecchio la usa ancora (`placeSceneSel` la sposta nella Guida e ora ci porta anche il tasto con `placeLuoghiBtn`).
- **Luogo e passaggio** (parola scelta da Giuseppe al posto di «visita»): il luogo è la mappa, che non cambia; il passaggio è ogni volta che i personaggi ci tornano, con i suoi punti d'interesse. Nei file delle scene il campo facoltativo `"passaggio": {"luogo", "nome", "n", "breve"}`; senza quel campo una scena è un luogo con un solo passaggio. Per ora ce l'hanno sotto, bellinde (1° passaggio) e bellinde_dopo (2°), che condividono la mappa del borgo, più guado e osteria. Un ritorno in un luogo = un file di scena nuovo con lo stesso `passaggio.luogo` e `n` +1.
- Finestra (`openLuoghi`, `renderLuoghi`, `renderPassDet`, classe `psbox`): luoghi per città con l'immagine della mappa, i passaggi con lo stato; a destra l'anteprima (immagine, «In breve» = `passaggio.breve` o il primo paragrafo di `intro.leggi`, punti svelati / mai svelati, luoghi della mappa), «Porta qui il gruppo» (`gotoScene`), «Guarda la mappa (solo tu)» (`sceneView`), «Archivia» / «Togli dall'archivio», «Segna come giocato» / «Segna da giocare».
- Stato (`passStato`): mappa del viaggio (scena con `regole.crociata`), si gioca adesso (`S.scene`), giocato (punti svelati, posizione salvata in `S.pos`, o un passaggio successivo dello stesso luogo già toccato), da giocare; il master lo forza con `S.scenaStato[id]` (`archiviata` / `giocata` / `dagiocare`) — campo nuovo in `SHAPE_OBJ`, `merge`, `toRemote`. Gli archiviati spariscono dall'elenco finché non si preme «Mostra gli archiviati».
- La X delle finestre (`#modal .close`) ha `z-index:20`: nel Registro della Crociata l'intestazione `.crorh` copriva la X in tutte le otto schede. Controllate le altre finestre: erano a posto (la scheda del PG non ha X, il Compendio la nasconde apposta).
- Solo in modalità prova: `?prova=1&statovero=1` legge una volta (senza scrivere) lo stato della partita vera da Firebase, per guardare le prove con i dati veri.
- Copia di prova usata per arrivarci: `7_Aprutium/_prova_menu/` (server in `.claude/launch.json` → «prova-menu», porta 8765). `prova-tavolo.js` verde nei due ruoli (66 e 38 comandi) con `playwright-core` dallo scratchpad e Chrome di sistema.

## v141 (04/10/2026) — strade del Ducato, rombi sui puntini

- Richiesta di Giuseppe: strade percorribili fra tutte le città della mappa del Ducato, tratteggiate; il rombo giallo di ogni città sopra il puntino bianco della mappa.
- **Rombi**: le coordinate di `CRO.citta` erano già giuste al pixel (controllate sui puntini bianchi dell'immagine, script `puntini.py` nello scratchpad). Il rombo stava più in alto perché `.cropin` (flex in colonna con `translate(-50%,-50%)`) centrava rombo + etichetta: ora l'etichetta è `position:absolute` sotto il rombo. Rombo 13 px.
- **Strade**: `CRO.strade` in `contenuti/_crociata.json` = 80 coppie `[da, a]` fra le 43 città e le 3 tappe, con la nota `_strade` «NUOVO DETTAGLIO PROPOSTO» (generate da `strade.py` nello scratchpad: grafo dei vicini relativi + vicini più prossimi senza incroci fino a tre strade per città + sette strade maestre a mano intorno a Teramum; Bëllindë–Teramum passa obbligatoriamente da guado, osteria, Colleatterato). Giuseppe le ha approvate guardandole il 04/10. Per aggiungere o togliere una strada si cambia solo quell'elenco.
- Codice (blocco «le strade (v141)» al posto delle vecchie `croFirstStop`/`croStima`): `croRoadPts` (curva leggera fissa, ricavata dagli id), `croRoads` (cache), `croRoute(daId, daPos, aId)` = Dijkstra sulla lunghezza delle curve (se la colonna è in aperta campagna parte dal nodo più vicino), `croFirstStop` = prima tappa non visitata sul percorso, `croStima` = leghe e giorni sul percorso. Disegno: `<g class="crostrade">` con ombra `.crostr-b` e tratteggio `.crostr`; l'anteprima della marcia (`croPreview`) disegna il percorso vero. `croMarch` salva in `M.viaggio.pts` il cammino (al massimo 60 punti) e aggiunge alla traccia 24 punti con chiavi in ordine; `croAnimate` muove lo stendardo lungo `pts` (i viaggi vecchi senza `pts` restano in linea retta).
- Provato: dal guado verso Teramum la colonna si ferma all'osteria; guado → Julia Nova passa da Bëllindë, Sandemire, Mushanè (9,9 leghe, 2,5 giorni). `prova-tavolo.js` verde.

## v142 (05/10/2026) — il guado di Sant'Atto dal mock-up, pedine della scena, fasce cumulative

- Richiesta di Giuseppe (sessione del 06/10 che riparte dallo scontro al guado): portare sul sito la scena del mock-up fatto in chat (`04_Materiali/guado-mockup.html`) con i criteri della «Consegna a Claude Code» (`00_Progetto/Istruzioni e indice/`).
- `contenuti/scene/guado.json` rigenerato da `guado-gen.js` (scratchpad; legge i dati del mock-up): 9 punti — nuovo `guado_ripresa` «Dove eravamo rimasti» (solo manuale), `guado_riva`, `guado_pioppi`, `guado_casale` = «Lo scontro al guado» (nemici uno per uno, difficoltà, fronti A/B/C con la tabella 1d6, chi attacca chi round per round, il momento di ciascuno al round 1 con la prova di Mattheus, gli eventi: Vhaerun, Gerardo dal pagliaio, il Carro IV, dai campi, Micuccio, Cola, l'ultimo cade con 6.700 PE), `guado_corrente` riusato per «I corpi sui sassi del fiume» (medaglione, falci, cosa farne, dialoghi di Silvanus, Vhaerun, Albino, Micuccio), pagliaio, casale, pozzo, `guado_edicola` = «La cappelletta di Sant'Atto». Id invariati (stato Firebase valido). Introduzione = il viaggio; nota dell'introduzione = la verità della scena. Posizioni dei punti dal mock-up (percentuali × 1448×1086).
- **Pedine della scena** (blocco «PEDINE DELLA SCENA» prima di `v3RenderMod`): campo `pedine` nel file della scena (`id, nome, short, best | kind:"alleato", x, y, gruppo`); un modulo con `pedine:["inizio",…]` mostra i tasti «Metti: …» / «Togli: …» per gruppo (id fissi `p_<scena>_<id>`, nella scena del punto) e «Togli i nemici messi a mano». Guado: 19 Forgiati in 5 gruppi (inizio, round2, round3, round4) + colonna (33 PNG e 5 carri come alleati senza iniziativa).
- Bestiario nuovo: `forgiato_marcio` (Ghast) e `forgiato_capo` (Bruto capo adattato), statistiche a memoria da verificare.
- **Fasce cumulative** (criterio 28): `v3Under` — una fascia di successo si accende (classe `sotto`) se qualcuno ha raggiunto una fascia più alta; il fallimento resta da solo.
- Etichette della Guida (criterio 1 e 5): «Da leggere ai giocatori» / «Da leggere» → «Copione», «Cosa lo fa partire» → «Quando», «E adesso» → «Poi»; tolto «lo semini tu nel testo»; i punti con CD 0 non mostrano più «Percezione passiva CD 0».
- Da approvare (proposte del mock-up, segnate nel mock): momenti del round 1 di Maximus, Vicarus, Alessandros; 20 naturale di Mattheus sul Filatterio; Vhaerun entra al round 1; Micuccio entra in acqua; dialoghi di Silvanus e Albino; pozioni di Albino e Sole di legno; terza ondata e Cola; Richiamo del Filatterio.

## v143 (05/10/2026) — Miti e leggende: Genesi, Pantheon, Nascita dei popoli, Frattura

- Richiesta di Giuseppe: aggiungere al Compendio, sezione Miti e leggende, le quattro voci che ha scritto con Claude (pagine `03_Compendio/01 Il Mondo/la-genesi.html`, `il-pantheon.html`, `la-frattura.html`; «La nascita dei popoli» solo come artifact claude.ai).
- **Una voce, un file**: `contenuti/miti/<id>.json` (forma del tavolo, `cat:"mito"`, `group:"Miti e Leggende"`): `mito-genesi`, `mito-pantheon`, `mito-nascita-dei-popoli`, `mito-la-frattura`. Testo tale e quale; i grassetti diventano `[[Nome]]`. Convertite da `converti.py` (scratchpad della sessione, copia in `Revisioni/`): rifare da lì se Giuseppe cambia le pagine.
- **La Frattura** ha lo stesso id della voce vecchia (`comp/out/miti.json`) e la sostituisce: del testo vecchio restano il blocco «Quello che avete scoperto» (ciò che i PG sanno dal tavolo) e le note del master («Dalla voce precedente del Compendio»).
- **Voci a blocchi** (blocco «MITI A BLOCCHI (v143)» prima di `renderC2Entry`, CSS omonimo in fondo allo stile): se una voce `mito` ha `pub` a elenco, la scheda mostra copertina grande con didascalia, `epigrafe` {txt,cite}, `scheda` della voce, e per ogni blocco titoletto (`liv:3` = nome di un dio), `simbolo` + `scheda` del blocco, `txt`, `simboli` [{img,nome}] in riga, `tabella` {head,rows}, `img` + `didascalia` (tavola nel testo, clic = ingrandisci). Le voci vecchie a testo unico non cambiano.
- `build.py`: risolve anche le immagini dentro i blocchi (`img`, `simbolo`, `simboli[].img`). Immagini: 5 tavole della Genesi (`Mito — La Genesi — tavola N.jpg`) e 19 simboli degli dèi (`Simbolo — <dio>.svg`) in `img/` (md5) e in `_immagini.json`.
- Le «proposte da approvare» (sottolineate a puntini nelle pagine di Giuseppe) sono entrate come testo normale: il sito non ha segni di bozza (regola v107).
- Contraddizioni con le voci già presenti, da decidere con Giuseppe: forma di Valerus (sfera di energia in `mito-due-lune-e-sole` / sagoma di luce nella Genesi); Mortus (il «Reietto» in `mito-mortus` / figlio di Noxtua nel Pantheon); chi c'è dietro la Frattura (Tessitori dell'Abisso nelle note vecchie / l'Oblio nella voce nuova); Celamanti nelle «foreste d'occidente» / Sylva Noctis continente oltre il Mare di Vespero (voce del Mondo); Lyria «figlia» ma «un giovane»; Pantheon rimanda a «Popoli» (la voce è «La nascita dei popoli»).
- Contiene la v142 dell'altra sessione (guado), non ancora pubblicata al 05/10 sera.
- Prova: `prova-tavolo.js` verde nei due ruoli (66 e 38 comandi).

## v144 (05/10/2026) — bonifica dei file superati

- Richiesta di Giuseppe: togliere i file che non servono più e confondono. Spostati (non cancellati) in `7_Aprutium/_ARCHIVIO_2026-10-05/`, con `registro.csv` e `py sposta.py --annulla` per rimettere tutto com'era: i .bat di pubblicazione (`PUBBLICA-TAVOLO.bat`, `PUBBLICA.bat`, `strumenti/PUBBLICA-TAVOLO.bat`), i documenti della v74 (`AVVENTURA.md`, `MODELLO-DATI.md`, `CONFINI-E-CONSEGNA.md`, `INTERFACCIA.md`), i moduli storici `src/ext*_ui.js`, `src/ext_data.js`, `src/poi_imgs.js`; fuori dal sito `_tavolo_tmp` e quattro audit chiusi di `Revisioni/`.
- Nessun codice li usava (controllato su build.py, tavolo.html, strumenti, launch.json). La pagina non cambia: solo il numero di versione.
- Le istruzioni generali del progetto stanno ora in `7_Aprutium/CLAUDE.md`, letto all'inizio di ogni conversazione.

## v145 (05/10/2026) — il Registro della Crociata a sei pagine sul sito; seconda bonifica

- Richiesta di Giuseppe: portare sul sito tutto ciò che stava solo nella copia di prova `_prova_menu` e togliere i file che fanno rumore.
- **Registro della Crociata** (blocco «REGISTRO DELLA CROCIATA COME UN GIOCO (v145; provato in _prova_menu come v142)» in fondo allo script, CSS iniettato dallo stesso blocco): sei pagine Panoramica · Il campo · La compagnia · Ordine di marcia · Carri e armeria · La causa e il diario; consumi e velocità calcolati dalla colonna (`croConsumi`, `croCarico`, `croVelocita`), acqua in razioni vere (`M.acquaR`), `M.campo`, `M.forzata`, `M.caldo`, intendente, rifornimento. Dati in `contenuti/_crociata.json` → `compagnia` (tipi, nuovi membri, schede, stemmi, regole, posti, campo, alleati): impianto approvato da Giuseppe il 04/10, numeri e dettagli «NUOVO DETTAGLIO PROPOSTO». Proposta: `03_Compendio/04 La Crociata/Sistema della Crociata - proposta (04-10-2026).md`. Il blocco era uguale nella prova: copiato senza modifiche, nessun conflitto con v142-v144.
- Provato: sei pagine aperte da master e da giocatore, nessun errore; `prova-tavolo.js` verde.
- **Server delle prove**: `strumenti/server-prova.js` (prima stava in `_prova_menu`); `.claude/launch.json` ha `sito`, `sito-2`, `sito-3` (porte 8766-8768) perché più conversazioni lo usano insieme. Indirizzo: `index.html?prova=1&ruolo=master` (o `ruolo=<pg>`).
- **Archiviati** in `7_Aprutium/_ARCHIVIO_2026-10-05/` (registro e `sposta.py --annulla`): la copia `_prova_menu` (senza il collegamento `img`, tolto perché puntava a `Sito/img`), `SCARICA-IMMAGINI-*.bat` e `immagini-*.txt` (tutte le immagini sono già in `img/`, nessun URL esterno in `_immagini.json`), `sessioni/` (doppione degli Atti in `02_Diario`), `stato/stato_fb.json` (fotografia del 10/09), i font Draconis (non usati dalla v103).

## v146 (05/10/2026) — token nuovi

- Richiesta di Giuseppe: rifare tutti i token con una cornice e un colore per categoria, partendo dai ritratti. Cornice approvata da lui (prova del 05/10): anello metallico con luce dall'alto a sinistra, filo di luce, rombo in basso; **oro = eroi (PG), argento = PNG, verde = alleati (Crociata), rosso = nemici**.
- **Generatore**: `strumenti/token/genera.py` (+ `fai_token.py`): `py Sito/strumenti/token/genera.py` rifà tutti i token dai ritratti di `03_Compendio/**/Ritratti` e li scrive in una cartella `Token` accanto a ogni `Ritratti` (`TOKEN — <nome>.png`, 512 px, trasparenti). Viso trovato con OpenCV (`opencv-python-headless<5`: la 5 non ha più i classificatori Haar), inquadrature a mano in `MANO`, categorie da `ALLEATI` / `NEMICI` / cartella (`Personaggi giocanti` = eroi, `09 Creature` = nemici). Il foglio di controllo va nella cartella temporanea, non nel progetto.
- 05/10: 115 token (6 eroi, 9 alleati, 22 nemici con Iuvenza, Umbrax, Impalox e Ceruso spostati fra i nemici da Giuseppe, 78 PNG). I 91 token vecchi di Roll20 sono in `7_Aprutium/_ARCHIVIO_2026-10-05/Token vecchi (Roll20)`.
- **Sul sito**: `PG_TOKENS` punta ai sei token nuovi dei PG (256 px, `img/<md5>.png`, chiavi `TOKEN — <nome>.png` in `_immagini.json`). PNG e mostri sulla mappa sono ancora cerchi con le iniziali: per usare i loro token bisogna collegarli a Bestiario e pedine (`tokimg`), da fare.
- Mancano i ritratti (quindi i token) di Vasco, Iosephus, Brizio, Pippo, Dottor Albino, Colangelo, Giustino, Tiberius.


## v147 (05/10/2026) — Diario: Atti XVII e XVIII, correzioni degli Atti

- Il Diario del sito si fermava all'Atto XVI. Nuova cartella `contenuti/diario/` (una voce, un file; forma del tavolo: `cat:"diario"`, `riga`, `data`, `eventi`, `pub` in testo semplice con i titoletti in maiuscolo): `atto-17` «L'Ultimo Custode» e `atto-18` «La risalita e la strada», scritti dagli Appunti dettati da Giuseppe e dal recap della sessione del 30-09 (Consegna §7). Sono bozze: le domande aperte stanno in `7_Aprutium/02_Diario/Da chiarire - Atti XVII e XVIII.md`.
- Stesse correzioni fatte oggi agli Atti in `02_Diario/Atti` portate sul sito sovrascrivendo le voci vecchie per id: `atto-12` e `atto-13` (Onofrio = frate delle vigne, poi Abate; Onorino = frate grasso della porta), `atto-15` (giorno/notte, «due giorni», tolta la nota di redazione), `atto-16` («proclama», due frasi).
- Gli Atti in `02_Diario/Atti` sono ora tutti `.md` puliti (niente HTML né collegamenti Roll20); il testo delle voci del sito si rigenera da lì.

## v148 (07/10/2026) — Compendio a dieci sezioni, undici voci nuove, voci vecchie in archivio

- Richiesta di Giuseppe: menu nuovo del Compendio e le sue 11 pagine nuove (`03_Compendio/<Titolo> — Compendio di Aprutium.html`: Genesi, Pantheon, Valerus, Maia, Noxtua, Mortus, Nascita dei popoli, Frattura, Sigilli Lunari, Guerra delle Due Lune, Stirpe di Aurax). Le pagine nuove vincono sulle voci vecchie; resta solo ciò che i PG hanno scoperto al tavolo.
- **Menu** (blocco «MENU A DIECI SEZIONI (v148)», all'inizio di ESTENSIONI 7): `C2_SECTIONS` = miti · storia · popoli · impero · ducato · fazioni · persone · atti · appendici · bestiario. La sezione la decide `c2SecOf(e)`: campo `sez` delle voci nuove, altrimenti categoria e livello (nazioni e atlante → popoli; impero-aureo e province → impero; ducato, contee, borghi e tutti i luoghi → ducato; fazioni + Naviganti Grigi → fazioni; diario, quest, crociata → atti con tre linguette Diario / Imprese e questioni aperte / La Crociata; oggetti e il resto → appendici). Popoli, Impero e Ducato sono ad albero (`C3_ALBERO`: linguette per livello e per città, briciole come prima). Una sezione senza voci visibili non compare ai giocatori (oggi: Bestiario). Le voci con `ordine` stanno in ordine fisso, e i gruppi seguono il loro `ordine` più basso (Le origini, Il Pantheon, Miti e leggende).
- **Voci nuove**: `contenuti/miti/<id>.json` da `Revisioni/Compendio - voci nuove v148/converti.py` (rilanciarlo quando Giuseppe cambia le pagine o aggiunge ritratti; quello della v143 è superato). Campi nuovi: `sez`, `ordine`, `parent` (gli dèi → `mito-pantheon`), `dio:true` (la scheda del dio in alto con il ritratto: `c2VoceTesta`). Nei blocchi: `capo` (capolettera), `ritratto` + `voce` (tasto «Apri la scheda»), `simboli[{nome,img?,voce}]`; nel testo i paragrafi `» …\n— fonte` (versi), `↪ …` (rimandi), righe `· ` (elenchi), resi da `c2Paras`. `build.py` risolve anche `ritratto`. Id riusati per le voci che sostituiscono le vecchie (`mito-mortus`, `mito-sigilli-lunari`, `mito-guerra-due-lune`, `mito-stirpe-aurex`, `mito-la-frattura`): collegamenti e stati di Firebase restano validi.
- **Immagini**: 17 ritratti degli dèi (`Dio — <nome>.jpg`, 1000 px) e 2 tavole del Pantheon (`Mito — Il Pantheon — La guerra dei Titani.jpg`, `… La salita al cielo.jpg`) da `03_Compendio/01 Il Mondo/Il Pantheon`; le 5 tavole della Genesi erano già in `img/`. Senza ritratto: Valerus e Mortus (scheda con l'iniziale). I 19 simboli SVG (v143) tolti da voci e `_immagini.json`, file in archivio.
- **«Quello che avete scoperto»**: le frasi giocate delle voci vecchie, parola per parola (`Revisioni/Compendio - voci nuove v148/giocato.json`), controllate sugli Atti (rapporto `confronto.md` nella stessa cartella): Pantheon (dalle Due Lune e il Sole), Mortus, Sigilli, Guerra, Stirpe, Frattura (+ Celamanti). Tolte tre frasi senza riscontro negli Atti: il Pendente di Adamus (due volte), «medaglioni», «Mattheus non può resuscitare…».
- **Archiviate** (`archivia.py`; `_ARCHIVIO_2026-10-07/Compendio - voci superate (v148)/` con `voci-vecchie.json` e `registro.csv`): `mito-due-lune-e-sole`, `mito-celamanti` e le vecchie versioni di mortus, sigilli, guerra, stirpe, frattura, tolte da `comp/out/*.json` e da `COMPENDIO_DATA`. I collegamenti verso le due voci sparite puntano a `mito-pantheon` e `mito-la-frattura`. Le note master «Dalla voce precedente» della Frattura (v143) sono nell'archivio.
- **Da decidere con Giuseppe** (contraddizioni fra giocato e pagine nuove): stendardo di Aldric trovato ad Altavia (Atto XI) / dato dal prefectus; Aldric «nonno» di Silvanus ma morto nel 1240; Primo Sigillo «infranto» un anno prima (Atto I) / «la Crociata ha purificato» a Canzanium (Maia, parte giocatori); tabella dei Sigilli: Secondo purificato nell'Atto VII, non II; Ultimo Custode messo dall'ordine di Cyrius Meren (Atto XVII) / ordine perduto; Noxtua «non ha mai parlato» / visione di Almerya e voce del Bastone (Atti IV, IX); Sylva Noctis oltre il mare (Atto VII) / confine di terra con Laguras. Dentro le pagine: 7 Sigilli in tabella ma 3 frantumati ai Campi d'Argento; il matricidio dei Drukarri è pubblico nelle parti giocatori ma segreto nelle parti master; nomi dei sette Sigilli nella parte giocatori; il Pantheon rimanda ancora a «la voce Popoli». Voci rimaste da allineare: `impero-aureo` (ai giocatori «Tiberion III»), `faz-sylva-noctis` ed `eptarchia-sylva-noctis` (Tessitori dell'Abisso), `faz-chiesa-fiamma-eterna` (Fiamma Eterna / Solare), `faz-custodi-del-ciclo` (rete viva; due Corvinus), `ogg-stendardo-aldric-aurex`, `mito-canto-fiamma-eterna` (Noxtua non può tornare), `borgo-cevetella` (assedio di 10 anni).
- Script rigiocabili in `Revisioni/Compendio - voci nuove v148/`: `converti.py`, `archivia.py`, `menu.py` (si ferma se un aggancio non è unico). Prova: master e giocatore controllati a mano (nessuna parte master visibile al giocatore, Bestiario nascosto); `prova-tavolo.js` verde (66 e 38 comandi).

## v149 (07/10/2026) — correzioni di canone decise da Giuseppe

- Decisioni di Giuseppe sulle contraddizioni della v148, applicate con `Revisioni/Compendio - voci nuove v148/correzioni-0710.py` (rigiocabile: elenca ciò che non trova più) alle sue pagine in `03_Compendio`, agli Atti in `02_Diario/Atti` e alle voci del sito (`comp/out`, `COMPENDIO_DATA`, `contenuti/`, `giocato.json`); poi `converti.py` e `build.py`.
- **Stendardo**: lo stendardo di Aldric (oro, A.A.) non è ancora stato ritrovato. Silvanus non ha mai detto «Questo è di mio nonno»: Atto XI corretto («il Sole con i raggi d’oro e, ai lati, le Due Lune»), e così il Diario del sito e le voci che parlavano dello «stendardo del nonno» / «di Aldric Aurex». `ogg-stendardo-aldric-aurex` (id invariato) ora si chiama «Lo stendardo del Sole e delle Due Lune». Lo stendardo del prefectus è suo, non di Aldric (pagine Guerra e Stirpe, master).
- **Primo Sigillo purificato, non infranto** (i Sigilli non si infrangono: sono frammenti di Noxtua): Atto I, Diario, quest, storie dei PG, note; pagina Maia («un anno prima della Crociata, è stato purificato»); tabella dei Sigilli «Purificato un anno prima dell’Atto I», Secondo «Atto VII».
- **Custodi del Ciclo**: esistono ancora, ridotti a pochi; sono l’ordine di Cyrius Meren, che ha messo il prefectus sotto Bëllindë (pagine Sigilli e Guerra).
- **Noxtua non ha mai parlato**: la voce nel Bastone di Lyaras è di Oblius o del suo emissario Zaelyrion Nox’Velith (pagina Noxtua, master; Sigilli, master). La visione di Almerya (la Fata Oscura che piange) non è mai stata giocata: tolta dall’Atto IV, dal Diario, dalla voce di Almerya, da una fazione, dalla pagina Noxtua e dal blocco «scoperto» del Pantheon.
- **Sylva Noctis è oltre il mare**: Frattura («si ritirarono oltre il mare, nelle foreste di Sylva Noctis»; prigionieri «dalle coste e dalle isole»), Guerra (Fronte Occidentale «sulle coste e nelle valli di Laguras, dove sbarcavano gli eserciti venuti da oltre il mare»; superstiti non inseguiti «oltre il mare»).
- **Campi d’Argento** (storia nuova, chiesta da Giuseppe, a puntini nella sua pagina): i tre Sigilli non si frantumano; Aelwen li rivolge contro l’Occhio di Velathrys, il cristallo del comando nemico, e lo spezza; i Sigilli tornano «freddi e muti»; la polvere d’argento è delle schegge dell’Occhio.
- Restano come sono, per scelta di Giuseppe: i nomi dei sette Sigilli nella parte giocatori; l’Atto IX («il Bastone… un condotto della Fata Oscura»: è ciò che credevano). Le voci vecchie da riallineare le riscrive lui e arriveranno come pagine nuove.
- Prova: `prova-tavolo.js` verde (66 e 38 comandi); voci nuove controllate da giocatore.

## v150 (07/10/2026) — la voce del Bastone è Lyaras; il matricidio resta pubblico

- Giuseppe: nel Bastone di Lyaras parla **Lyaras**, non la Fata Oscura (né Oblius, come scritto nella v149). Corretti Atto IX («sussurra con la voce di Lyaras», «un condotto della volontà di Lyaras»), Diario, oggetto, quest; tolte dalle pagine Noxtua e Sigilli le frasi della v149 su Oblius e il Bastone, e dal blocco «scoperto» del Pantheon la frase di Elara (non riguarda gli dèi). Noxtua non ha mai parlato: resta.
- Il matricidio dei Drukarri resta visibile ai giocatori (Frattura, Nascita dei popoli). Tolte le note master che lo trattavano da segreto: «Hanno ucciso la propria madre» (Frattura) e «I figli che uccisero la madre» (Nascita, ora «I nomi dei Drukarri»: Celamanti, Aelvar’quen).
- Stessa procedura: terza passata di `correzioni-0710.py`, poi `converti.py` e `build.py`. `prova-tavolo.js` verde.

## v151 (07/10/2026) — immagini già esistenti collegate a 51 voci del Compendio

- Richiesta di Giuseppe: un'immagine per ogni voce del Compendio che non ce l'ha. Prima parte: 51 immagini che stavano già in `03_Compendio` ma non erano collegate (15 ritratti di PNG di Julia Nova, 36 luoghi e quartieri di Julia Nova), approvate da Giuseppe sul foglio di controllo.
- Script in `Revisioni/Compendio - immagini v149/`: `comune.py` (`voci_senza`, `registra`, `assegna`), `abbina.py` (solo lettura → `abbinamenti.json`). Le voci di `contenuti/` prendono il nome leggibile (risolto da `_immagini.json`); le voci vecchie di `COMPENDIO_DATA` (e `comp/out`) non passano da `build.py` e prendono direttamente `img/xxx.jpg`.
- Restano 293 voci senza immagine: elenco in `Revisioni/Compendio - immagini v149/Voci senza immagine.md`. Da generare con Higgsfield in stile illustrazione pittorica da manuale D&D (come i ritratti degli dèi), non fotografico.
- I quartieri 8, 9, 11-15 di Julia Nova hanno ancora `img: null` nei file di `contenuti/luoghi` mentre le vecchie immagini «Quartiere N Julianova.jpg» sono in `COMP_IMG`: da decidere con Giuseppe.

## v151 (07/10/2026) — tutto il Pantheon: 15 dèi e Il Senza Nome; ritratti dei popoli

- Giuseppe ha mandato `Compendio - nuove voci 07-10-2026.zip` con 27 pagine. Nuove: Sementia, Nerio, Vulcar, Memora, Iustia, Bellator, Vespera, Somnia, Sortia, Cordia, Liberio, Ferina, Auria, Lyria, Salvia e **Il Senza Nome** (la scheda di Oblius: il nome sta solo nella parte master; controllato da giocatore). Cambiata: Il Pantheon («Viene dopo: La nascita dei popoli», Lyria «Una giovane»). **Le altre 10 nello zip erano le versioni senza le correzioni v149-v150: NON usate** (confronto riga per riga); restano le pagine corrette in `03_Compendio`. Lo zip è in `_ARCHIVIO_2026-10-07/Compendio - voci superate (v148)/` (registro).
- Le pagine nuove sono salvate in `03_Compendio/<Titolo> — Compendio di Aprutium.html` (27 in tutto). `converti.py`: tutti gli dèi in `VOCI` nell'ordine della pagina del Pantheon (`ordine` 3-22, `parent: mito-pantheon`, id `mito-<nome>`, `mito-il-senza-nome`); `DEI_CON_SCHEDA` ricavato da lì, quindi nel Pantheon ogni dio ha «Apri la scheda». Il menu mostra il gruppo «Il Pantheon» con 21 schede.
- **Ritratti dei popoli** (`03_Compendio/01 Il Mondo/I Popoli/N. <popolo>.png`): nella Nascita dei popoli ogni capitolo con il suo ritratto (`Popolo — <popolo>.jpg`, campo `ritratto` del blocco), abbinato per nome. Manca il 4 (I Silvarri). Senza ritratto fra gli dèi: Valerus, Mortus, Il Senza Nome.
- Prova: 27 voci aperte da giocatore (niente Oblius, niente parte master, nessuna immagine rotta); `prova-tavolo.js` verde.

## v152 (07/10/2026) — via le leggende vecchie

- Giuseppe: togliere per ora le 11 voci vecchie di «Miti e leggende» (alcune mai dette né giocate; vanno riscritte da capo). Uscite da `comp/out/miti.json`, `compendio_all.json` e `COMPENDIO_DATA` con `Revisioni/Compendio - voci nuove v148/archivia-miti.py`; salvate intere in `_ARCHIVIO_2026-10-07/Miti e leggende vecchi (v152)/voci-vecchie.json` (registro). Erano: Canto della Fiamma Eterna, Il Sole fra le Due Lune, La Forgiatura e i Forgiati, Il Gigante Dormiente, La profezia delle Sei Ombre, La Vecchia Madre e la Fata Argentea, I lupàre e la stella a otto punte, Il sole rovesciato, San Berardo, Il Pozzo dell'Addio, Altre leggende del Ducato.
- La sezione «Divinità, miti e leggende» ha ora Le origini (Genesi) e Il Pantheon (21 schede). I collegamenti di altre voci verso le leggende tolte spariscono da soli (il sito mostra solo voci esistenti). Dentro c'erano anche fatti giocati (profezia delle Sei Ombre, Forgiatura, sole rovesciato): da recuperare quando Giuseppe le riscrive.
- `prova-tavolo.js` verde.

## v153 (07/10/2026) — consegna 3: i popoli di Ea

- Giuseppe: zip `Consegna 3 - i popoli.zip` (ora in `_ARCHIVIO_2026-10-07/Consegne (zip)/`), 19 pagine salvate in `03_Compendio/01 Il Mondo/I Popoli/<Titolo> — Compendio di Aprutium.html`: I popoli di Ea + 18 schede (umani, Aelvarri, Drukarri, Silvarri, mezzelfi, Roccaferrea, Duergar, gnomi, halfling, Brak, mezzorchi, Lucertoloidi, Giganti, Ogri, goblin, hobgoblin, gnoll, troll).
- **Voci**: `contenuti/popoli/<id>.json` (`popoli-di-ea`, `popolo-<nome>`), categoria nuova `popolo`, `sez:"popoli"`, gruppo «I popoli», `ordine` 1-19 (prima delle nazioni: i gruppi seguono l'`ordine` più basso). Da `converti.py` (lista `POP`). Riquadro in alto «… · in breve» (`riquadro:true`, come la scheda del dio ma senza ritratto: le pagine non hanno immagini, regola della consegna). Tabelle col blocco `tabella` (3 pubbliche nella voce di apertura, 1 master).
- **Collegamenti**: nei popoli un nome in grassetto che è il titolo di una voce (nazioni, province, Ducato, atlante, popoli, dèi), articolo a parte, diventa `[[Nome|id]]` (`collega` in `converti.py`); i nomi non in grassetto li collega già il sito (`c2LnkBuild`). Le voci delle nazioni NON sono state toccate.
- **Codice** (`Revisioni/Compendio - voci nuove v148/popoli.py`): `c2Voce` accetta `popolo`; `c2VoceTesta` disegna il riquadro; Popoli e Nazioni ha la linguetta «I popoli» (`C3_ALBERO.popoli`); l'iniziale delle schede senza immagine è maiuscola (`c3Tile`).
- Nessuna voce vecchia sulle razze nel Compendio: niente da archiviare. Corretto un dato concreto nella pagina degli umani (master): «Tutti e sette i personaggi giocanti» → «sei».
- **Contraddizioni con le voci delle nazioni** (per la consegna delle nazioni): `Revisioni/Compendio - voci nuove v148/contraddizioni-nazioni (consegna 3).md`. Le principali: Saladax elfi (sono Lucertoloidi), Elverio umana (è la patria degli Aelvarri), Thilmanor «elfi silvani» (Silvarri), Artefracta «gli ultimi» Aelvarri, Ducato «in cambio della Fede Solare», Sylva Noctis «non mandano più flotte» e Tessitori, Serarion prega Valerus (Maia), Oralin = Vallecava (Vallecava è gnoma, in Ovestalia), Tepotlanco segreta e Prima Incudine.
- Prova: 19 voci aperte da giocatore (nessuna parte master, 3 tabelle, 138 collegamenti) e da master (4 tabelle); `prova-tavolo.js` verde.
