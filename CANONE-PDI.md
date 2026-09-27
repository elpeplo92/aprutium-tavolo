# Canone dei punti d'interesse (PDI) — v104

Regole concordate con Giuseppe per scrivere una scena e i suoi punti d'interesse. Modello già scritto così: **Il Pozzo Cieco** (`contenuti/scene/sotto.json`, `id: "pozzo"`). Il formato tecnico è `schemaVersion: 3`.

## 1. La scena

Ogni scena è un file `contenuti/scene/<id>.json`. Oltre a mappa, regole e punti ha:

- **`citta`**: la città a cui appartiene. Nel menu Scena le scene sono raggruppate per città, e i luoghi stanno rientrati sotto la mappa del borgo.
- **`intro`**: l'introduzione alla scena, in cima alla Guida.
  - `leggi`: il testo da leggere ai giocatori, con il pulsante «Mostra ai giocatori». Contiene solo cose che i personaggi sanno o vedono.
  - `note`: poche indicazioni per il master.
  - `ingressi`: se il luogo ha più ingressi, uno per ingresso: `{da, primo, poi, note}`. `primo` è il PDI in cui arrivano, `poi` è il PDI successivo. La Guida mostra «Se entrano da X → vai a …».
- **`punti`**: i PDI **in ordine di gioco**. L'ordine del file è l'ordine della Guida.

Niente riferimenti tra parentesi quadre stile Roll20 (`[PNG — Nome]`). Si scrive il nome e basta.

## 2. Il punto d'interesse

Un PDI è **un posto sulla mappa**. Quello che si scopre *dentro* un posto è un **modulo**, non un altro PDI.

| Campo | A cosa serve |
|---|---|
| `id` | Nome interno. **Non si cambia mai** dopo averlo giocato: è la chiave dello stato su Firebase. |
| `title`, `kind` | Titolo e tipo (icona): porta, trappola, enigma, dettaglio, scontro, stanza, corridoio, scena, persona. |
| `image` | Illustrazione. Compare grande nella scheda e piccola nella Guida. |
| `text` | **Da leggere ai giocatori**. Dentro vanno **seminate** le frasi che portano ai moduli-indizio. |
| `breve` | **In breve**, per il master: 2-3 righe su cosa succede qui e dove si va dopo. |
| `gm` | Note per il master: segreti, collegamenti alla storia. |
| `nota` | Scoperta: `cd` (0 = evidente, basta vederlo), `entro` (metri), `necessario` (se non si può perdere). |
| `moduli` | Cosa può succedere qui, in ordine. |

### Scoperta dei PDI

- Ai giocatori un PDI **non esiste finché il master non lo svela**. Svelato = lo vedono tutti.
- Un PG che ha il punto **in vista** (9 m, senza muri, oppure entro `nota.entro`) e ha **Percezione passiva ≥ CD** lo nota: il punto lampeggia al master e i giocatori si fermano («Fermi tutti») finché il master non lo svela o li fa ripartire.
- Se un PG tira **Percezione** per conto suo, il tiro vale per tutti i punti non svelati che ha in vista.
- Niente CD che scende avvicinandosi: si usa `nota.entro`.
- Un punto **necessario** che nessuno ha notato compare in rosso nella Guida: il master deve farlo trovare in un altro modo.

## 3. I moduli

Tipi: **dettaglio**, **dialogo**, **prosecuzione**, **scontro**, **bottino**.

Ogni modulo, in quest'ordine:

1. **`parte`**: come parte.
   - `indizio`: il master lo **semina** nel testo del punto, e sono i giocatori a decidere se andarci. Richiede **`seme`**, la frase **copiata identica** dal `text` del punto: nella Guida è evidenziata e cliccabile.
   - `evento`: succede da solo (una trappola che scatta, il ritmo che parte).
   - `nascosto`: lo nota solo chi ha l'occhio buono.
2. **`innesco`** — *Cosa lo fa partire*, per il master: cosa fanno i giocatori per arrivare qui.
3. **`leggi`** — *Da leggere*: cosa vedono o sentono **prima** di tirare. Si può mostrare con «Mostra ai giocatori…».
4. **`note`** — per il master.
5. **`prove`** — le prove stanno **dentro** il modulo, e ce ne possono essere più d'una.
   - `abilita`: una o più (`["Percezione","Indagare"]`); `cd`.
   - `gruppo`: `chi` (tira chi lo fa), `tutti` (ognuno per sé), `migliore` (conta il tiro più alto), `meta` (riesce se passa almeno metà del gruppo).
   - `esiti` a fasce: `criticalFailure`, `failure`, `baseSuccess`, `fullSuccess`, `natural20`, con `min`/`max` sul totale. Ogni fascia ha `leggi`, il testo mostrabile solo a chi l'ha ottenuta, ed eventuali `effetti` (`svela` o `apri` un altro punto).
   - Le fasce si accendono da sole quando arrivano i tiri.
6. **`dopo`** — *E adesso*, per il master: cosa cambia, cosa sanno davvero, a cosa si collega.
7. **`rilancio`** — una frase che **ridà la parola ai giocatori** («… Che cosa fate?»). Si può mostrare.
8. **`daqui`** — *Da qui*: altri moduli dello stesso punto o il PDI successivo. Diventano pulsanti.

Regole di scrittura:
- Istruzioni per il master e testo da leggere **mai mescolati** nello stesso campo.
- Niente segreti nei campi mostrabili (`text`, `leggi`, `esiti.leggi`, `rilancio`).
- I testi nuovi non ancora approvati da Giuseppe hanno `"bozza": true` (sul modulo) o `"breveBozza": true`.
- Quello che il master mostra resta nel punto: i giocatori lo ritrovano in «Cosa avete scoperto qui» e nella loro Guida.

## 4. Controlli automatici

`python3 build.py` si ferma se:
- una frase `seme` non è identica al testo del punto;
- un `id` contiene `__` (moduli) o `-` (prove);
- «Da qui» punta a qualcosa che non esiste;
- `parte` non è indizio, evento o nascosto.
