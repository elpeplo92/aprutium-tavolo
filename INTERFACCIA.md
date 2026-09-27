# Aprutium — il tavolo come si usa davvero

Quarto e ultimo documento di consegna. Gli altri tre spiegano la filosofia (`AVVENTURA.md`), dove
stanno i dati (`MODELLO-DATI.md`) e i confini del modello (`CONFINI-E-CONSEGNA.md`). Questo
descrive **il comportamento dell'interfaccia**: cosa succede davvero premendo le cose. Letto dal
codice alla v74.

---

## 1. Il pannello destro quando selezioni un token

Il master clicca un token e si apre la sezione **Selezione**. Se non c'è niente selezionato dice
«Clicca un token o un medaglione». Quando c'è, mostra sempre queste cose:

nome; **punti ferita** nella forma «26 / 36», con «(+5 temp.)» se ce ne sono di temporanei;
**classe armatura** se il token ne ha una; **iniziativa**; le **condizioni** come pastiglie
cliccabili; una casella per i punti ferita temporanei; i **tiri salvezza contro morte** se il
token è a zero; e l'elenco delle sue **azioni**, le stesse che vede il giocatore ma comandate dal
master.

I pulsanti: **Chiedi l'iniziativa**, **Apri la scheda**, **Chiedi una prova**, **Nascondi /
Mostra ai giocatori**, **Rimuovi dalla mappa** (che chiede conferma: al primo clic diventa
«Sicuro?» per tre secondi).

Cosa cambia secondo il tipo:

- **Personaggio giocante** — tutto quanto sopra. I punti ferita sono visibili anche ai giocatori.
- **Alleato o PNG** (per esempio Ruggiero) — stessa cosa, ma i punti ferita li vede solo il
  master, e non c'è la scheda del personaggio.
- **Nemico** — in più compare il riquadro **«Come combatte»**, che mostra la tattica scritta nel
  bestiario e, sotto, le **battute** della creatura, quelle che il master può leggere ad alta
  voce. È l'unica differenza vera fra un nemico e un alleato nel pannello.
- **Pilone o oggetto** — identico a un nemico, perché per il tavolo *è* un nemico: ha punti
  ferita, classe armatura e azioni. L'unica differenza è il campo che gli impedisce di tirare
  l'iniziativa, per cui non entra mai nell'ordine dei turni.
- **Token nascosto** — il master lo vede semitrasparente sulla mappa e lo seleziona normalmente;
  il pannello è lo stesso, ma il pulsante dice **«Mostra ai giocatori»** invece di «Nascondi».
  Per i giocatori quel token non esiste.

In alto a destra, sopra la mappa, compare anche una targhetta col nome del token selezionato, i
suoi punti ferita e — solo durante uno scontro — **quanti metri di movimento gli restano**.

---

## 2. L'iniziativa, clic per clic

Il riquadro sta sull'angolo del ritratto, nella colonna di sinistra. Quando nessuno ha tirato
mostra l'icona di un dado a venti facce, spenta.

**Primo clic del master.** Viene creata una richiesta con abilità «Iniziativa» e il personaggio
fra i destinatari; nel Registro compare «Il master chiede l'iniziativa a Vicarus»; sul tavolo del
master il riquadro **comincia a pulsare** (un alone dorato che si allarga e svanisce, ogni 1,2
secondi); e appare un avviso che spiega cosa succede dopo. Sullo schermo del giocatore compare un
riquadro col pulsante **«Tira Iniziativa (d20 +2)»**, col suo modificatore già calcolato.

**Il giocatore tira.** Il risultato entra nel Registro, l'iniziativa viene registrata sul token,
l'ordine dei turni si ricompone da solo, e il giocatore viene tolto dai destinatari della
richiesta. Quando l'ultimo ha tirato, la richiesta sparisce. Il riquadro smette di pulsare e
mostra **il numero** su fondo dorato.

**Secondo clic del master** (mentre pulsa, cioè se il giocatore non risponde) — tira lui al posto
suo. Nel Registro si legge «Vicarus Cerullius (tirato dal master)».

