# Aprutium — come funziona il tavolo e perché

Documento di consegna. Serve a chi non ha mai visto Aprutium e deve poterne discutere con
Giuseppe senza fargli rispiegare le decisioni degli ultimi mesi. Racconta **cosa esiste e cosa
abbiamo deciso**, non cosa si potrebbe fare. Le proposte stanno altrove.

Compagno di `CLAUDE.md`, che è invece il diario tecnico versione per versione (v55 → v74) e
spiega *com'è costruito* il software. Qui si spiega *come si gioca* e *come è organizzato il
contenuto*. Scritto il 15 settembre 2026, allineato alla v74.

---

## 1. La filosofia del tavolo

Fino ad agosto 2026 la campagna girava su Roll20. Il tavolo nuovo
(`https://elpeplo92.github.io/aprutium-tavolo/`) nasce per togliere tre difetti precisi di
Roll20, non per rifarlo meglio in generale.

**Primo difetto: la mappa e il racconto sono due oggetti separati.** In Roll20 la mappa sta sul
tavolo e il testo sta negli handout del Journal, che si aprono *sopra* la mappa in finestre che
si accavallano. Il master, mentre gioca, salta continuamente fra i due. Nel tavolo nuovo la
scena contiene tutto: lo spazio, i personaggi, i punti d'interesse, le informazioni e gli
strumenti del master convivono nella stessa schermata.

**Secondo difetto: la doppia preparazione.** In Roll20 Giuseppe scriveva l'avventura fuori, poi
la ricaricava dentro: creare handout, incollare testi, caricare immagini, disporre token,
collegare tutto a mano. Lavoro fatto due volte. L'obiettivo dichiarato del tavolo nuovo è che
l'avventura scritta *sia già* l'avventura giocabile.

**Terzo difetto: l'estetica bloccata.** Roll20 ha una faccia sola e si modifica poco. Qui la
resa grafica è parte del progetto: font dei manuali D&D, palette blu notte e oro, caratteri
grandi. Per Giuseppe non è un vezzo: il tavolo si guarda per quattro ore di fila.

### Il vocabolario, che non coincide con quello di Roll20

Sono cinque parole diverse, e confonderle porta a proporre cose sbagliate.

**Scena** — quello che è aperto adesso sul tavolo, uguale per tutti. Cambiando scena cambia
quello che vedono i sei giocatori. È l'unità di navigazione.

**Mappa** — l'immagine di fondo di una scena, quando la scena ne ha una. Non tutte le scene
sono mappe.

**Luogo** — una voce di contenuto: la Piazza Grande, la Locanda, la Rocca. Ha descrizione,
scheda, prove, immagine. Un luogo *può* essere aperto come scena, ma esiste anche quando non lo
è: sta nel Compendio, i giocatori possono consultarlo, si collega ad altri luoghi e ai PNG.

**Punto d'interesse (PDI)** — un segno su una mappa VTT, in un punto preciso. È il cuore del
sistema e non ha equivalente in Roll20. Ne parla per esteso la sezione 4.

**Handout** — parola da abbandonare. In Roll20 era l'oggetto con due sezioni (Description
visibile, GM Notes riservata) più un'immagine. Quella struttura non è sparita, si è divisa:
la parte pubblica è diventata i blocchi `pub` di una voce, la parte GM i blocchi `gm`, e
l'immagine il campo `img`. Le stesse tre cose, ma dentro luoghi, PDI e voci del Compendio,
non dentro un oggetto separato che si apre sopra la mappa.

### Come lavora il master durante la sessione

A schermo intero, quattro colonne. A sinistra i sei personaggi. Al centro la mappa. Poi la
**Guida della scena**, che è il copione: i punti d'interesse in ordine di gioco, ognuno con il
testo da leggere ad alta voce, le note riservate, la prova da chiedere e i pulsanti per agire.
Sotto la guida, il Registro dei tiri. A destra la Regia: scontro, bestiario, nebbia, selezione.

L'idea di regia è: il master legge dall'alto verso il basso e preme i pulsanti che trova lì,
senza cercare niente altrove.

### Cosa vedono i giocatori

Tre colonne, non quattro: niente Guida, niente Regia. Al posto loro c'è la scheda del proprio
personaggio con punti ferita, classe armatura, il menu delle prove e le **azioni** divise in
Azione / Azione bonus / Reazione secondo le regole D&D 2024. Della mappa vedono solo ciò che la
nebbia ha scoperto, e dei punti d'interesse solo quelli svelati.

