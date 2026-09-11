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
| `comp/data7.js` | Dati del Compendio (`COMPENDIO_DATA`, 375 voci + `COMP_IMG`) già inclusi in tavolo.html. Rigenerato da `comp/out/*.json`. |
| `comp/out/*.json` | Voci del Compendio per città/categoria (julianova, mushane, bellinde, fazioni, miti, oggetti, crociata, quest, diario). Schema in `comp/SCHEMA.md`. |
| `stato/stato_fb.json` | Snapshot dello stato di gioco caricato in Firebase `partita/stato` (token, log, override). |
| `sessioni/` | Diario dell'ultimo Atto (XVI) e log della sessione. La copia "ufficiale" è nel Progetto. |
| `strumenti/PUBBLICA-TAVOLO.bat` | Pubblicazione manuale dal PC di Giuseppe (piano B, vedi sotto). |
| `.nojekyll` | Obbligatorio per GitHub Pages (serve i file così come sono). |

## Come si pubblica una nuova versione (procedura standard)

1. Modifica `src/tavolo.html`.
2. Alza il numero di versione: cerca `title="Versione della pagina">v44</span>` → v45, ecc.
   Una versione per ogni pubblicazione, sempre. Giuseppe controlla il numero in alto a destra
   nella pagina per capire se vede quella nuova (i browser fanno cache).
3. `python3 build.py` → deve stampare "ok: ... versione vNN ... immagini usate" senza MANCANTI.
4. Prova la pagina: apri `index.html` con Playwright/Chromium headless, controlla che non ci siano
   errori in console e che compaiano la mappa e i token. Non pubblicare mai senza una prova.
5. `git add -A && git commit -m "v45: cosa è cambiato" && git push origin main`.
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
- La pagina scrive/legge un solo documento: `partita/stato` (JSON con `tokens`, `log`, `poiPos`,
  `compOv`, `comp2`, `inv`, ecc.). Funzioni chiave in tavolo.html: `fbConnect()`, `fbMasterLogin()`,
  l'adapter espone `db.doc(path).get/set/onSnapshot` come il vecchio db degli artifact.
- Chi apre il sito sceglie: "Sono il Master" (chiede la password) o "Sono un giocatore"
  (anonimo). `?ruolo=vicarus` ecc. forza il personaggio.
- Per cambiare lo stato di gioco senza passare dalla pagina: Giuseppe può darti accesso alla
  console Firebase dal suo Chrome (Claude in Chrome) oppure aggiornare `stato/stato_fb.json` qui e
  caricarlo dalla pagina stessa via `javascript_tool` (`firebase.database().ref('partita/stato').set(...)`).
  Le chiamate dirette a googleapis/firebaseio dal container Claude sono bloccate dalla rete.

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
- Mappa attuale: Bëllindë. I POI sono trascinabili dal master (`S.poiPos`).

## Come lavora Giuseppe

Diretto, frasi corte, niente gergo; vuole la raccomandazione prima del ragionamento e niente
"opzioni a menù". Se sta per fare un errore diglielo subito. Lavora no stop: non proporre pause.
Non conosce git/Firebase/GitHub: non chiedergli operazioni tecniche se puoi farle tu; se proprio
servono, una sola istruzione per volta, con lo screenshot in mente. Quando gli riporti un lavoro:
numero di versione, cosa è cambiato, cosa deve controllare lui. Basta.
