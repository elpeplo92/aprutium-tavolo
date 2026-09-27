# Aprutium — il modello dei dati, domanda per domanda

Risposte alle quindici domande poste prima del refactoring. Tutto verificato leggendo
`src/tavolo.html` e `build.py` alla v74, non a memoria. Dove una cosa non l'ho verificata lo
dico. Nomi, numeri e campi sono quelli reali.

**Una correzione a `AVVENTURA.md`:** lì ho scritto che nebbia e punti d'interesse sono
indipendenti. È vero solo per lo svelamento. Per i giocatori un punto dentro la nebbia **non si
vede comunque**, anche se svelato (`poiVisible` controlla `fogVisible` prima di tutto). Il
master li vede sempre.

---

## 1. La scena come unità dati

Oggi una scena non è un oggetto solo. I dati di *Sotto Bëllindë* sono sparsi in sei posti
diversi dentro `src/tavolo.html`:

| Dove | Cosa contiene per «sotto» |
|---|---|
| `SCENES.sotto` | nome, immagine della mappa, larghezza 1448, altezza 1086, e quattro interruttori: griglia sì, nebbia sì, muri sì, token sì |
| `POIS` | gli undici punti, ma **senza dire a quale scena appartengono** |
| `POI_ORDER.sotto` | l'ordine di gioco, come elenco di identificativi |
| `SCENE_GUIDE.sotto` | sei identificativi di schede narrative |
| `SCENE_HANDOUTS` | le quaranta schede narrative di tutta la campagna, di cui sei usate qui |
| `DEFAULT_STATE.tokens` | i token di partenza, con coordinate valide solo su questa mappa |

A questi si aggiungono cose che la scena usa ma non dichiara: i muri e le porte (in
`DEFAULT_STATE.doors` e nello stato), la scala in metri per casella, e una regola nascosta —
`renderPois` disegna i punti **solo se la scena è `sotto`**, scritto a mano. Cioè: il legame fra
punti e scena non è un dato, è un `if` nel codice.

Nota su `SCENES.bellinde`: quella scena non ha punti d'interesse ma ha i quindici segnaposto dei
luoghi, che vengono da tutt'altra parte — sono generati da `build.py` a partire dai file JSON dei
luoghi che hanno il campo `segnaposto`. Quindi esistono già **due meccanismi diversi** per mettere
segni su una mappa, e uno dei due è già data-driven.

---

## 2. Le quattro liste, nomi reali

**`POIS`** — array di 11 oggetti. Campi effettivamente usati: `id`, `kind`, `x`, `y`, `title`,
`text` (il testo da leggere), `gm` (note del master), `img`, `skill`, `dc`, `ok`, `ko`. Nel
codice ci sono anche `spot`, `spotDc` e `segreta`, previsti dalle funzioni ma **non usati da
nessuno dei punti attuali**: il valore predefinito è Percezione CD 13. Letto da: `renderPois`
(la mappa), `openPoi` (la scheda), `renderGuide` (il copione), `poiCheckReveal` (lo svelamento
automatico).

**`POI_ORDER`** — un oggetto con una sola chiave, `sotto`, il cui valore è la lista degli undici
`id` nell'ordine di gioco: pozzo, murata_crollata, intercapedine, solchi, linea, rilievi, catene,
memorie, micuccio, sigillo, murata. Letto solo da `renderGuide`. Se un `id` qui non esiste in
`POIS` viene silenziosamente saltato; se un punto esiste in `POIS` ma manca qui, **non compare
nella Guida** pur essendo sulla mappa.

**`SCENE_HANDOUTS`** — array di 40 oggetti con quattro campi: `id`, `title`, `intro`, `secs`
(elenco di sezioni `{l, t, txt}`, dove `l` è il livello di titolo). Sono gli handout narrativi
convertiti da Roll20.

**`SCENE_GUIDE`** — oggetto con due chiavi, `sotto` e `bellinde`, che elencano quali `id` di
`SCENE_HANDOUTS` mostrare in quella scena e in quale ordine. `bellinde` ne elenca una ventina,
`sotto` sei.

Gli identificativi sono stringhe senza spazi né accenti, ricavate dal titolo
(`scenalaportamurata`). Non c'è nessun controllo che colleghino qualcosa di esistente.

---

## 3. Coordinate e `poiPos`

**Formato.** Numeri interi in pixel dell'immagine della mappa. Origine in alto a sinistra.
Sistema di riferimento: l'immagine stessa, 1448 × 1086 per Sotto Bëllindë. I punti vanno da
x=255 a x=1275, y=105 a y=795.