**Terzo clic** (quando il numero c'è) — azzera. Il riquadro torna il dado spento, il personaggio
esce dall'ordine dei turni, e se era il turno suo il turno torna al primo. Nel Registro: «Il
master azzera l'iniziativa di Vicarus».

Se il giocatore non risponde e nessuno tira, non succede niente: la richiesta resta lì finché il
master non tira per lui o non azzera. Non c'è nessun tempo di scadenza.

Cosa viene salvato: l'iniziativa sul token, l'ordine dei turni, e la richiesta aperta. Tutto in
Firebase, quindi visibile su ogni schermo entro un istante.

---

## 3. Le richieste di prova

Stesso meccanismo dell'iniziativa, che infatti è una prova come le altre.

**A un solo personaggio.** Il master seleziona il token, preme «Chiedi una prova», sceglie
l'abilità e la difficoltà. Sullo schermo di quel giocatore compare il riquadro col pulsante
«Tira Percezione (d20 +5)». Gli altri non vedono niente.

**A tutto il gruppo.** La stessa richiesta con tutti e sei i personaggi fra i destinatari. Ogni
giocatore vede il proprio pulsante; man mano che tirano escono dall'elenco; quando ha tirato
l'ultimo la richiesta si chiude da sola.

**Tirata dal master.** Dal riquadro dell'iniziativa o dai pulsanti della Guida. Il risultato è
identico, ma nel Registro c'è scritto «(tirato dal master)». Utile quando qualcuno è al telefono.

**Collegata a un punto d'interesse.** Identica, ma la richiesta porta con sé il punto. A ogni
tiro, se il totale raggiunge la difficoltà, **il punto si svela da solo** e nel Registro appare
«Svelato: I solchi nel pavimento». Basta che ci riesca uno.

Cosa vede il giocatore: solo il proprio riquadro con il pulsante. Cosa vede il master: la
richiesta nel Registro, i tiri man mano che arrivano, e — per le prove chieste dalla Guida — il
punto che cambia stato.

---

## 4. La scheda del giocatore

Nella colonna di destra, sotto «Il tuo personaggio», ci sono in ordine:

**I dati principali**, come tabella: nome, classe e livello, punti ferita, classe armatura. Solo
durante uno scontro (o se ha già tirato) compaiono anche **iniziativa** e **movimento residuo**,
scritto come «7,5 / 9 m» e raddoppiato se ha fatto Scatto.

**Due pulsanti**: «Apri la mia scheda» e «Incantesimi», che aprono la scheda completa a schermo —
caratteristiche, competenze, equipaggiamento, talenti, privilegi, incantesimi preparati e slot.
Quella è sola lettura.

**Un menu con tutte le abilità** più il pulsante «Tira»: il giocatore può tirare quando vuole,
senza che il master glielo chieda.

**Il riquadro della richiesta**, che compare solo quando il master gli ha chiesto qualcosa.

**I tiri salvezza contro morte**, che compaiono solo se è a zero punti ferita e non è stabile, con
il conteggio «Successi 1/3 · Fallimenti 2/3».

**Le azioni**, in tre schede: Azione, Azione bonus, Reazione. Ogni voce ha un'icona colorata
secondo il tipo (mischia, distanza, incantesimo, cura, speciale), il nome, la nota breve — slot,
difficoltà, maestria dell'arma, usi rimasti — e a destra il bonus d'attacco e il danno. Sono
**tutte cliccabili**: premendo si tira. In fondo c'è «Per tutti», con le azioni del regolamento
che valgono per chiunque.

**Le condizioni e l'inventario**, va detto, il giocatore li vede solo di sfuggita. Le condizioni
attive compaiono come sigle di tre lettere sotto il ritratto e sotto il token («PRO», «TRA») con
il numero di round: il nome per esteso e i comandi per metterle o toglierle stanno **solo nel
pannello del master**. L'inventario non ha una riga nella colonna: gli oggetti assegnati dal
Compendio appaiono dentro la scheda completa, sotto Equipaggiamento, marcati «(dal Compendio)».

Fra esplorazione e scontro cambia poco: compaiono iniziativa e movimento, e il movimento del
token viene limitato al proprio turno. Le azioni restano sempre disponibili — il tavolo non
impedisce di usare un'azione fuori turno, si fida del master.

---

## 5. La Regia

Tre gruppi di comandi, tutti solo per il master. I primi due compaiono **solo nella scena del
dungeon**.

**Scontro.** *Inizia scontro* mette la fase su «scontro», tira l'iniziativa per tutti i nemici
visibili che la tirano e crea la richiesta per i personaggi. *Prossimo* avanza il turno e mostra
al centro della mappa un cartello con il nome di chi tocca. *Termina* azzera iniziative e turni e
torna in esplorazione. *Tiri dei nemici*, un interruttore che alterna «segreti» e «visibili ai
giocatori»: quando è su segreti, gli attacchi dei mostri finiscono nel Registro **solo per il
master**, marcati con un bordo tratteggiato e l'etichetta «solo master».

**Bestiario.** Un menu con le dieci creature e il pulsante *Metti sulla mappa*.

**Nebbia.** *Attiva / Disattiva*; *Rivela intorno al gruppo*, che scopre attorno a ogni
personaggio tenendo conto dei muri; *Rivela tutto*; *Copri tutto*.

**Gli strumenti sulla mappa**, nella colonna verticale a sinistra della scena, sono anch'essi
comandi del master e vanno contati qui: *Nebbia — rivela* e *Nebbia — copri di nuovo*, che si
usano cliccando o trascinando direttamente sulla mappa; *Muri*, che trasforma una casella in muro
o in pavimento a ogni clic; *Porte*, che a clic successivi mette una porta chiusa, poi un
passaggio segreto, poi la toglie; *Misura*; e lo strumento delle **aree**, che disegna sulla
mappa un cerchio, un cono o una linea della misura in metri scritta nella casella accanto, con
«Togli l'area» per cancellarla. L'area è condivisa: la vedono anche i giocatori, e serve a
mostrare dove arriva un incantesimo o un soffio senza contare le caselle a voce. È una cosa
diversa dagli effetti visivi degli incantesimi, che Giuseppe ha escluso: qui si disegna solo la
forma geometrica.

Tutti agiscono sullo stato globale della partita tranne i comandi della sezione Selezione, che
agiscono sul token selezionato.

---

## 6. Il bestiario, dal menu alla morte

Il master sceglie la creatura e preme **Metti sulla mappa**. Nasce un token con un identificativo
nuovo, i punti ferita e la classe armatura della scheda, le sue azioni, il colore e la lettera
iniziale, la taglia (il Custode occupa quattro caselle), e **nascosto**. Compare al centro della
vista corrente; il master lo trascina dove serve.

Finché è nascosto i giocatori non lo vedono. Il master preme **Mostra ai giocatori** e appare.
Se lo scontro è già cominciato, nel momento in cui viene mostrato **gli viene tirata l'iniziativa
automaticamente** e si inserisce nell'ordine.

Durante il combattimento il master lo seleziona e usa le sue azioni dal pannello: sceglie il
bersaglio da un elenco ordinato per distanza, il tavolo tira, confronta con la classe armatura,
applica il danno. A zero punti ferita il token diventa grigio e nel Registro compare «X cade a 0
PF»; non sparisce da solo. Si toglie con **Rimuovi dalla mappa**, che chiede conferma. I token
rimossi restano in un elenco da cui si possono rimettere.

---

## 7. I personaggi non giocanti in scena

Oggi il master ha **due posti diversi** dove guardare, e nessuno dei due è pensato per la
velocità della scena.

La **scheda rapida** (31 personaggi) si apre dai collegamenti `[PNG — Nome]` dentro i testi:
mostra il ritratto, la descrizione e i campi etichettati — Ruolo, Età, Voce, Cosa vuole, Sa, Non
sa, Luogo abituale, Statistiche — più le sezioni di testo. È la cosa più vicina a ciò che serve
mentre interpreti qualcuno.

Il **Compendio** (134 voci) ha tutto il resto: cosa sanno i giocatori, i collegamenti, gli atti,
la parte riservata. Ma è una finestra che copre il tavolo: aprirla in mezzo a una scena vuol dire
perdere di vista la mappa.

Se il PNG deve stare **sulla mappa** viene creato come token, di solito partendo da una creatura
del bestiario o a mano. **Non ha nessun legame con la voce narrativa**: cliccando il token del
PNG non si apre la sua scheda, si apre il pannello Selezione con punti ferita e azioni. Il
collegamento fra la persona e il suo token semplicemente non esiste come dato.

Quello che oggi manca, e che in partita si sente: non c'è un posto dove il master veda in tre
secondi *chi è costui, cosa vuole, cosa sa dei personaggi, come parla* senza coprire la mappa.

---

## 8. L'inventario

Funziona solo dal Compendio e solo per gli oggetti. Il master apre la voce di un oggetto e trova
**«Assegna a…»** con un menu: uno dei sei personaggi, il Gruppo, o la Crociata.

Assegnando: la voce del Compendio prende un campo «proprietario» con quel nome; l'oggetto viene
aggiunto all'elenco del personaggio come tre dati — identificativo, nome, effetto meccanico; e
viene **tolto da tutti gli altri**, perché un oggetto ha un proprietario solo. Nel Registro
compare «La Lettera di Valerio assegnata a Mattheus». Nella scheda del personaggio l'oggetto
appare sotto Equipaggiamento con la dicitura «(dal Compendio)».

Quindi sì, **il collegamento con il Compendio è reale**: l'inventario tiene l'identificativo della
voce, non una stringa. Ma è a senso unico e solo il master può assegnare. Il giocatore non può
togliere, dare a un altro, usare o consumare niente. E gli oggetti che non stanno nel Compendio —
le monete, le razioni, la corda — non entrano in questo sistema affatto.

---

## 9. Registro e Diario

Nel Registro finiscono: i tiri di prova e di iniziativa, con dado, modificatore, totale ed
eventuale difficoltà; gli attacchi, con bersaglio, colpito o mancato, danno e punti ferita
rimasti; le cure e i danni applicati a mano; i tiri liberi; i tiri di dado dalla finestra «Tira
dadi»; e gli eventi di sistema — inizio e fine scontro, cambio scena, punti svelati, oggetti
assegnati, iniziative azzerate.

**Non** finiscono nel Registro: i movimenti dei token, l'apertura di schede o del Compendio, le
operazioni sulla nebbia, il ping, i trascinamenti.

Gli eventi marcati come riservati (i tiri dei nemici, quando l'interruttore è su «segreti»)
vengono mostrati **solo al master**, con bordo tratteggiato e l'etichetta «solo master».

Il Registro tiene gli ultimi 60 eventi. **Archivia** sposta il registro corrente in archivio e lo
svuota: l'archivio tiene fino a dodici sessioni da duecento eventi. **Svuota** cancella senza
archiviare, e chiede conferma. Il **Diario**, la scheda in alto, è la lettura dell'archivio: le
sessioni passate, in ordine.

Il Registro è **solo cronaca**: nessun'altra funzione legge quei dati. L'unica eccezione è
indiretta — dalla v73 il tavolo legge gli eventi del Registro per sapere quali dadi far cadere in
3D, perché il tiro viaggia insieme all'evento.

---

## 10. La «Vista» del master

In alto a destra il master sceglie un personaggio invece di «il Master». Da quel momento **il suo
tavolo diventa quello di quel giocatore**: la colonna della Regia e la Guida spariscono, appare
la scheda del personaggio, e tutti i controlli di visibilità si applicano davvero — la nebbia
copre, i punti nascosti spariscono, quelli non svelati tornano «?», le voci segrete del Compendio
non si vedono, i token nascosti scompaiono, i tiri riservati spariscono dal Registro.

Quindi come **simulazione di cosa vede il giocatore è fedele**. Le differenze che restano:
verso Firebase il master è ancora autenticato come master, quindi potrebbe scrivere cose che un
giocatore non potrebbe; il conteggio delle persone collegate non cambia; e la sezione dei
Naviganti Grigi si comporta secondo il personaggio scelto, quindi guardando come Adamus si vede
ciò che solo lui può vedere.

È il modo giusto per controllare, prima di una sessione, che non si veda qualcosa che non deve
vedersi.

---

## 10-bis. Cosa succede quando il master cambia scena

Sui tavoli dei giocatori viene ridisegnato tutto: l'immagine di fondo, la griglia, la nebbia, i
muri, i token visibili, i punti d'interesse, il nome della scena nella targhetta in alto. Nel
Registro compare «Il master porta il gruppo a: …». La colonna di sinistra col gruppo e la scheda
del personaggio non cambiano.

**Quello che resta è lo stato della partita**, che è unico e non per scena: la nebbia già
scoperta, i muri, le porte, l'iniziativa e i turni in corso, le posizioni dei token. Oggi non si
nota perché le scene VTT sono una sola; è lo stesso problema descritto in `CONFINI-E-CONSEGNA.md`.

E c'è un comportamento da sapere, perché in sessione capita: **se un giocatore ha aperto il
Compendio o una scheda nel momento in cui il master cambia scena, la finestra resta aperta.** Il
cambio scena non la chiude. Quel giocatore continua a vedere la sua finestra sopra la nuova scena
finché non la chiude lui. Non perde niente, ma non si accorge che il tavolo si è spostato.

---

## 11. Schermi

Il tavolo è pensato per un **desktop largo**. Le quattro colonne del master sono 224 pixel per il
gruppo, poi la mappa che si prende tutto lo spazio che avanza, poi 300 per la Guida e 330 per la
Regia: a 2000 pixel di larghezza la mappa resta circa metà schermo, che è la misura su cui è
stato tarato. Per i giocatori le colonne sono tre: 224, mappa, 330.

Le colonne laterali hanno **larghezza fissa**, solo la mappa si adatta. Le schede dei personaggi
si accorciano in altezza per starci sempre tutte e sei.

Esiste **una sola regola per schermi piccoli**, sotto 1100 pixel, e riguarda soltanto il
Compendio, che passa da tre colonne a due mettendo il dettaglio a scomparsa. Tutto il resto non
si adatta: sotto una certa larghezza le colonne si stringono e la mappa diventa inutilizzabile.

In pratica: **desktop soltanto**. Su tablet in orizzontale si può leggere, ma non è mai stato
provato né progettato. Su telefono no.

---

## 12. I segnali visivi

Quelli deliberati, approvati e da non perdere:

il **riquadro dell'iniziativa che pulsa** quando la richiesta è stata inviata e aspetta; il
**bagliore dorato** attorno al token di chi ha il turno; il **cartello al centro della mappa** che
annuncia il turno; il **bordo** attorno al token selezionato; l'**anello tratteggiato** sui punti
non ancora svelati, che vede solo il master; il **«?» dorato** al posto dell'icona vera per i
giocatori; le **pastiglie delle condizioni** sotto il token e sulla scheda, con i round rimanenti;
il **ping**, un cerchio che si allarga dove qualcuno ha cliccato, visibile a tutti; la
**conferma del movimento**, che mostra i metri percorsi prima di confermare; la **barra della
vita** che diventa rossa sotto il 30%; il **token grigio** di chi è a zero; il **bordo
tratteggiato** sugli eventi riservati del Registro; l'**area** disegnata sulla mappa, cerchio cono
o linea, visibile a tutti; i **dadi 3D** che cadono sulla mappa e
mostrano a tutti gli stessi numeri; la **nebbia col fumo che si muove**, semitrasparente per il
master; l'**avviso in basso** che compare e svanisce dopo un'azione.

---

## 13. Decisioni prese da Giuseppe

Quelle non ovvie leggendo il codice, nate da una sua richiesta precisa:

I punti d'interesse restano «?» per i giocatori — sanno che c'è qualcosa, non cosa. Trappole,
dettagli e porte segrete non compaiono affatto finché una prova non li scopre. Il riquadro
dell'iniziativa funziona a tre clic, con quell'ordine esatto: chiedi, tira al posto suo, azzera.
Le schede dei personaggi sono orizzontali, con il ritratto a sinistra e il dado sull'angolo, e
devono starci tutte e sei senza scorrere. Le etichette dei token portano solo il nome proprio,
perché quelle lunghe coprivano la mappa. Il Compendio resta una finestra sopra il tavolo: non si
esce mai dal tavolo. Il Registro sta sotto la Guida della scena quando si è master, così i tiri
si vedono mentre si legge il copione. La Guida elenca i punti in ordine di gioco, non in ordine
qualsiasi. I luoghi di Bëllindë stanno sia nel Compendio sia nel menu delle scene, ed è voluto.
Le prove stanno nelle scene e nei punti, non nella scheda del luogo. Palette blu notte e oro.
Caratteri grandi, font cloni di quelli dei manuali D&D: prima di rimpicciolire qualcosa,
chiedere. Niente assistente automatico dentro il tavolo. Niente effetti visivi per le aree degli
incantesimi.

---

## 14. Cose scomode, emerse davvero

Solo quelle viste in sessione o dette da lui. Nessuna soluzione.

Le durate delle condizioni non scendono: restano finché qualcuno se le ricorda. Su Mattheus c'è
ancora una condizione con dieci round messa a settembre.

Gli slot degli incantesimi e gli usi limitati non si scalano: si tengono a mente o su carta.

Non esiste il riposo breve o lungo: punti ferita, slot, Incanalare divinità, Forma selvatica e
Recupero energie si rimettono a posto a mano, uno per uno.

Non c'è bottino: quando i personaggi trovano qualcosa dentro un punto d'interesse, il master deve
andare nel Compendio, trovare l'oggetto e assegnarlo. E funziona solo per gli oggetti che nel
Compendio esistono già.

Non ci sono punti esperienza né passaggio di livello.

La misura è in linea retta e non conosce gli ostacoli; le armi non hanno portata dichiarata,
quindi il tavolo non dice mai «fuori portata».

Per interpretare un PNG bisogna aprire una finestra che copre la mappa.

La cronaca di dove si è rimasti non ha più un posto dove stare, da quando il pannello delle note
è stato tolto.

I token dei mostri sono lettere su un cerchio colorato mentre quelli dei personaggi sono ritratti:
la differenza si nota.

---

## 15. Le entità del tavolo, oggi

| Entità | Cos'è | Dove vive | Ha una schermata | Stato in partita | Sta sulla mappa | Si apre | Collegabile |
|---|---|---|---|---|---|---|---|
| Scena | cosa è aperto ora | codice (2) + luoghi (15) | menu in alto | sì: quale è aperta | — | — | ai luoghi |
| Mappa | l'immagine di fondo | dentro la scena | il centro del tavolo | no, ma tutto ciò che ci sta sopra sì | è la mappa | — | — |
| Luogo | un posto del mondo | file JSON | scheda del Compendio, o scena intera | quali sono stati visitati | come segnaposto a Bëllindë | sì | ai PNG, ad altri luoghi, alle scene |
| Punto d'interesse | cosa succede in un punto | codice | segno sulla mappa, scheda, voce della Guida | svelato, spostato | sì | sì | no |
| Personaggio giocante | uno dei sei | codice (scheda + azioni + token) | medaglione, scheda, pannello azioni | punti ferita, posizione, iniziativa, condizioni, inventario | sì | sì | all'inventario |
| PNG narrativo | una persona da interpretare | due posti: lista da 31, Compendio da 134 | scheda rapida, voce del Compendio | no | no, non di per sé | sì | ai luoghi |
| Creatura | una scheda da combattimento | codice | menu del bestiario, pannello Selezione | quando è sulla mappa | sì, se messa | no, solo il pannello | no |
| Token | qualunque cosa stia sulla mappa | stato della partita | segno sulla mappa | è tutto stato | sì | pannello Selezione | no |
| Oggetto | una cosa che si può possedere | Compendio | scheda, riga dell'inventario | proprietario | no | sì | a un personaggio o al gruppo |
| Prova | abilità + difficoltà + esiti | dentro luoghi e punti | pulsante «Chiedi», riquadro del giocatore | la richiesta aperta | no | no | al punto che svela |
| Azione | cosa può fare in un turno | codice, generata da script | pannello Azioni | usi e slot: **no, non tracciati** | no | no | al bersaglio |
| Scheda narrativa | un testo lungo della scena | codice (40) | Guida, o a schermo intero | no | no | sì | alla scena |
| Quest | un filo dell'avventura | Compendio (37) | scheda | stato di visibilità | no | sì | ai luoghi e ai PNG |
| Fazione | un gruppo di potere | Compendio (22) | scheda | visibilità | no | sì | ai PNG |
| Inventario | cosa ha ciascuno | stato della partita | dentro la scheda | sì | no | no | agli oggetti |
| Cronaca | dove si è rimasti | stato della partita | **nessuna: tolta in v72** | sì | no | no | no |
| Registro | cosa è successo | stato della partita | colonna, e Diario per l'archivio | sì | no | sì | no |

Le due righe che saltano all'occhio sono le ultime dell'elenco delle entità: la cronaca ha un
dato ma non ha più una schermata, e le azioni hanno una schermata ma non hanno stato. Sono i due
buchi più visibili del sistema attuale.
