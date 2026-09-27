# Aprutium — i confini del modello, e cosa manca per fare a meno di me

Sei domande poste prima di dare l'incarico a Codex. Verificato sul codice alla v74.

**Correzione a `MODELLO-DATI.md`:** lì ho scritto che le azioni dei personaggi vengono
«incollate» in `tavolo.html`. Sbagliato: lo script le scrive da solo nel file, aprendolo e
riscrivendo il blocco. Nessun passaggio a mano. Il dettaglio sta alla domanda 5.

---

## 1. Cosa deve viaggiare insieme in una scena

Prendendo solo ciò che esiste oggi, per Sotto Bëllindë.

**Appartengono alla scena e devono stare nello stesso oggetto** — perché sono la stessa
decisione d'autore e separarli riproduce il difetto attuale:

- identità e nome della scena;
- **i punti d'interesse, già in ordine di gioco.** Il punto e la sua posizione nella sequenza
  sono un fatto solo: oggi sono due liste che qualcuno deve tenere allineate a mano, ed è
  esattamente il difetto da eliminare;
- quali schede narrative si usano qui e in quale ordine (l'elenco, non i testi);
- gli interruttori di comportamento: nebbia sì/no, chi vede i token (tutti / solo il gruppo /
  nessuno), e se gli strumenti da dungeon sono disponibili. Oggi gli ultimi due sono `if` scritti
  a mano sul nome della scena;
- quali token si trovano qui all'inizio.

**Restano riferimenti ad altri oggetti** — perché sono condivisi o vivono altrove:

- **la mappa**: immagine, dimensioni, griglia, scala in metri. Vedi la domanda 2;
- **le schede narrative**: sono quaranta, valgono per tutta la campagna, e una scena ne cita
  alcune. Il testo sta nella biblioteca, la scena tiene solo i nomi;
- **le creature del bestiario** e **i personaggi non giocanti** che compaiono: stessa logica;
- **i luoghi del Compendio** collegati, che esistono già come contenuto per conto loro.

**Non entra nel contenuto, è stato della partita:** dove sono i token adesso, quali punti sono
stati svelati, dove sono stati trascinati, quale nebbia è scoperta, quali porte sono aperte,
l'iniziativa e i turni, il registro.

Un caso di confine che va deciso e non ha risposta ovvia: **muri e porte.** Descrivono la
struttura fisica del posto, quindi sembrano contenuto; ma le porte si aprono e si chiudono
giocando, quindi la loro *posizione* è contenuto e il loro *stato* è partita. Oggi sono la stessa
cosa: un unico elenco dove ogni casella vale «muro», «porta chiusa», «passaggio segreto».

---

## 2. Cosa è della scena e cosa della mappa

Questa distinzione oggi non esiste affatto, e la risposta più importante è una sola:

**Tutto lo stato della mappa è globale, non per scena.** La nebbia già scoperta, i muri, le
porte, la griglia e le posizioni dei token sono un unico blocco nello stato della partita, senza
nessuna chiave che dica a quale mappa appartengano. Oggi funziona perché di mappe VTT ce n'è
**una sola**. Nel momento in cui ne aggiungete una seconda, le due si sovrappongono: la nebbia
scoperta nel dungeon risulta scoperta anche nella mappa nuova, i muri restano dove non ci sono, e
i token si trovano alle coordinate di un'altra mappa.

Va sistemato **prima** di aggiungere la seconda mappa, non dopo. Non è un difetto teorico:
Teramum sarà la seconda mappa.

Fatta questa premessa, la divisione corretta:

**Della mappa fisica** — sopravvivono se cambia la scena narrativa ma resta la stessa immagine:
l'immagine e le sue dimensioni; la griglia (dimensione della casella e scostamento); la scala in
metri per casella (oggi 1,5 m, scritta come numero fisso in due punti del codice, non come dato);
i muri; la posizione delle porte; e **le coordinate** di qualunque cosa stia sulla mappa.

**Della scena narrativa** — cambiano anche restando sulla stessa immagine: quali punti
d'interesse esistono e cosa contengono; l'ordine di gioco; le schede narrative; quali token ci
sono; se la nebbia è attiva; quali strumenti servono al master.

Il punto delicato sono le **coordinate dei punti d'interesse**, perché stanno a cavallo: *dove*
è un fatto della mappa, *cosa c'è lì* è un fatto della scena. Il modo pulito di dirlo è che il
punto appartiene alla scena e porta con sé una posizione **espressa in frazione della mappa**
(metà larghezza, un terzo altezza) invece che in pixel. Così la stessa scena regge una mappa a
risoluzione doppia senza toccare niente, e due scene diverse possono mettere cose diverse nello
stesso posto.

Se si sceglie questa strada, va convertito **anche** ciò che è già in Firebase: gli
`S.poiPos` sono in pixel e hanno la precedenza sui valori del file. Convertirli o cancellarli,
ma non lasciarli com'è mescolando due unità di misura.

---

## 3. Progettazione, regia e cronaca: gli undici punti

Classificazione completa delle note del master, come sono scritte oggi.

| Punto | Progettato | Regia | Cronaca |
|---|---|---|---|
| Il pozzo con la scala | dove porta, i pioli nuovi come indizio | — | il riferimento a Rocco è indizio, non cronaca |
| La Porta Murata (crollata) | i risuonatori, la CD, l'effetto di romperli | — | **molta**: «aperta nella sessione di settembre», chi ha resistito, quale comando viene dopo |
| La breccia di Adamus | il percorso, dove sbuca, che non è una scorciatoia | — | **«RULING (sessione set 2026)»**: la decisione presa quella sera |
| I solchi nel pavimento | Area 1, i comandi, TS Sag CD 13, le rune | «fallire = un passo, mai di più» | — |
| La linea sul pavimento | Area 2, i sei Armigeri si attivano | **«Rivelali qui»**, «Maximus riconosce senza tiri» | — |
| I rilievi | Area 3, il puzzle, Storia/Religione CD 14 | — | — |
| Le catene | Area 4, l'ordine ricevuto, le catene reggono 2 round | «spezzare il vincolo è la soluzione migliore» | — |
| La Camera delle Memorie | Area 5, lore | «se vuoi un incontro: uno Spettro» | — |
| Micuccio | Area 6, le battute, come si libera | «mai ucciderlo per questo» | — |
| Il Sigillo | il climax, le battute, la purificazione | «solo poi il ferro» | — |
| La porta murata | uscita alternativa | rimanda alla scheda | — |

Quindi: **nove punti su undici sono progettazione pulita**, con dentro qualche riga di regia. La
cronaca sta tutta in due punti, la Porta Murata e la breccia.

**Cosa farne.** Non serve inventare un campo strutturato: la cronaca ha già una casa. Nello stato
della partita esiste `gmNotes`, un testo lungo che comincia con «DOVE ERAVAMO (fine sessione,
domenica)» e racconta esattamente dov'è rimasto ognuno, chi è in fuga, quale comando viene dopo.
È già la cronaca, è già in Firebase, ed è già aggiornabile senza pubblicare.

Il problema è che in v72 ho tolto il pannello che la mostrava, perché Giuseppe l'aveva definita
obsoleta. **I dati ci sono ancora, l'interfaccia no.** Quindi la cronaca è finita dentro le note
dei punti per mancanza di un posto dove metterla.

La regia invece resta contenuto: è scritta dall'autore insieme al resto e non cambia giocando.
Se un giorno vale la pena distinguerla, basta un secondo blocco di testo accanto alle note.

---

## 4. Le tre doppie fonti

**Compendio: file contro `comp2` e `compOv`.** L'intento era permettere al master di creare una
voce o correggerne una **durante la sessione**, quando i giocatori inventano un PNG o si scopre
un dettaglio, senza fermarsi a pubblicare il sito. Oggi i file contengono tutto il canone
scritto: 375 voci, di cui 128 personaggi con note del master, la struttura ad albero, gli stati
di visibilità, i collegamenti. Firebase contiene solo quello che il master ha toccato al tavolo —
poco, ma è l'unica copia di quelle correzioni, e non esiste nessun modo di sapere quali voci sono
state modificate. Scegliendo brutalmente i file si perdono le correzioni fatte in partita e non
si saprebbe nemmeno quali erano. Scegliendo Firebase non si perde niente: lì dentro non c'è
contenuto originale, solo modifiche a contenuto che esiste già nei file. **È la doppia fonte meno
costosa da risolvere**, purché prima si guardi cosa c'è dentro `compOv` e `comp2` in questo
momento e lo si riporti nei file.

**Coordinate: file contro `poiPos`.** L'intento era pratico: mettere a occhio un punto sulla
mappa trascinandolo, invece di indovinare i pixel. I file contengono le posizioni originali di
tutti e undici i punti; Firebase contiene solo quelli spostati, e vince sempre. Scegliendo i file
si perdono gli aggiustamenti fatti al tavolo, e non si vede quali punti erano stati spostati.
Scegliendo Firebase si perdono i punti mai toccati, che lì dentro non esistono. Qui la risposta
giusta non è scegliere: è **leggere `poiPos` una volta, riportare quelle posizioni nei file, e poi
decidere se il trascinamento continua a esistere**. Se continua, serve una regola dichiarata e un
modo di vedere che un punto è spostato.

**Personaggi: 31 contro 134.** L'intento era diverso fin dall'inizio, e infatti non è un
doppione vero. Ho verificato: **tutti e 31 i nomi di `PNGS` esistono anche nel Compendio**, e
nessuno dei 31 ha un'immagine che al Compendio manchi. Sono due usi diversi della stessa persona.

Cosa ha ciascun lato e l'altro no. `PNGS` ha i **campi strutturati**: Statistiche (29 voci su
31), Ruolo (25), Cosa vuole (23), Età (22), Voce (19), Sa (18), Non sa (18), Luogo abituale (16).
Sono etichette separate, non prosa: servono al master che durante la scena vuole sapere in tre
secondi cosa quel tale sa e cosa non sa. Tutti e 31 hanno anche sezioni di testo. Il Compendio ha
invece lo **stato di visibilità**, i collegamenti, la città, gli atti in cui compare, e la
divisione fra ciò che i giocatori possono leggere e ciò che è riservato — cose che `PNGS` non ha
affatto.