Chi apre il sito sceglie: «Sono il Master» (chiede una password, che conosce solo Giuseppe) o
«Sono un giocatore». `?ruolo=vicarus` nell'indirizzo forza il personaggio.

---

## 2. Le aree dell'interfaccia

**Barra in alto.** Logo, poi le tre schede **Tavolo · Diario · Compendio**, poi (solo master) il
**menu Scena** con l'icona della cinepresa, che dice sempre in quale scena siete e permette di
cambiarla. A destra: la fase (Esplorazione / Scontro), il round quando si combatte, il numero di
persone collegate, e «Vista» per il master, che gli permette di guardare il tavolo con gli occhi
di un giocatore preciso — serve per controllare cosa stanno effettivamente vedendo.

Il Compendio **non** è una pagina a sé: è una finestra che si apre sopra il tavolo e si chiude
tornando alla scheda Tavolo. Decisione esplicita di Giuseppe: non si deve mai «uscire» dal
tavolo.

**Colonna del gruppo (sinistra).** Sei schede orizzontali: ritratto a sinistra, nome e punti
ferita a destra, barra della vita, condizioni attive. Sull'angolo del ritratto c'è il riquadro
dell'iniziativa, che per il master funziona a tre clic: il primo **chiede** il tiro al giocatore
(il riquadro si illumina), il secondo **tira al posto suo**, il terzo **azzera**. I sei devono
starci sempre tutti nello schermo: l'altezza si adatta.

**Mappa (centro).** Zoom e trascinamento. In basso la barra **Muovi · Misura · Tira dadi ·
Ping**. Il ping è un clic sulla mappa che tutti vedono. A sinistra, solo per il master, gli
strumenti: nebbia scopri/copri, muri, porte, aree.

**Guida della scena (solo master).** Sezione 5.

**Registro.** Tutti i tiri e gli eventi, in ordine, visibili a tutti — tranne i tiri segreti dei
nemici, che il master può tenere nascosti con l'interruttore «Tiri dei nemici: segreti».
Si può archiviare: le sessioni archiviate finiscono nel **Diario**.

**Regia (destra, solo master).** Inizia scontro / Prossimo turno / Termina; il bestiario con
«Metti sulla mappa»; i comandi della nebbia; il pannello Selezione che mostra il token cliccato
e permette di ferirlo, curarlo, dargli condizioni, nasconderlo.

**Compendio.** Tre colonne: sezioni a sinistra, griglia di schede al centro, dettaglio a destra.
Sezione 6.

---

## 3. Scene e mappe

Oggi esistono **tre tipi di scena**.

**Mappa VTT completa.** Oggi una sola: *Sotto Bëllindë — Oltre la Porta*, il dungeon. Ha
griglia, nebbia, muri, token di tutti (personaggi, PNG, mostri) e punti d'interesse. È qui che
si combatte e si esplora.

**Mappa illustrata.** Oggi una sola: *Bëllindë — il borgo*. È la mappa disegnata del paese.
Niente griglia, niente nebbia, niente muri. Ci stanno solo i token del gruppo, e sopra ci sono i
quindici **segnaposto numerati** dei luoghi (1. Piazza Grande, 2. Rocca dei Melacera…): il
master ci clicca e si apre la scheda del luogo. Serve per la città, dove non si misura il
movimento in caselle.

**Scena-luogo.** Aprendo un luogo come scena (`luogo:l1`) la mappa sparisce e resta a tutto
schermo la scheda: immagine grande, testo, informazioni. Si spengono anche la barra in basso, lo
zoom e gli strumenti, perché non servono. È il sostituto dell'handout a schermo di Roll20, ma
senza finestre sovrapposte.

**Cambio scena.** Lo fa solo il master, dal menu in alto. Si propaga a tutti in tempo reale e
finisce nel Registro («Il master porta il gruppo a: …»). I token **non si spostano né si
duplicano**: le posizioni sono uniche e restano dove sono; cambiando scena semplicemente si
mostrano o no. Questo è un limite noto e accettato: oggi c'è una sola mappa VTT, quindi non si
è ancora posto il problema di gruppi di token diversi per mappe diverse.

