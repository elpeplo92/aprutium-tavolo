# Compendio di Aprutium — schema delle voci (per gli agenti di estrazione)

Scrivi un file JSON: un array di voci. Ogni voce:

```json
{
 "id": "slug-unico-minuscolo-senza-accenti",
 "cat": "luogo | png | fazione | mito | quest | oggetto | crociata | mondo",
 "city": "julianova | mushane | bellinde | teramum | strada | null",
 "group": "sotto-gruppo dentro la città o la categoria (es. 'Concilio Ristretto', 'Abbazia di San Pietro', 'Famiglie', 'Rocca dei Melacera', 'La guardia', 'Il Borgo Vecchio', 'La cellula di Ceruso', 'Città Alta', 'Porte'...)",
 "title": "Nome",
 "sub": "una riga: ruolo / tipo / soprannome",
 "img": "nome file del ritratto o immagine se lo conosci (dalla lista in IMMAGINI.txt), altrimenti null",
 "state": "visitato | noto | segreto   (luoghi: visitato = i PG ci sono stati; noto = ne hanno sentito parlare; segreto = non lo conoscono) — per i PNG: incontrato | noto | segreto",
 "status": "SOLO PNG: una riga di stato senza spoiler: vivo/morto, dove sta ora, come ha lasciato i PG (es. 'Morto a Mushanè per mano di Maximus', 'Vivo. Marcia con la Crociata', 'Vivo. A Bëllindë, sergente della guardia. Vi ha visti scendere nel pozzo')",
 "pub": "TESTO PER I GIOCATORI. Solo ciò che i personaggi hanno visto, sentito o scoperto nel corso degli Atti, più la descrizione 'da leggere' del luogo/persona. Prosa, 1-4 paragrafi. Niente numeri di CD, niente segreti, niente 'in realtà'. Se un fatto lo hanno scoperto, scrivilo come lo sanno loro.",
 "gm": "TESTO SOLO MASTER. Segreti, verità, agganci, prove e CD, cosa non sanno. Può essere vuoto.",
 "atti": [1, 2],   "numeri degli Atti in cui compare (1..16)",
 "links": ["id-di-altre-voci-collegate"]
}
```

Regole:
- NIENTE SPOILER in `pub`. Il test: un giocatore che legge `pub` non deve scoprire niente che il suo personaggio non sappia già. Tutto il resto in `gm`.
- `state` lo decidi dagli Atti (i diari di sessione): se i PG ci sono stati o l'hanno incontrato = visitato/incontrato; se ne hanno solo sentito parlare = noto; altrimenti segreto.
- Testi in italiano, stile asciutto e concreto, dialetto teramano nelle battute dei popolani se presente nella fonte.
- Non inventare fatti nuovi sul mondo. Se una cosa non è nei documenti, non c'è. Se devi proporre qualcosa (es. una fazione descritta ma senza nome), marcala "(proposta)" dentro `gm`.
- Gli id devono essere stabili e leggibili: `jn-palazzo-del-sole`, `mu-abate-gofferio`, `be-ruggiero-de-santi`, `faz-loto-nero`, `mito-due-lune`, `q-rocco`, `ogg-perla-silenziosa`.
- Le immagini disponibili sono elencate in IMMAGINI.txt: usa il nome file esatto solo se corrisponde chiaramente.