Scegliendo brutalmente il Compendio si perdono i campi strutturati dei 31 più utili al tavolo, e
si perde la scheda rapida. Scegliendo `PNGS` si perdono 103 personaggi su 134 e tutta la
visibilità. **La perdita vera non è un lato o l'altro: è che oggi la stessa persona può dire due
cose diverse e nessuno se ne accorge.**

---

## 5. Lo script delle azioni

`azioni_v64.py`, 140 righe, scritto il 12 settembre.

**Cosa legge.** Un solo file: `src/tavolo.html`, per estrarne il blocco `DEFAULT_STATE`.

**Cosa contiene.** Le liste complete delle azioni dei sei personaggi, scritte a mano dentro lo
script — non calcolate. Per ognuna: nome, tipo, economia d'azione, bonus d'attacco, formula del
danno e una nota. Le regole D&D 2024 sono **dentro le note**: le proprietà di maestria delle armi
(Sap, Graze, Topple, Slow, Nick), i livelli di slot, le CD dei tiri salvezza, gli usi per riposo,
i talenti e i privilegi di classe che modificano i numeri (Duellare +2, Adepto elementale, Armi
possenti, Discepolo della vita, Maestro delle armature pesanti, Recupero energie 2/riposo breve).
Alessandros 16 azioni, Adamus 19, Luigis 13, Mattheus 25, Maximus 14, Vicarus 21.