Nel menu le scene sono numerate in modo progressivo: **1 · Bëllindë** e sotto **1.1 … 1.15** i
suoi luoghi (che tengono il numero del segnaposto sulla mappa), poi **2 · Sotto Bëllindë**.

---

## 4. I punti d'interesse

È il meccanismo che sostituisce, insieme, gli handout di Roll20 e le note del master su foglio.

**Cosa sono.** Un PDI è una cosa che accade in un punto preciso della mappa. Non è
necessariamente un oggetto: può essere una stanza, un corridoio, una trappola, un dettaglio da
notare, una porta, un enigma, uno scontro che scatta, una persona, una scena che parte quando
arrivano lì. I tipi previsti sono nove: **porta, trappola, enigma, dettaglio, scontro, stanza,
corridoio, scena, persona**. Ognuno ha la sua icona e il suo colore.

**La regola del punto interrogativo.** Questa è una decisione di Giuseppe, presa il 12 settembre,
e va rispettata. I giocatori **non vedono mai il tipo vero** di un punto: vedono un «?» dorato.
Sanno che lì c'è qualcosa, non sanno cosa. Se ci cliccano leggono solo: «Qualcosa, qui — il
master vi dirà cosa vedete». Il master, invece, vede sempre l'icona vera.

**I punti nascosti.** Tre categorie non compaiono affatto, nemmeno come «?», finché non vengono
scoperte: le **trappole**, i **dettagli** (cioè le cose che si notano solo guardando bene) e le
**porte segrete**. Per farle emergere serve una prova, di norma Percezione CD 13, che il master
chiede a un singolo personaggio o a tutto il gruppo. Se qualcuno la passa, il punto si svela da
solo: non serve che il master faccia altro. Sulla mappa del master i punti non ancora svelati
hanno l'anello tratteggiato.

**Cosa contiene un PDI.** Un titolo. Un **testo da leggere ai giocatori**, scritto per essere
letto ad alta voce così com'è. Le **note del master**, che sono ricche: regolamento della
situazione, cosa hanno già fatto i giocatori nelle sessioni passate, come si comporta la cosa se
la toccano. Una **prova**, quasi sempre presente: abilità, CD, cosa succede se passa, cosa se
fallisce. Un'immagine, quando c'è. Il **bottino solo dove c'è davvero**, non a tutti i punti.

**Chi comanda lo svelamento.** Sempre il master, con un pulsante «Svela ai giocatori /
Nascondi», salvo lo svelamento automatico dopo una prova riuscita. La nebbia è un sistema
separato: coprire la mappa e svelare un punto sono due cose indipendenti.

**Sotto Bëllindë.** Il dungeon in corso ha **undici punti**, che coprono per intero l'handout di
esplorazione scritto per la sessione: il pozzo con la scala, la porta murata crollata, la
breccia di Adamus (l'intercapedine), i solchi nel pavimento, la linea sul pavimento, i rilievi
della Sala delle Ordinanze, le catene, la Camera delle Memorie, Micuccio, il Quarto Sigillo e la
murata. Corrispondono alle sei Aree dell'handout più il cuore e l'uscita. Il 13 settembre è
stato verificato che non manca nessun punto dell'handout.

---

## 5. La Guida della scena

Nata da una richiesta esplicita di Giuseppe: «la guida deve riportare punto per punto ogni punto
d'interesse, in maniera sequenziata». È il copione della sessione.

Per una scena-mappa elenca i punti d'interesse **nell'ordine in cui si incontrano giocando** —
non in ordine alfabetico, non nell'ordine in cui stanno sulla mappa: nell'ordine di gioco deciso
dal master. Ogni voce è una scheda che si apre e contiene, nell'ordine: il numero, l'icona del
tipo, il titolo, lo stato (svelato / nascosto / ?), il testo da leggere ai giocatori, le note del
master, la prova.

E quattro pulsanti: **Vai sulla mappa** (centra la mappa su quel punto), **Apri** (la scheda a
tutto schermo), **Chiedi Percezione al gruppo** (per i punti nascosti, con svelamento automatico
a chi passa) o **Chiedi \<abilità\> al gruppo** (la prova del punto), **Svela ai giocatori /
Nascondi**.

Sotto i punti ci sono le **Schede della scena**: gli handout narrativi lunghi associati a quella
parte dell'avventura, consultabili lì o a tutto schermo.

Per le scene-luogo, al posto dei punti compare la scheda del luogo con le sue sezioni riservate.

Il **Registro sta sotto la guida**, non nella colonna di destra: decisione di Giuseppe, così
mentre legge il copione vede scorrere i tiri.

Quello che la guida **non** fa ancora: non tiene traccia di cosa è già stato giocato. Non esiste
un «punto completato». Lo stato che si vede è solo svelato / non svelato.

---

## 6. I contenuti e la visibilità

I contenuti stanno in `contenuti/`, un file JSON per voce. Due cartelle: `mondo/` (l'atlante, 28
nazioni, 10 province, il Ducato, 8 contee, 43 borghi) e `luoghi/` (98 file: Julia Nova 61 fra
quartieri e luoghi, Mushanè 22, Bëllindë 15).

**La struttura di un luogo.** Identificativo, titolo, sottotitolo, città, il livello
(quartiere o luogo), il `parent` che lo lega al quartiere o al borgo, l'immagine, la mappa
quando c'è, lo stato, gli atti in cui compare, una **scheda** di coppie chiave/valore (Tipo, Chi
ci comanda, Orari, Prezzi, Collegato a…), poi due elenchi di blocchi di testo: **`pub`** e
**`gm`**. Sono la Description e le GM Notes di Roll20, ma a blocchi con un titolo ciascuno
(«Aspetto esterno», «Entrando», «Cosa non si vede»). Poi le **`prove`**, che sono già
dichiarative: abilità, CD, esito positivo, esito negativo — il tavolo ci costruisce sopra il
pulsante «Chiedi» da solo, senza che nessuno scriva codice per quel luogo. Poi i collegamenti,
l'eventuale scena da aprire, e per i quindici di Bëllindë il **segnaposto** con il numero e le
coordinate sulla mappa illustrata.