**Come arrivano a schermo.** I punti sono `div` posizionati con `left` e `top` in pixel dentro un
contenitore (`#world`) su cui viene applicata una trasformazione unica: spostamento e
ingrandimento (`translate(...) scale(k)`). Quindi le coordinate non vengono mai ricalcolate: è il
contenitore intero a muoversi. Stessa cosa per token, nebbia, muri e griglia, che sono tutti
figli dello stesso contenitore e usano lo stesso sistema.

**Il trascinamento.** Il master trascina un punto; al rilascio viene scritto
`S.poiPos[id] = {x, y}` in Firebase. Il disegno legge `(S.poiPos||{})[p.id] || p`: **se esiste
l'override vince, sempre**, senza nessuna traccia visibile del fatto che il punto è stato spostato
rispetto al file. Non c'è modo di tornare al valore originale se non cancellando la chiave dal
database.

**Se cambi la risoluzione della mappa.** Se raddoppi l'immagine mantenendo le proporzioni e
aggiorni `w` e `h` nella scena, si rompe **tutto ciò che è scritto in pixel**: le coordinate dei
punti in `POIS`, gli `S.poiPos` in Firebase, le posizioni dei token (in `DEFAULT_STATE` e nello
stato salvato), i muri e le porte, tutte le operazioni della nebbia già fatte, i quindici
segnaposto dei luoghi di Bëllindë, e la dimensione della casella della griglia (`S.grid.size`,
oggi 30 px). Non si rompono le proporzioni dello zoom e la funzione `fit`, che si adattano da
sole leggendo `w` e `h`.

In pratica: cambiare la mappa oggi significa rifare a mano la posizione di ogni cosa. È il motivo
per cui la mappa a risoluzione doppia, pur essendo stata chiesta, non è mai stata messa.

---

## 4. Cronaca contro progettazione

Cinque esempi reali, presi dalle note del master dei punti. **Nessuno di questi viene
interpretato dal codice**: sono testo libero mostrato al master e basta. La distinzione è
semantica, non tecnica.

1. **`intercapedine`** — «RULING (sessione set 2026) — vecchia intercapedine di servizio.» Qui
   c'è sia cronaca (una decisione presa quella sera) sia progettazione (dove porta il passaggio,
   che è permanente).
2. **`murata_crollata`** — «Aperta nella sessione di settembre.» Cronaca pura: descrive lo stato
   del mondo dopo un fatto avvenuto. Se qualcuno rigiocasse il dungeon da capo sarebbe falsa.
3. **`murata_crollata`**, subito dopo — «ALLINEATI (già pronunciato: Mattheus ha resistito, gli
   altri tre un passo sui solchi), poi AVANTI. Prossimo: FERMI.» Questo è il caso peggiore: è un
   **segnalibro**, dice a che punto della sequenza siete rimasti. È stato della partita scritto
   dentro il contenuto.
4. **`pozzo`** — «I pioli nuovi: qualcuno è sceso di recente (Rocco).» Progettazione travestita
   da cronaca: è un indizio previsto dall'autore, non un fatto accaduto al tavolo. Va tenuto.
5. **`linea`** — «Rivelali qui. Maximus riconosce la formazione senza tiri.» Regia, terza
   categoria: non è né avventura né cronaca, è un'istruzione al master su cosa fare. Nominarla a
   parte eviterebbe di doverla incastrare in una delle due.

Il resto delle note (`solchi`, `rilievi`, `catene`, `memorie`, `micuccio`, `sigillo`) è
progettazione pulita: regole della situazione, CD, soluzioni previste.

---

## 5. Precedenza fra file e Firebase

L'elenco completo del Compendio si costruisce così, in quest'ordine:

1. **`COMPENDIO_BASE`** — le voci statiche, generate da `build.py` dai file di `contenuti/` più
   il vecchio `COMPENDIO_DATA` incorporato (375 voci: 134 personaggi, 107 luoghi, 37 quest, 27
   oggetti, 22 fazioni, 18 miti, 16 diario, 8 crociata, 6 naviganti).
2. **`S.comp2`** — le voci create dal master, **aggiunte in coda** come voci nuove.
3. Le vecchie note del tavolo (`S.comp`), ma solo quelle il cui titolo normalizzato non esiste
   già ai punti 1 e 2.

