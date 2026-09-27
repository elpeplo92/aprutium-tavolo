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
| `src/ext*_ui.js`, `src/poi_imgs.js` | Storico dei moduli già integrati in tavolo.html (ext6 = Gobbo, ext7 = Compendio v2). Solo riferimento. |
| `contenuti/mondo/*.json` | **FONTE UNICA della sezione "Il Mondo di Ea"** (v45; chiavi in forma tavolo, non ancora tradotte allo schema italiano): un file per voce — atlante, 28 nazioni + Terre Neutrali, 10 province, Ducato, 8 contee, 43 borghi. Schema: `id` (= nome file), `cat:"mondo"`, `livello` (atlante/nazione/provincia/ducato/contea/borgo), `parent`, `group`, `title`, `sub`, `img` e `mappa` (NOME LEGGIBILE dell'immagine, es. `Mappa di Teramum.jpg`), `colore` (tinta della scheda senza immagine), `scheda` (coppie chiave/valore), `state`, `pub`, `gm`, `atti`, `links`, `tag`, `tavolo` (scena da aprire). **Si modificano QUESTI file, non il blocco nel sorgente.** |
| `contenuti/luoghi/*.json` | **FONTE UNICA dei Luoghi** (v49, riordinati v52-53): 98 file — Julia Nova 61 (15 quartieri + 46 luoghi), Mushanè 22, Bëllindë 15. Schema del doc "Formato dei contenuti" (chiavi italiane): `id`, `tipo:"luogo"`, `titolo`, `sottotitolo`, `citta`, `gruppo`, `livello` (quartiere/luogo), `parent` (id del quartiere o del borgo del Mondo: `borgo-giglie`, `borgo-mushane`, `borgo-bellinde`), `img` (nome leggibile `Luogo — <titolo>.jpg`), `mappa` (immagine della mappa, solo i 15 quartieri), `stato`, `atti`, `scheda`, `pub` e `gm` (ELENCHI di blocchi `{t,txt}`), `prove` (`{t,skill,dc,ok,ko}`), `links`, `tavolo`, `segnaposto` (`{scena:"bellinde",id:"l1",num,x,y}` — solo i 15 di Bëllindë). `build.py` li traduce nella forma del tavolo (`_runtime`) e dai 15 con segnaposto genera anche l'array `LUOGHI` (handout a doppia sezione sulla mappa): **una cosa, un file**. |
| `contenuti/scene/*.json` | **FONTE UNICA delle scene-mappa** (v102): un file per scena (`sotto`, `bellinde`). `id` (= nome file = `S.scene`), `nome`, `menu` (voce del menu Scena), `ordine`, `mappa` {`img`, `larghezza`, `altezza`, `griglia`, `muri` (maschera: una stringa per riga di caselle da 30px, `1` = calpestabile)}, `regole` {`nebbia`, `muri`, `token`: tutti/gruppo/nessuno, `strumentiDungeon`, `segnaposto` (i segnaposto dei Luoghi)}, `punti` (i PDI **già in ordine di gioco**: l'ordine del file è l'ordine della Guida), `guida` (id di `SCENE_HANDOUTS`). `build.py` li controlla e li scrive nel blocco `/*@SCENE*/const SCENE_DATA=…/*@/SCENE*/`; `SCENES`, `POIS`, `POI_ORDER`, `SCENE_GUIDE`, `MASK` sono derivati da lì. **Mai cambiare gli `id` di scene e punti**: sono le chiavi di `S.scene`, `S.poiPos`, `S.poiRev` su Firebase. |
| `contenuti/_immagini.json` | Nome leggibile → `img/xxx.jpg` (locale, definitivo) oppure URL `https://d8j0ntlcm91z4.cloudfront.net/...` (provvisorio: render Higgsfield). Vale per tutte le categorie (Mondo e Luoghi). `c2Img` e `build.py` accettano `img/...` e `http(s)://...`. Al 12/09/2026 (v50): Mondo 47 locali + 45 URL; Luoghi 107 URL. Le immagini definitive le fornisce Giuseppe in `7_Aprutium/05_Immagini/Immagini Compendio - Il mondo/` (nomi `Nazione - X.jpg`, `Provincia - X.jpg`, `Contea - X.jpg`, `Borgo - X.jpg`, `Luogo - X.jpg`) oppure le scarica con `Sito/SCARICA-IMMAGINI-MONDO.bat` / `SCARICA-IMMAGINI-LUOGHI.bat`; Claude le riduce (1920 px, jpg q85), nome md5, le scrive in `Sito/img/` con `device_commit_files` (≤20 MB a file, ≤100 MB a chiamata; le immagini NON vanno nel tgz) e cambia SOLO questa tabella. Le mappe (`mappa`) sono export Azgaar o mappe dei quartieri: non si rigenerano. |
| `comp/data7.js` | Dati del Compendio (`COMPENDIO_DATA`, 375 voci + `COMP_IMG`) già inclusi in tavolo.html. Rigenerato da `comp/out/*.json`. |
| `comp/out/*.json` | Voci del Compendio per città/categoria (julianova, mushane, bellinde, fazioni, miti, oggetti, crociata, quest, diario). Schema in `comp/SCHEMA.md`. |
| `stato/stato_fb.json` | Snapshot dello stato di gioco caricato in Firebase `partita/stato` (token, log, override). |
| `sessioni/` | Diario dell'ultimo Atto (XVI) e log della sessione. La copia "ufficiale" è nel Progetto. |
| `strumenti/prova-tavolo.js` | **La prova da lanciare prima di ogni pubblicazione.** `node strumenti/prova-tavolo.js` (oppure su `src/tavolo.html`). Preme tutti i bottoni nei due ruoli dopo aver simulato il giro dei dati su Firebase. |
| `strumenti/PUBBLICA-TAVOLO.bat` | Pubblicazione manuale dal PC di Giuseppe (piano B, vedi sotto). |
| `.nojekyll` | Obbligatorio per GitHub Pages (serve i file così come sono). |

## Come si struttura un luogo (regola di Giuseppe, 12/09/2026)

Ogni città del Compendio si costruisce a livelli, dall'alto in basso, e ogni livello ha **due immagini**:
`img` (l'illustrazione: com'è visto) e `mappa` (la mappa VTT: dove stanno le cose). Modello: la cartella
`7_Aprutium/05_Immagini/Mappe - Bëllindë/`.

1. **La città** (voce del Mondo, `borgo-*`): `img` = veduta della città (`Julia Nova - veduta della città.png`,
   `Bëllindë - veduta del borgo.jpg`); `mappa` = mappa VTT della città con i punti d'interesse numerati
   (`Julia Nova - mappa con i punti d'interesse.png`; per Bëllindë la mappa illustrata del borgo, che è anche la scena del tavolo).
2. **I quartieri** (solo se la città è grande: Julia Nova ne ha 15, `livello: quartiere`): `img` = illustrazione del
   quartiere; `mappa` = mappa VTT del quartiere (`Q-NN … (dettaglio).png`).
3. **I luoghi** dentro i quartieri (o direttamente sotto la città, se è piccola come Bëllindë e Mushanè):
   `img` = illustrazione del luogo (`LUOGO - <nome>.png`); `mappa` = mappa VTT del luogo, quando esiste.

Le immagini le fa Giuseppe (Midjourney) e le mette in `05_Immagini/Mappe - <Città>/` con questi nomi; il nome del
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

Piano B se il push da qui non funziona: crea `aprutium-tavolo-site-vNN.tgz` con `index.html`,
`img/`, `.nojekyll`, `src/`, `build.py`, `CLAUDE.md`, `comp/`, `stato/`, `sessioni/`, `strumenti/`;
consegnalo nella cartella `7_Aprutium/_tavolo_tmp/` sul PC di Giuseppe (SEMPRE con nome nuovo:
sovrascrivere un file esistente lì fallisce in silenzio) e lui fa doppio click su
`7_Aprutium/Sito/PUBBLICA-TAVOLO.bat` (prende il tgz più recente, scompatta, `git push --force`).

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
- `AVVENTURA.md`, `MODELLO-DATI.md`, `CONFINI-E-CONSEGNA.md`, `INTERFACCIA.md` descrivono la v74: la parte «la scena come unità dati» è superata da questa versione.

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