**I tre stati di visibilità.** Il campo `state` di ogni voce dice cosa ne sanno i giocatori.
*Visitato / incontrato*: lo conoscono, lo vedono senza etichette. *Noto*: compare con la
dicitura «ne avete sentito parlare». *Segreto*: **i giocatori non lo vedono affatto**. Il master
vede tutto. C'è un'eccezione per persona: la sezione «Naviganti Grigi / Perla Silenziosa» è
visibile solo ad Adamus e al master.

**Attenzione, e va detto chiaro:** il sito è pubblico e i testi `gm` stanno comunque nel
sorgente della pagina. La password del master blocca il ruolo, non il codice. Chi apre il
sorgente può leggerli. È noto e accettato, ma è il motivo della regola numero uno del progetto:
**tutto ciò che è marcato come pubblico contiene solo ciò che i personaggi già sanno**, e nel
dubbio non si scrive. Le cose che i giocatori non sanno a settembre 2026 sono: che Ceruso è in
fuga, Micuccio, il Sigillo.

**I collegamenti.** Nei testi si scrive `[LUOGO — Piazza Grande]`, `[PNG — Ruggiero de' Santi]`,
`[SCENA — …]`. Il tavolo li trasforma in link se la voce esiste ed è visibile a chi legge,
altrimenti lascia il nome scritto. Così lo stesso testo funziona per master e giocatori.

**Le immagini.** Le fa Giuseppe con Midjourney e le mette in `05_Immagini` sul suo computer con
nomi leggibili (`LUOGO - Piazza Grande.jpg`, `Borgo - Bëllindë.jpg`). Poi vengono ridotte a 1920
px, rinominate col codice del contenuto e messe in `img/`, e una riga di `contenuti/_immagini.json`
collega il nome leggibile al file. Nel contenuto si scrive il **nome leggibile**, non il codice.
Ogni città è a livelli, e ogni livello ha due immagini: `img` è come appare, `mappa` è la mappa.

---

## 7. `comp2`, gli override e Firebase

Il master può, dal Compendio, **creare voci nuove** e **modificare voci esistenti** durante il
gioco. Le voci nuove finiscono in `S.comp2`, le modifiche a quelle esistenti in `S.compOv`.
Entrambe vivono in Firebase, non nei file, e sono immediate: nessuna pubblicazione.

Nasce da un'esigenza vera: durante la sessione i giocatori inventano un PNG, il master decide una
cosa al volo, e quella cosa deve esistere subito.

