#!/usr/bin/env python3
"""Build del sito Aprutium Tavolo.

Il sorgente è src/tavolo.html e usa le immagini in img/ (percorsi "img/xxx.jpg").
  python3 build.py            → rigenera i dati dai file di contenuto (contenuti/**), poi copia
                                 src/tavolo.html in index.html (quello servito da GitHub Pages)
  python3 build.py --contenuti → solo la rigenerazione dei dati dentro src/tavolo.html
  python3 build.py --inline   → scrive dist/tavolo-unico.html con tutte le immagini incorporate
                                 in base64 (file unico, serve solo per l'artifact claude.ai)
  python3 build.py --extract FILE.html
                              → il contrario: prende un file unico con immagini base64 e lo
                                 riporta in src/tavolo.html + img/ (usalo se qualcuno ti passa
                                 una versione "tutto in uno" del tavolo)
"""
import base64, hashlib, mimetypes, os, re, shutil, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "src", "tavolo.html")
OUT = os.path.join(ROOT, "index.html")
IMG = os.path.join(ROOT, "img")
EXT = {"jpeg": "jpg", "jpg": "jpg", "png": "png", "webp": "webp", "gif": "gif", "svg+xml": "svg"}

def extract(path):
    os.makedirs(IMG, exist_ok=True)
    html = open(path, encoding="utf-8").read()
    n = 0
    def repl(m):
        nonlocal n
        kind, b64 = m.group(1), m.group(2)
        data = base64.b64decode(b64)
        name = hashlib.md5(data).hexdigest()[:12] + "." + EXT.get(kind, kind)
        p = os.path.join(IMG, name)
        if not os.path.exists(p):
            open(p, "wb").write(data)
        n += 1
        return "img/" + name
    out = re.sub(r"data:image/([a-z+]+);base64,([A-Za-z0-9+/=]+)", repl, html)
    os.makedirs(os.path.dirname(SRC), exist_ok=True)
    open(SRC, "w", encoding="utf-8").write(out)
    print(f"ok: {n} immagini estratte in img/, sorgente scritto in src/tavolo.html")

def inline():
    html = open(SRC, encoding="utf-8").read()
    n = 0
    def repl(m):
        nonlocal n
        p = os.path.join(ROOT, m.group(0))
        mt = mimetypes.guess_type(p)[0] or "image/jpeg"
        n += 1
        return f"data:{mt};base64," + base64.b64encode(open(p, "rb").read()).decode()
    out = re.sub(r"img/[0-9a-f]{12}\.[a-z]+", repl, html)
    os.makedirs(os.path.join(ROOT, "dist"), exist_ok=True)
    dst = os.path.join(ROOT, "dist", "tavolo-unico.html")
    open(dst, "w", encoding="utf-8").write(out)
    print(f"ok: {n} immagini incorporate, {dst} ({len(out)//1024//1024} MB)")

CONT = os.path.join(ROOT, "contenuti")
CONT_START, CONT_END = "/*@CONTENUTI*/", "/*@/CONTENUTI*/"
LUO_START, LUO_END = "/*@LUOGHI*/", "/*@/LUOGHI*/"
MONDO_START, MONDO_END = "/*@MONDO_DATA*/", "/*@/MONDO_DATA*/"   # blocco vecchio (v45-v48), sostituito da CONTENUTI
GRUPPI_MONDO = ["Atlante","Le grandi potenze","I regni umani","I popoli della montagna","I popoli delle foreste e del deserto",
    "Le orde e i popoli della guerra","Le terre di nessuno","Le dieci province dell'Impero","Il Ducato","Le otto contee",
    "La Costa del Sale","La Val Vibrata","Le Terre del Nord","Le Terre di Mezzo","Il Cuore del Ducato","La Terra dei Calanchi","La Montagna del Gigante","Le Terre Selvagge"]
