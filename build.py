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
MONDO_START, MONDO_END = "/*@MONDO_DATA*/", "/*@/MONDO_DATA*/"

def contenuti():
    """Una cosa, un file: legge contenuti/mondo/*.json e riscrive il blocco MONDO_DATA in src/tavolo.html.
    Le immagini si scrivono col nome leggibile; qui diventano il percorso tecnico img/xxx (COMP_IMG del
    sorgente + contenuti/mondo/_immagini_nuove.json). Un nome che non si risolve viene segnalato, non inventato."""
    import json
    html = open(SRC, encoding="utf-8").read()
    i = html.index("const COMP_IMG="); j = html.index("\n", i)
    comp_img = json.loads(html[i+len("const COMP_IMG="):j].rstrip(";"))
    nuove_p = os.path.join(CONT, "mondo", "_immagini_nuove.json")
    if os.path.exists(nuove_p): comp_img.update(json.load(open(nuove_p, encoding="utf-8")))
    voci, mancanti = [], []
    ordine = {"atlante":0,"nazione":1,"provincia":2,"ducato":3,"contea":4,"borgo":5}
    for fn in sorted(os.listdir(os.path.join(CONT, "mondo"))):
        if not fn.endswith(".json") or fn.startswith("_"): continue
        e = json.load(open(os.path.join(CONT, "mondo", fn), encoding="utf-8"))
        assert e["id"] == fn[:-5], f"{fn}: l'id deve essere il nome del file"
        for k in ("img", "mappa"):
            v = e.get(k)
            if v and not v.startswith("img/"):
                if v in comp_img: e[k] = comp_img[v]
                else: mancanti.append(f"{e['id']}: {k} «{v}»"); e[k] = None
        voci.append(e)
    gruppi = ["Atlante","Le grandi potenze","I regni umani","I popoli della montagna","I popoli delle foreste e del deserto",
              "Le orde e i popoli della guerra","Le terre di nessuno","Le dieci province dell'Impero","Il Ducato","Le otto contee",
              "La Costa del Sale","La Val Vibrata","Le Terre del Nord","Le Terre di Mezzo","Il Cuore del Ducato","La Terra dei Calanchi","La Montagna del Gigante","Le Terre Selvagge"]
    voci.sort(key=lambda e: (ordine.get(e.get("livello"), 9), gruppi.index(e.get("group")) if e.get("group") in gruppi else 99, e["title"]))
    blocco = MONDO_START + "const MONDO_DATA=" + json.dumps(voci, ensure_ascii=False, separators=(",", ":")) + ";" + MONDO_END
    if MONDO_START in html:
        a = html.index(MONDO_START); b = html.index(MONDO_END) + len(MONDO_END)
        html = html[:a] + blocco + html[b:]
    else:
        anchor = "const COMPENDIO_BASE="
        html = html.replace(anchor, blocco + "\n" + anchor, 1)
    open(SRC, "w", encoding="utf-8").write(html)
    print(f"ok: {len(voci)} voci del Mondo scritte in src/tavolo.html" + (f"\n  IMMAGINI NON RISOLTE ({len(mancanti)}): " + "; ".join(mancanti) if mancanti else ""))

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