Ma la voce di Firebase **ha la precedenza** su quella dei file. Quindi se lo stesso luogo esiste
in `contenuti/` e anche modificato in `comp2`, a schermo vince Firebase e i due si separano nel
tempo senza che nessuno se ne accorga. Va contro la regola del progetto («una cosa, un file») ed
è il rischio più concreto sul piano dei contenuti. Oggi il sistema è usato poco, quindi il danno
non si è ancora visto.

**Il confine generale.** Firebase contiene **lo stato della partita**: un unico documento
`partita/stato` con la posizione dei token, i punti ferita, la nebbia già scoperta, l'iniziativa
e i turni, il registro, l'inventario dei personaggi, i punti d'interesse svelati, la scena
aperta. I file contengono **l'avventura progettata**. `comp2` è l'unica cosa che sta a cavallo.

Due trappole tecniche di Firebase, che hanno già fatto danni veri l'11 settembre: il database
**cancella le liste vuote, gli oggetti vuoti e i valori nulli** senza avvisare, e un valore
indefinito fa fallire l'intero salvataggio. Tredici comandi del tavolo erano morti in silenzio
per questo. La difesa è una funzione che ricostruisce la forma dello stato a ogni lettura. Ogni
campo nuovo va aggiunto a quella lista, altrimenti il problema torna identico.

Autenticazione: i giocatori entrano in modo **anonimo**, il master con email e password. Le
regole aprono `partita/**` a qualunque utente autenticato — e anonimo significa chiunque apra la
pagina. Il rischio è che un estraneo possa leggere e scrivere lo stato della partita. Non è
stato ancora corretto.

---

## 8. PNG e mostri

Sono due cose diverse e non vanno confuse.

**Il PNG narrativo** è una voce del Compendio: ritratto, ruolo, età, aspetto, cosa sa, cosa
vuole, come parla, i suoi legami. Serve al master per interpretarlo. Non ha statistiche di
combattimento e non sta sulla mappa.

**La creatura del bestiario** è una scheda da combattimento: punti ferita, classe armatura,
iniziativa, taglia, elenco delle azioni con bonus di attacco e dadi di danno. Il master la
sceglie da un menu e preme «Metti sulla mappa»: nasce un token, di solito nascosto, che poi
rivela quando serve. Oggi il bestiario contiene le creature di Sotto Bëllindë: Armigero
Vincolato, Brak Vincolato (e la variante guerriero), Custode dell'Ultimo Ordine, Pilone del
Comando, Forgiato, Spettro della Guerra, Mercenario vesperiano, Sergente mercenario,
Osservatore.

Il Pilone è un caso utile da capire: è un **oggetto**, non una creatura. Ha punti ferita e classe
armatura ma non tira iniziativa e non agisce.

Lo stesso personaggio può essere entrambe le cose — una voce narrativa nel Compendio e una scheda
nel bestiario — ma oggi sono due dati separati che nessuno collega.

---

## 9. I token

Tre famiglie: personaggi giocanti, alleati/PNG, nemici.

I sei personaggi hanno un'immagine vera come token, disegnata da Giuseppe, con l'anello verde già
dentro il file. Per loro il tavolo non disegna nessun bordo colorato aggiuntivo: resta solo il
bagliore dorato su chi ha il turno. **I mostri oggi hanno solo una lettera su un cerchio
colorato**: il meccanismo per dargli un'immagine è pronto nel codice (v74) ma le immagini non
esistono ancora.

Sotto ogni token c'è l'etichetta col nome, in piccolo: per i personaggi solo il nome proprio, per
gli altri il nome senza articoli e senza parentesi. Era una richiesta precisa: le etichette lunghe
coprivano la mappa.

I personaggi hanno anche la barra dei punti ferita (visibile a tutti) e le condizioni attive in
sigla. Dei nemici i giocatori vedono la barra solo se il master lo consente.

**Chi può muovere cosa.** Il master muove tutto. Un giocatore muove solo il proprio token, e
durante uno scontro solo nel proprio turno. Il movimento viene misurato in metri e chiesto in
conferma, con l'opzione «Corri» che raddoppia. Un token dentro la nebbia non è visibile ai
giocatori.

---

## 10. La nebbia

La mappa parte coperta. Il master scopre col pennello, oppure con «Rivela intorno al gruppo», che
scopre attorno a ogni personaggio tenendo conto dei **muri**: la luce non passa attraverso le
pareti, quindi le zone scoperte hanno la forma reale di ciò che si vede da lì. Ci sono anche
«Rivela tutto» e «Copri tutto».