CITTA = ["julianova", "mushane", "bellinde", "teramum", "strada"]
PLAYER_SECS = ["Aspetto esterno", "Entrando", "Cosa si vede automaticamente"]

def _runtime(e):
    """Da schema 'Formato dei contenuti' (chiavi italiane) alla forma che il tavolo legge. I file del Mondo
    (chiavi già in forma tavolo: title, sub, cat...) passano invariati."""
    if "titolo" not in e: return e
    r = {"id": e["id"], "cat": e.get("tipo", "luogo"), "title": e["titolo"], "sub": e.get("sottotitolo") or "",
         "city": e.get("citta"), "group": e.get("gruppo") or "", "img": e.get("img"), "mappa": e.get("mappa"),
         "state": e.get("stato") or "noto", "status": e.get("status"), "atti": e.get("atti") or [], "links": e.get("links") or [],
         "pub": e.get("pub") or [], "gm": e.get("gm") or [], "prove": e.get("prove") or [], "scheda": e.get("scheda") or {},
         "livello": e.get("livello"), "parent": e.get("parent"), "tavolo": e.get("tavolo"), "colore": e.get("colore"),
         "tag": e.get("tag") or [], "compendio": e.get("compendio", True)}
    sp = e.get("segnaposto")
    if sp: r["lid"] = sp.get("id"); r["num"] = sp.get("num"); r["segnaposto"] = sp
    return {k: v for k, v in r.items() if v is not None}

def _luoghi_tavolo(files, img_of):
    """I luoghi con un segnaposto sulla mappa di Bëllindë diventano l'array LUOGHI (handout a doppia sezione
    del tavolo: fields + secs + checks). Una cosa, un file: la fonte è contenuti/luoghi, non più il sorgente."""
    out = []
    for e in files:
        sp = e.get("segnaposto")
        if not sp or sp.get("scena") != "bellinde": continue
        fields = {"Nome": e["titolo"]}; fields.update(e.get("scheda") or {})
        secs = [{"t": b["t"], "txt": b["txt"]} for b in (e.get("pub") or [])]
        gm = [{"t": b["t"], "txt": b["txt"]} for b in (e.get("gm") or [])]
        # 'Cosa sta succedendo oggi' e 'Persone presenti' subito dopo i blocchi giocatore, poi la sezione prove, poi il resto
        first = [b for b in gm if b["t"] in ("Cosa sta succedendo oggi", "Persone presenti")]
        rest = [b for b in gm if b not in first]
        secs += first
        if e.get("prove"): secs.append({"t": "Cosa si può notare", "checks": e["prove"]})
        secs += rest
        out.append({"id": sp["id"], "num": sp.get("num"), "name": e["titolo"], "x": sp.get("x"), "y": sp.get("y"),
                    "fields": fields, "secs": secs, "img": img_of(e.get("img")) or ""})
    out.sort(key=lambda l: l["num"] or 0)
    return out