**Cosa produce.** Non produce un file: **riscrive direttamente `src/tavolo.html`**, sostituendo
il blocco `DEFAULT_STATE` con le azioni aggiornate. Nessun passaggio manuale, e nessun
salvataggio dell'originale.

**Può entrare nel repository così com'è?** Quasi. C'è una sola dipendenza dal mio ambiente: la
seconda riga contiene il percorso assoluto `/home/claude/tavolo/src/tavolo.html`. Va reso
relativo. Nient'altro: usa solo `json` e `re`, che stanno in Python di serie. Su Windows con
Codex funziona così, corretta quella riga. **Non servono altri file.**

**Conoscenza che sta solo lì.** Sì, e non è poca: è la traduzione delle sei schede dei giocatori
nelle regole 2024. Le schede `SHEETS` nel tavolo contengono i numeri grezzi (caratteristiche,
competenza, equipaggiamento, talenti); lo script contiene **cosa ognuno può fare in un turno e
con quali numeri**, che è un'interpretazione delle regole, non un calcolo. Se sparisse,
rifarlo significherebbe rileggere le sei schede e il regolamento da capo. Vanno con lui anche le
cinque incongruenze già segnalate a Giuseppe e mai risolte: la classe armatura di Alessandros
(22 sulla scheda, 18 secondo l'equipaggiamento), il bonus agli incantesimi di Vicarus (+10 sulla
scheda, +8 col bastone, CD 16) e i suoi cinque trucchetti invece di quattro, gli undici
incantesimi preparati di Adamus contro un massimo di nove più Trovare famiglio che un druida non
ha, i due talenti di quarto livello di Mattheus, i sette incantesimi preparati di Alessandros
contro un massimo di cinque. Finché non decide lui, i numeri dello script restano quelli della
scheda, non quelli del regolamento.

