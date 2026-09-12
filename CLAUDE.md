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