Poi, su ogni voce, si applica l'override: `Object.assign({}, voce, S.compOv[voce.id])`. Cioè i
campi presenti in `compOv` **sostituiscono** quelli del file, campo per campo, e l'aggancio è
l'**identificativo**, non il titolo.

Conseguenze, che sono la risposta secca alla domanda:

- **Se cambia l'identificativo di un file**, l'override resta in Firebase agganciato a un id che
  non esiste più: diventa invisibile e inerte, e la voce ricompare com'era nel file. La modifica
  del master sparisce senza messaggi.
- **Se cambia il titolo ma non l'identificativo**, l'override continua ad applicarsi. Se
  l'override conteneva a sua volta un titolo, vince quello vecchio.
- **Se cambia il `parent`**, l'override lo sovrascrive se lo contiene, e la voce può finire
  sotto un genitore che non esiste più: nell'albero del Compendio si perde.
- Una voce di `comp2` che parla della stessa cosa di una voce dei file **non viene riconosciuta
  come duplicato**: la deduplica per titolo esiste solo verso il vecchio `S.comp`, non fra base e
  `comp2`. Quindi si vedono due schede della stessa cosa.

Vale la pena dirlo chiaro: è lo stesso difetto delle coordinate. Due fonti, nessuna regola, e chi
guarda non se ne accorge.

---

## 6. Ciclo di vita di un punto d'interesse

Cosa è **contenuto** (sta nel file, non cambia giocando): `id`, `kind`, `title`, `text`, `gm`,
`img`, `skill`, `dc`, `ok`, `ko`, `spot`, `spotDc`, `segreta`, e oggi anche `x`/`y`.

Cosa è **stato della partita** (sta in Firebase): `S.poiRev[id]` (svelato sì/no), `S.poiPos[id]`
(spostato), e la richiesta di prova in corso `S.request` con dentro `poi: <id>`.

Il ciclo:

1. Il punto è definito nell'array. Il master lo vede sempre, con l'icona vera; se non è svelato
   ha l'anello tratteggiato.
2. Per il giocatore la prima domanda è la nebbia: se il punto è coperto, non esiste. Poi il tipo:
   se è **nascosto** (trappola, dettaglio, porta segreta) non compare finché non è svelato. Se non
   è nascosto compare **come «?»**, subito, senza bisogno che il master faccia nulla.
3. Il master chiede la prova per notarlo: si imposta `S.request` con abilità, CD e `poi`.
4. Il giocatore tira. In `doRoll` (o `rollFor`, se tira il master per lui) viene chiamata
   `poiCheckReveal(totale)`: se il totale raggiunge la CD, `S.poiRev[id]` diventa vero e il
   Registro scrive «Svelato: …».
5. Il salvataggio va su Firebase, tutti gli schermi ricevono il nuovo stato e ridisegnano.
6. Da svelato in poi, il giocatore vede **l'icona vera** invece del «?» e aprendo il punto legge
   il testo. Prima leggeva solo «Qualcosa, qui — il master vi dirà cosa vedete».

Il master può sempre forzare con «Svela / Nascondi», e nascondere di nuovo funziona (cancella la
chiave).

---

## 7. Come funziona la Guida

Legge **direttamente `POIS`**, senza strutture intermedie: prende `POI_ORDER[scena]`, e per ogni
identificativo cerca il punto corrispondente. Da lì costruisce la scheda con numero progressivo,
icona del tipo, titolo, stato, testo da leggere, note del master, prova.

I pulsanti sono **tutti generici**, nessuno è scritto caso per caso:

- «Vai sulla mappa» chiama `centerOn(x, y)` con le coordinate del punto (tenendo conto
  dell'override).
- «Apri» chiama `openPoi`.
- «Chiedi Percezione al gruppo» compare **solo se il punto è di tipo nascosto** e crea la
  richiesta con `poi`.
- «Chiedi ⟨abilità⟩ al gruppo» compare **solo se il punto ha `skill`** e usa quell'abilità e
  quella CD.
- «Svela / Nascondi» chiama `poiReveal`.

Sotto, le schede narrative da `SCENE_GUIDE[scena]`.

La chiave di ridisegno della Guida include l'elenco dei punti svelati, così si aggiorna da sola
quando qualcosa cambia.

---

## 8. Scheda narrativa contro punto d'interesse

Sono cose diverse per natura, non per campo.

Un **punto** è legato a un posto: ha coordinate, un'icona sulla mappa, una visibilità, una prova,
uno stato svelato/nascosto. Esempio: *Le catene* — sta lì, a quelle coordinate, e quando ci
arrivi succede qualcosa.

Una **scheda narrativa** non ha posto né stato: è un testo lungo strutturato in sezioni, che il
master legge quando serve. Esempio, nella stessa scena: *SCENA — L'Ultimo Custode*, *TRANSIZIONE
— La discesa*, *AFTERMATH — Ritorno alla luce*. L'ultima non è legata a nessun punto della mappa:
è cosa succede **dopo**, quando risalgono in paese.

Quindi sì, **esistono benissimo senza punti** — le venti di Bëllindë non hanno punti affatto,
perché quella scena non ne ha. E oggi **nessun punto ne possiede una**: il collegamento non
esiste come dato, sono due elenchi paralleli che il master tiene insieme con la testa. Se
volessimo dire «questa scheda appartiene a questo punto» non c'è campo per farlo.

---

## 9. Le scene

`SCENES` è un oggetto con due voci fisse. I campi: `id`, `name`, `src` (l'immagine), `w`, `h`, e
quattro interruttori — `grid`, `fog`, `walls`, `tokens`. Quest'ultimo ha tre valori: `true`
(tutti i token), `'party'` (solo il gruppo), `false` (nessuno).

Esiste un terzo tipo non dichiarato in `SCENES`: la scena-luogo. Non è un dato, è costruita al
volo dalla funzione `sceneOf` quando la chiave comincia per `luogo:`, e restituisce un oggetto
finto con `id:'luogo'` e il luogo dentro. Quelle sì che **sono già derivate dai contenuti**: sono
i quindici luoghi di Bëllindë che arrivano dai file JSON.

Cosa determina il resto: se la scena è una mappa si mostrano mondo, zoom, strumenti e barra in
basso; se è un luogo si nascondono tutti. Gli strumenti del dungeon (nebbia, muri, bestiario)
sono marcati in pagina con la classe `dungeon-only` e si mostrano **solo se la scena è `sotto`**,
controllo scritto a mano. Anche i punti d'interesse, come detto, compaiono solo lì.

Quindi: due scene sono codice, quindici sono già contenuto, e le regole su cosa mostrare in quale
scena sono metà dati (gli interruttori) e metà `if` sul nome della scena.

---

## 10. I personaggi non giocanti

Stanno in **due posti diversi che non si parlano**.

`PNGS` è un array dentro `tavolo.html` con **31 voci**, campi `id`, `name`, `img`, `descr`,
`fields` (coppie chiave/valore: Ruolo, Età, Statistiche…), `secs` (sezioni di testo). Serve alle
schede rapide e ai collegamenti `[PNG — Nome]` dentro i testi, che cercano per identificativo o
per nome normalizzato.

Il **Compendio** ha invece **134 voci di categoria `png`**, con la struttura standard delle voci
(pub/gm, stato, immagine, collegamenti). Queste vengono in parte dai file di `contenuti/` e in
parte dal blocco `COMPENDIO_DATA` incorporato nel sorgente.

Non c'è nessuna garanzia che le 31 e le 134 siano coerenti: stessa persona, due schede, formati
diversi. È un doppione da risolvere prima o durante l'estrazione, non dopo.

---

## 11. Il bestiario

Dieci creature. Campi: `id`, `name`, `short` (la lettera sul token), `color`, `hp`, `ac`, `init`,
`size`, `actions`, `note`, `src` (da quale avventura viene), `tac` (tattica, testo per il master),
`lines` (battute da dire), `noInit`.

Le azioni: `{n: nome, atk: bonus, dmg: 'formula'}`. Un'azione senza `atk` e senza `dmg` (per
esempio «Spinta con lo scudo (Atletica +4)») è solo una voce nel Registro.

**Cosa è contenuto puro e può uscire dal codice senza inventare nulla:** tutti i campi qui sopra.
Il tavolo sa già interpretarli: tira `1d20 + atk` contro la classe armatura, tira la formula del
danno, raddoppia i dadi sul 20, sottrae i punti ferita. Non serve nessun motore nuovo.

**Cosa invece oggi è solo testo che il master legge:** le immunità, la formazione dell'Armigero
(«con almeno tre adiacenti, +2 alla classe armatura e +1d4 ai danni»), la resistenza, le azioni
leggendarie del Custode, il fatto che il Pilone sia un oggetto. Il campo `noInit` è l'unica di
queste regole che il codice esegue davvero. Tutto il resto lo applica il master a mano.

Questo è il confine da tenere: il bestiario può diventare contenuto **oggi**, purché si accetti
che le regole particolari restano testo. Farle eseguire al tavolo è un altro progetto.

---

## 12. Le azioni dei personaggi

La catena è questa:

1. La fonte vera sono le schede dei sei giocatori, che Giuseppe ha compilato.
2. `SHEETS`, dentro `tavolo.html`, contiene i dati di scheda: caratteristiche, bonus di
   competenza, abilità, velocità, equipaggiamento, talenti, privilegi, incantesimi, slot, CD e
   bonus di attacco magico. Circa 6,7 KB.
3. Uno script esterno, `scarica/azioni_v64.py`, prende `SHEETS` più le regole D&D 2024 e genera
   l'elenco delle azioni di ogni personaggio.
4. Quell'elenco viene **incollato dentro `DEFAULT_STATE.tokens[pg].actions`**, sempre in
   `tavolo.html`. Oggi: Alessandros 16 azioni, Adamus 19, Luigis 13, Mattheus 25, Maximus 14,
   Vicarus 21.
5. Ogni azione è `{n, tipo, eco, atk?, dmg?, note?}`: nome, tipo (mischia, distanza, incantesimo,
   cura, speciale), economia (azione, bonus, reazione, gratuita), bonus d'attacco, danno, nota.

Dove si perde la separazione: **al punto 4**. Lo script è la fonte, ma il risultato viene
congelato nel file di programma, e da quel momento i due possono divergere senza che nessuno se
ne accorga. Peggio: `DEFAULT_STATE` è anche lo stato iniziale della partita, quindi le azioni
vivono dentro una struttura che è metà contenuto (la scheda) e metà stato (punti ferita,
posizione sulla mappa, iniziativa). E lo script non sta nemmeno nel repository: sta nella mia
cartella di lavoro. Questo è un problema di consegna, e va risolto copiandolo nel progetto.

---

## 13. Cosa fa `build.py`

Ha tre modalità. Quella normale (`python build.py`) fa due cose in fila.

**Primo, `contenuti()`.** Legge il campo `COMP_IMG` dal sorgente e lo unisce a
`contenuti/_immagini.json`, ottenendo la tabella nome leggibile → file. Poi scorre **ogni
sottocartella di `contenuti/`** e ogni file `.json` dentro, saltando quelli che cominciano con
`_`. Per ciascuno: **verifica che l'identificativo sia uguale al nome del file** (è un `assert`,
si ferma se non lo è), traduce lo schema italiano nella forma che usa il tavolo, risolve i nomi
delle immagini (se un nome non si risolve lo segnala e lo lascia vuoto: non inventa), ordina
tutto con una chiave complessa (mondo prima dei luoghi, città, numero di zona, quartiere prima
dei suoi luoghi, poi ordine naturale del titolo) e riscrive il blocco `CONTENUTI_DATA` dentro
`src/tavolo.html`. Poi, dai soli luoghi che hanno il campo `segnaposto`, genera l'array `LUOGHI`
— i quindici segni sulla mappa di Bëllindë — e riscrive anche quel blocco.