---

## 6. Le cinque cose che oggi dipendono ancora da me

Concrete, non teoriche.

**1. `azioni_v64.py` non è nel repository.** Sta nella mia cartella di lavoro. Finché non ci
entra, con il percorso corretto, le azioni dei personaggi non si possono rigenerare senza di me.
È la dipendenza più facile da togliere: un file e una riga.

**2. Non esiste uno script per importare le immagini.** La procedura è: prendere il file che
Giuseppe mette in `05_Immagini`, ridurlo a 1920 px sul lato lungo, salvarlo in jpg progressivo
qualità 85, rinominarlo col codice md5 del contenuto, scriverlo in `Sito/img/`, aggiungere una
riga a `contenuti/_immagini.json` che colleghi il nome leggibile al file. L'ho sempre fatta a
mano, comando per comando. Non è scritta da nessuna parte come procedura eseguibile. Ogni mappa e
ogni ritratto nuovo passa di qui.

**3. Il controllo visivo.** Prima di consegnare una versione apro la pagina in un browser
automatico, scatto lo schermo e **guardo l'immagine**: è così che ho trovato la nebbia a
quadretti, le etichette troppo grandi, i token sgranati, le proporzioni sbagliate. La prova
automatica non vede niente di tutto questo: preme i bottoni e basta. Se Codex non può guardare
un'immagine, quel controllo sparisce dal processo e resta solo Giuseppe che se ne accorge
giocando.

**4. I documenti del canone non stanno nel repository.** Le regole su come si scrivono i
contenuti, la direzione artistica, il formato delle voci, la storia degli Atti, il manuale del
mondo: sono nel Progetto claude.ai, non in `Sito`. Codex legge `CLAUDE.md`, `AVVENTURA.md` e
`MODELLO-DATI.md` — che coprono il tavolo — ma non ha accesso al canone dell'avventura. Finché
non vengono copiati nel repository, o resi accessibili in altro modo, per il canone si dipende da
me o da Giuseppe.

**5. La prova automatica non gira ancora su Windows.** Servono le due correzioni già dette:
l'indirizzo del file costruito con `pathToFileURL`, e il blocco della rete perché il test non
scriva nel Firebase vero della campagna. Finché non è verde sul suo PC, l'unico posto dove quella
prova è mai stata eseguita è il mio ambiente.

Una sesta, che non è una dipendenza ma un fatto: dalla v55 alla v74 ho scritto io ogni riga di
`tavolo.html`, e il file è un blocco unico da 1,5 MB. Chi ci mette mano la prima volta non ha
una mappa delle dipendenze interne — `CLAUDE.md` racconta cosa è stato fatto in ogni versione,
ma non quali funzioni si chiamano fra loro. Quella conoscenza non è documentata e non so
riassumerla onestamente: si ricava leggendo il file.