La resa è deliberata: coltre blu notte con fumo che si muove lentamente e bordi morbidi. Il
master la vede semitrasparente (al 62%), così sa sempre cosa c'è sotto; i giocatori la vedono
opaca. La prima versione era «veramente pessima» (bordi netti), la seconda faceva un retino di
quadretti in zoom — difetto di Chrome sui gradienti — ed è stata rifatta in v74 con rumore
calcolato pixel per pixel. Regola che ne deriva: **niente gradienti a bassa opacità sulla mappa**.

Nebbia e punti d'interesse restano indipendenti: si può avere una zona scoperta con dentro un
punto non ancora svelato.

---

## 11. Il combattimento

Il master preme **Inizia scontro**. Il tavolo tira l'iniziativa per tutti i nemici visibili che
la tirano (il Pilone no), e per i personaggi la **chiede ai giocatori**, che tirano dal proprio
schermo; in alternativa il master tira al posto loro dal riquadro sul ritratto. L'ordine si
compone da solo.

Da lì: **Prossimo turno** avanza, con un cartello che annuncia di chi è il turno; chi non è di
turno non può muoversi. Ogni personaggio ha le sue azioni divise in **Azione / Azione bonus /
Reazione**, scritte secondo le regole D&D 2024 a partire dalle schede vere dei sei giocatori, con
sotto ogni voce la nota breve (slot usati, CD, maestria dell'arma, usi rimasti). In fondo ci sono
le azioni che valgono per tutti: Attacco, Scatto, Disimpegno, Schivata, Aiuto, Nascondersi,
Cercare, Studiare, Influenzare, Usare un oggetto, Prepararsi.

Premendo un attacco si sceglie il **bersaglio** da un elenco (prima gli avversari, ordinati per
distanza in metri). Il tavolo tira, confronta con la classe armatura, applica il danno — con i
dadi raddoppiati sul 20 naturale — e scrive nel Registro «COLPITO → bersaglio (a N punti
ferita)». Per gli incantesimi con tiro salvezza il danno si tira una volta sola e poi, per ogni
bersaglio, si sceglie Tutto / Metà / Niente. Dalla v73 i dadi cadono in 3D sulla mappa, e tutti
vedono cadere **gli stessi numeri**: il risultato lo decide il tavolo, non la fisica.

**Termina** azzera iniziativa e turni e torna in esplorazione.

Quello che il tavolo **non** fa ancora, e va detto perché sembra che lo faccia: non scala gli
slot incantesimo né gli usi limitati, non gestisce riposo breve e lungo, e le condizioni non
hanno una durata che scende da sola. Se su un personaggio c'è scritto «IND 10» è una condizione
messa a mano in una sessione passata che nessuno ha mai tolto.

---

## 12. Cosa è ancora dentro il codice

Questo è il punto che conta di più per chi deve lavorarci.

**Già fuori dal codice, in `contenuti/`:** i luoghi e il mondo, con le loro prove dichiarative.
Aggiungere un luogo significa aggiungere un file JSON: nessuno scrive JavaScript. Il file
`build.py` li traduce e ne ricava anche i quindici segnaposto della mappa di Bëllindë.

**Ancora scritti dentro `src/tavolo.html`,** cioè dentro il file di programma da 1,5 MB:

| Cosa | Che natura ha |
|---|---|
| I punti d'interesse, con testi e note del master | Contenuto. Dovrebbe uscire dal codice |
| L'elenco delle scene e le loro mappe | Contenuto |
| L'ordine di gioco dei punti | Contenuto |
| Le schede narrative della scena | Contenuto |
| I PNG | Contenuto |
| Il bestiario | Contenuto, ma con parti di regolamento |
| Le azioni dei sei personaggi | Metà e metà: sono le schede dei giocatori, generate da uno script |
| Le immagini dei token | Elenco di collegamenti, banale da spostare |
| Nebbia, combattimento, sincronizzazione, interfaccia | Codice vero. Resta dov'è |

La conseguenza pratica: **oggi scrivere una parte nuova dell'avventura significa modificare il
programma.** Il lavoro più frequente cade nel punto più delicato del progetto.

---

## 13. Decisioni già prese

Da non rimettere in discussione senza un motivo nuovo. Sono state provate al tavolo e sono state
scelte da Giuseppe.

Il Compendio resta una finestra sopra il tavolo, non una pagina. I punti d'interesse restano «?»
per i giocatori, e trappole/dettagli/porte segrete restano invisibili fino alla prova. Le prove
stanno nelle scene e nei punti, non nella scheda del luogo del Compendio. La Guida della scena
elenca i punti in ordine di gioco. Il Registro sta sotto la Guida quando si è master. I luoghi di
Bëllindë restano anche nel menu delle scene. Il riquadro iniziativa funziona a tre clic. Palette
blu notte e oro, font cloni di quelli dei manuali D&D (Bookinsanity per il testo, Mr Eaves per i
titoli di sezione, Nodesto per i titoli grandi, Scaly Sans per i numeri e i pulsanti), caratteri
grandi: prima di rimpicciolire qualcosa, chiedere. Le immagini le fa Giuseppe con Midjourney, in
uno stile solo — semi-realistico cinematografico, architettura italiana del Trecento. Una cosa, un
file. Canone prima: se una cosa non risulta stabilita, si dice e non si inventa.

E una regola di metodo, non di prodotto: **prima di pubblicare si lancia la prova automatica.**
Questo tavolo si rompe in silenzio — un pulsante che va in errore non stampa niente e resta lì,
apparentemente funzionante. Guardare la console non basta: bisogna premere davvero i bottoni.

---

## 14. Cose provate e abbandonate

Le immagini generate dall'intelligenza artificiale su Higgsfield: quasi duecento, tutte scartate
da Giuseppe. «Non mi piacciono, le cancello e le ricreerò io.» Non riproporre generazione
automatica di immagini per il Compendio.

Le mappe rigenerate dall'IA: inventano coste, fiumi e confini e scrivono in modo illeggibile. Le
mappe vere restano gli export di Azgaar.

Il «Gobbo», un assistente IA dentro il tavolo: tolto. Funzionava solo dentro l'ambiente di
Claude, non sul sito pubblico, e per farlo funzionare servirebbe un server con una chiave API,
che nel sito non ci va.

Il font Draconis usato per tutto: è condensato e sotto una certa dimensione non si legge. È stato
usato per qualche versione e poi sostituito.

Gli effetti visivi delle aree degli incantesimi: esclusi consapevolmente, Giuseppe non li ritiene
realizzabili bene.

Tre aumenti dei caratteri fatti a gradini, uno dopo l'altro: hanno reso le proporzioni incoerenti
e sono stati rifatti da capo con una scala unica. Le dimensioni si toccano solo in quel blocco.

---

## 15. Dove siamo

**Giocabile adesso.** Bëllindë: quindici luoghi completi, con immagini, testi, prove, e la mappa
illustrata coi segnaposto. Sotto Bëllindë: il dungeon, con la mappa, gli undici punti, il
bestiario delle creature, la nebbia, il combattimento completo. La sessione di settembre si è
giocata di lì.

**Nel Compendio ma non ancora giocato.** Julia Nova: 61 luoghi in quindici quartieri, testi
completi, ma solo due immagini su 61. Mushanè: 22 luoghi, da rifare anche nei testi. Il Mondo di
Ea: 93 voci, metà con immagine. 134 personaggi, un terzo con ritratto.

**Non ancora portato nel tavolo.** Tutta la parte dell'avventura che viene dopo Sotto Bëllindë.
Teramum non esiste come scena.

**Versioni.** Online c'è la v73. La v74 è pronta e consegnata ma non ancora pubblicata: contiene
le etichette dei token più corte, il menu Scena spostato nella barra in alto, la nebbia rifatta e
il meccanismo per i token dei mostri con immagine.

**Aperto, in attesa di una decisione di Giuseppe.** Le immagini dei token dei mostri. Cinque
incongruenze trovate nelle schede dei personaggi rispetto alle regole 2024 (la classe armatura di
Alessandros, il bonus agli incantesimi di Vicarus, il numero di incantesimi preparati di Adamus e
di Alessandros, i due talenti di quarto livello di Mattheus). La mappa del dungeon a risoluzione
più alta.

**Lavoro concordato ma non fatto,** in ordine: riposo breve e lungo; slot incantesimo e usi che si
scalano da soli; condizioni con durata che scende; bottino e inventario collegati ai punti
d'interesse; punti esperienza e passaggi di livello; misura della portata delle armi. La
illuminazione dinamica è rimandata; gli effetti delle aree sono esclusi.