**Secondo, `build()`.** Copia il sorgente in `index.html`, legge il numero di versione e verifica
che **ogni file citato come `img/...` esista davvero**; se ne manca anche uno stampa l'elenco ed
esce con errore.

Le altre due modalità (`--inline` incorpora le immagini in un file unico, `--extract` fa
l'inverso) sono storiche.

**La risposta alla domanda che interessa:** il ciclo su `contenuti/` è **generico**. Una cartella
nuova, per esempio `contenuti/scene/`, verrebbe letta e incorporata **senza toccare `build.py`**,
purché i file abbiano `id` uguale al nome del file e un campo `cat`. Le voci finirebbero in
`CONTENUTI_DATA` e la categoria in `CONTENUTI_CATS`. Quello che `build.py` **non** sa ancora fare
è generare array dedicati come fa per `LUOGHI`: per avere un `POIS` o uno `SCENES` costruiti dai
file serve aggiungere una funzione sul modello di `_luoghi_tavolo`, che è lunga una ventina di
righe. È il pezzo di lavoro più piccolo di tutto il refactoring.

---

## 14. Controlli che esistono già

Tre, e sono più utili di quanto sembri.

`build.py` **verifica che l'identificativo sia il nome del file** (assert, blocca), **segnala le
immagini non risolte** (avvisa, non blocca) e **verifica che i file immagine esistano** (blocca
ed esce con errore 1).

`build.py` inoltre **stampa già i conteggi per categoria** a ogni esecuzione, più il numero dei
segnaposto di Bëllindë. Cioè: un confronto prima/dopo dei contenuti si può fare **oggi, senza
scrivere niente di nuovo**, salvando quella riga prima e dopo.

`strumenti/prova-tavolo.js` preme tutti i comandi nei due ruoli dopo aver simulato il giro su
Firebase. Verifica che niente vada in errore. **Non conta i contenuti e non verifica i
collegamenti.**

Cosa si può già contare senza inventare un impianto nuovo, leggendo il sorgente costruito:
numero di punti in `POIS` e loro identificativi; numero e ordine in `POI_ORDER`; numero di scene;
numero di schede in `SCENE_HANDOUTS` e quali sono elencate in `SCENE_GUIDE`; numero di voci in
`CONTENUTI_DATA` per categoria; numero di voci in `COMPENDIO_DATA` per categoria; numero di
`LUOGHI`; numero di creature nel bestiario; numero di azioni per personaggio. Un confronto
prima/dopo di questi nove numeri, più l'elenco degli identificativi, è sufficiente a dimostrare
che l'estrazione non ha perso nulla. Sono venti righe di script.

---

## 15. Le dieci regressioni più probabili

In ordine di quanto sono facili da introdurre.

1. **Un punto sparisce dalla Guida ma resta sulla mappa** (o viceversa), perché l'ordine e
   l'elenco si sono separati. Oggi succede già in silenzio: nessuno controlla che i due
   combacino.
2. **Le coordinate.** Qualunque cosa le tocchi — normalizzazione, cambio di formato, spostamento
   su file — deve fare i conti con gli `S.poiPos` già presenti in Firebase, che oggi sono in
   pixel e vincono sempre. Se si cambia formato senza convertirli, i punti spostati finiscono in
   angoli assurdi della mappa.
3. **`S.poiRev` rimane agganciato ai vecchi identificativi.** Se un punto cambia `id` durante
   l'estrazione, quello che era svelato torna nascosto — e in mezzo a una sessione è un danno
   visibile ai giocatori.
4. **Le liste vuote di Firebase.** Qualunque campo nuovo che sia una lista o un oggetto va
   aggiunto alla funzione che ricostruisce la forma dello stato, altrimenti sparisce al primo
   salvataggio e il codice che ci cicla sopra va in errore. È già costato tredici comandi morti.
5. **Il guasto muto.** Un errore dentro una funzione di disegno non stampa niente e lascia
   l'interfaccia apparentemente viva. La prova automatica esiste per questo, ma va lanciata.
6. **Gli apostrofi e le virgolette.** I testi sono pieni di apostrofi tipografici e di «…».
   Passando da stringhe JavaScript a JSON è facile rompere una stringa o perdere gli a capo.
   Vanno confrontati i testi carattere per carattere, non a occhio.
7. **Il legame scena–punti nascosto in un `if`.** Chi estrae deve ricordarsi che oggi i punti si
   disegnano solo se la scena è `sotto`, e che gli strumenti del dungeon dipendono dalla stessa
   condizione scritta a mano. Se si rende tutto generico senza guardare quelle righe, compaiono
   punti e strumenti dove non devono.
8. **L'ordine di caricamento.** `build.py` riscrive blocchi delimitati da marcatori dentro il
   sorgente. Se una struttura nuova viene generata in un punto del file dopo il codice che la
   usa, la pagina va in errore all'avvio. Va rispettato l'ordine dei blocchi esistenti.
9. **L'immagine della mappa.** Oggi il percorso sta in una costante del sorgente. Spostandolo nei
   contenuti va fatto passare dalla tabella dei nomi leggibili, altrimenti `build.py` non trova
   il file e blocca la pubblicazione, oppure la mappa resta bianca.
10. **La ridisegnata della Guida.** Ha una chiave di aggiornamento che include i punti svelati.
    Se cambia la struttura e la chiave non viene aggiornata, la Guida smette di reagire agli
    svelamenti e il master vede dati vecchi senza accorgersene.

Una cosa in più, che non è una regressione ma la eviterebbe quasi tutta: questa estrazione si può
fare **una scena per volta**. Sotto Bëllindë ha undici punti e sei schede; è piccola abbastanza da
poter essere confrontata a mano, riga per riga, prima e dopo. Non c'è nessun motivo per muovere
tutto insieme.