def contenuti():
    """Una cosa, un file: legge contenuti/<categoria>/*.json e riscrive i blocchi generati dentro src/tavolo.html.
    Le immagini si scrivono col nome leggibile; qui diventano il percorso tecnico img/xxx (COMP_IMG del sorgente +
    contenuti/_immagini.json) o restano un URL http(s). Un nome che non si risolve viene segnalato, non inventato."""
    import json
    html = open(SRC, encoding="utf-8").read()
    i = html.index("const COMP_IMG="); j = html.index("\n", i)
    comp_img = json.loads(html[i+len("const COMP_IMG="):j].rstrip(";"))
    alias_p = os.path.join(CONT, "_immagini.json")
    if os.path.exists(alias_p): comp_img.update(json.load(open(alias_p, encoding="utf-8")))
    mancanti = []
    def img_of(v, who="?", k="img"):
        if not v: return None
        if v.startswith("img/") or v.startswith("http"): return v
        if v in comp_img: return comp_img[v]
        mancanti.append(f"{who}: {k} «{v}»"); return None
    raw, voci = [], []
    for cat in sorted(os.listdir(CONT)):
        d = os.path.join(CONT, cat)
        if not os.path.isdir(d): continue
        for fn in sorted(os.listdir(d)):
            if not fn.endswith(".json") or fn.startswith("_"): continue
            e = json.load(open(os.path.join(d, fn), encoding="utf-8"))
            assert e["id"] == fn[:-5], f"{cat}/{fn}: l'id deve essere il nome del file"
            raw.append(e)
            r = dict(_runtime(e))
            for k in ("img", "mappa"):
                if isinstance(r.get(k), str): r[k] = img_of(r[k], e["id"], k)
            r.pop("segnaposto", None)
            voci.append(r)
    ordine = {"atlante":0,"nazione":1,"provincia":2,"ducato":3,"contea":4,"borgo":5,"quartiere":6,"luogo":7}
    def key(e):
        g = e.get("group")
        return (e.get("cat") != "mondo", CITTA.index(e["city"]) if e.get("city") in CITTA else 9, ordine.get(e.get("livello"), 9),
                GRUPPI_MONDO.index(g) if g in GRUPPI_MONDO else 99, e.get("num") or 0, e["title"])
    voci.sort(key=key)
    cats = sorted({e["cat"] for e in voci})
    blocco = (CONT_START + "const CONTENUTI_CATS=" + json.dumps(cats) + ";const CONTENUTI_DATA="
              + json.dumps(voci, ensure_ascii=False, separators=(",", ":")) + ";" + CONT_END)
    if CONT_START in html:
        a = html.index(CONT_START); b = html.index(CONT_END) + len(CONT_END); html = html[:a] + blocco + html[b:]
    elif MONDO_START in html:
        a = html.index(MONDO_START); b = html.index(MONDO_END) + len(MONDO_END); html = html[:a] + blocco + html[b:]
    else:
        anchor = "const COMPENDIO_BASE="; html = html.replace(anchor, blocco + "\n" + anchor, 1)
    luoghi = _luoghi_tavolo([e for e in raw if e.get("tipo") == "luogo"], lambda v: img_of(v, "LUOGHI"))
    blocco_l = LUO_START + "const LUOGHI=" + json.dumps(luoghi, ensure_ascii=False, separators=(",", ":")) + ";" + LUO_END
    if LUO_START in html:
        a = html.index(LUO_START); b = html.index(LUO_END) + len(LUO_END); html = html[:a] + blocco_l + html[b:]
    else:
        a = html.index("const LUOGHI="); b = html.index("\n", a); html = html[:a] + blocco_l + html[b:]
    open(SRC, "w", encoding="utf-8").write(html)
    n = {c: sum(1 for e in voci if e["cat"] == c) for c in cats}
    print(f"ok: contenuti scritti in src/tavolo.html — {n}; {len(luoghi)} segnaposto di Bëllindë"
          + (f"\n  IMMAGINI NON RISOLTE ({len(mancanti)}): " + "; ".join(mancanti) if mancanti else ""))

def build():
    contenuti()
    shutil.copyfile(SRC, OUT)
    html = open(SRC, encoding="utf-8").read()
    used = set(re.findall(r"img/[0-9a-f]{12}\.[a-z]+", html))
    missing = [u for u in used if not os.path.exists(os.path.join(ROOT, u))]
    ver = re.search(r'Versione della pagina">([^<]+)<', html)
    print(f"ok: index.html aggiornato ({len(html)//1024} KB), versione {ver.group(1) if ver else '?'}, "
          f"{len(used)} immagini usate" + (f", MANCANTI: {missing}" if missing else ""))
    if missing: sys.exit(1)

if __name__ == "__main__":
    a = sys.argv[1:]
    if a[:1] == ["--inline"]: inline()
    elif a[:1] == ["--contenuti"]: contenuti()
    elif a[:1] == ["--extract"]: extract(a[1])
    else: build()
