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
        if not os.path.isdir(d) or cat in ("scene", "pg") or cat.startswith("_"): continue   # _bestiario ecc.: vedi bestiario()   # le scene hanno il loro blocco: vedi scene()
        for fn in sorted(os.listdir(d)):
            if not fn.endswith(".json") or fn.startswith("_"): continue
            e = json.load(open(os.path.join(d, fn), encoding="utf-8"))
            assert e["id"] == fn[:-5], f"{cat}/{fn}: l'id deve essere il nome del file"
            raw.append(e)
            r = dict(_runtime(e))
            for k in ("img", "mappa"):
                if isinstance(r.get(k), str): r[k] = img_of(r[k], e["id"], k)
            # v143: immagini dentro i blocchi (tavole, simboli degli dèi) delle voci scritte a blocchi
            for sez in ("pub", "gm"):
                for b in (r.get(sez) if isinstance(r.get(sez), list) else []):
                    for k in ("img", "simbolo"):
                        if isinstance(b.get(k), str): b[k] = img_of(b[k], e["id"], k)
                    for x in b.get("simboli") or []:
                        if isinstance(x.get("img"), str): x["img"] = img_of(x["img"], e["id"], "simboli")
            r.pop("segnaposto", None)
            voci.append(r)
    ordine = {"atlante":0,"nazione":1,"provincia":2,"ducato":3,"contea":4,"borgo":5,"quartiere":6,"luogo":7}
    def zona(e):
        # numero della zona/quartiere: dal titolo (i quartieri) o dal gruppo (i luoghi dentro un quartiere); 99 per il resto
        m = re.match(r"\s*(\d+)", e.get("group") or "") or re.match(r"\s*(\d+)", e["title"])
        return int(m.group(1)) if m else 99
    def natkey(t):
        return [int(x) if x.isdigit() else x.lower() for x in re.split(r"(\d+)", t)]
    def key(e):
        g = e.get("group")
        if e.get("cat") == "luogo":
            # città → zona (1..15, poi i gruppi senza numero) → nome del gruppo → prima il quartiere, poi i suoi luoghi → titolo naturale
            return (1, CITTA.index(e["city"]) if e.get("city") in CITTA else 9, zona(e), g or "",
                    0 if e.get("livello") == "quartiere" else 1, e.get("num") or 0, natkey(e["title"]))
        return (0, 0, 0, ordine.get(e.get("livello"), 9), GRUPPI_MONDO.index(g) if g in GRUPPI_MONDO else 99, e.get("num") or 0, natkey(e["title"]))
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
          + (f"\n  IMMAGINI NON RISOLTE ({len(mancanti)}): " + "; ".join(mancanti[:8]) + (" …" if len(mancanti) > 8 else "") if mancanti else ""))

SCENE_START, SCENE_END = "/*@SCENE*/", "/*@/SCENE*/"

def scene():
    """Una scena, un file: contenuti/scene/<id>.json contiene mappa, regole, punti d'interesse (già in
    ordine di gioco) e schede della guida. Qui si controllano e si scrivono nel blocco SCENE_DATA.
    Gli id delle scene e dei punti sono le chiavi dello stato su Firebase (S.scene, S.poiPos,
    S.poiRev): cambiarli fa perdere posizioni e svelamenti della partita in corso."""
    import json
    html = open(SRC, encoding="utf-8").read()
    d = os.path.join(CONT, "scene")
    scene, errori, visti, senza_img = [], [], {}, []
    alias = json.load(open(os.path.join(CONT, "_immagini.json"), encoding="utf-8"))
    for fn in sorted(os.listdir(d)):
        if not fn.endswith(".json") or fn.startswith("_"): continue
        s = json.load(open(os.path.join(d, fn), encoding="utf-8"))
        sid = s.get("id")
        if sid != fn[:-5]: errori.append(f"{fn}: l'id deve essere il nome del file")
        m = s.get("mappa") or {}
        for k in ("img", "larghezza", "altezza"):
            if not m.get(k): errori.append(f"{sid}: manca mappa.{k}")
        if (s.get("regole") or {}).get("token") not in ("tutti", "gruppo", "nessuno"):
            errori.append(f"{sid}: regole.token deve essere tutti / gruppo / nessuno")
        if (s.get("regole") or {}).get("muri") and not m.get("muri"):
            errori.append(f"{sid}: regole.muri è acceso ma manca mappa.muri")
        for p in s.get("punti") or []:
            pid = p.get("id")
            if not pid: errori.append(f"{sid}: un punto senza id"); continue
            if pid in visti: errori.append(f"{sid}: il punto «{pid}» esiste già in {visti[pid]}")
            visti[pid] = sid
            mids = [m.get("id") for m in p.get("moduli") or []]
            for m in p.get("moduli") or []:
                if "__" in (m.get("id") or "__"): errori.append(f"{pid}: ogni modulo vuole un id senza «__»")
                if m.get("parte") not in ("indizio", "evento", "nascosto"): errori.append(f"{pid}/{m.get('id')}: «parte» deve essere indizio / evento / nascosto")
                if m.get("parte") == "indizio" and m.get("seme") and m["seme"] not in (p.get("text") or ""):
                    errori.append(f"{pid}/{m['id']}: la frase seme «{m['seme']}» non è nel testo del punto (va copiata identica)")
                for pv in m.get("prove") or []:
                    if "-" in (pv.get("id") or "-"): errori.append(f"{pid}/{m['id']}: ogni prova vuole un id senza «-»")
                for dq in m.get("daqui") or []:
                    if dq not in mids and not any(q.get("id") == dq for q in s.get("punti") or []):
                        errori.append(f"{pid}/{m['id']}: «Da qui» punta a «{dq}», che non esiste")
        for h in s.get("guida") or []:
            if f'"id": "{h}"' not in html: errori.append(f"{sid}: la scheda della guida «{h}» non esiste in SCENE_HANDOUTS")
        # immagini col nome leggibile (chiave di contenuti/_immagini.json) → percorso img/xxx
        def res(v, who):
            if not v or v.startswith("img/") or v.startswith("http"): return v
            if v in alias: return alias[v]
            senza_img.append(f"{who}: «{v}»"); return None
        mp = s.get("mappa") or {}
        if mp.get("img"): mp["img"] = res(mp["img"], sid) or mp["img"]
        for p in s.get("punti") or []:
            if p.get("image"): p["image"] = res(p["image"], p.get("id"))
            for mo in p.get("moduli") or []:
                if mo.get("immagine"): mo["immagine"] = res(mo["immagine"], f"{p.get('id')}/{mo.get('id')}")
        scene.append(s)
    if errori:
        print("SCENE CON ERRORI:\n  " + "\n  ".join(errori)); sys.exit(1)
    scene.sort(key=lambda s: (s.get("ordine") or 99, s["id"]))
    blocco = SCENE_START + "const SCENE_DATA=" + json.dumps(scene, ensure_ascii=False, separators=(",", ":")) + ";" + SCENE_END
    a = html.index(SCENE_START); b = html.index(SCENE_END) + len(SCENE_END)
    html = html[:a] + blocco + html[b:]
    open(SRC, "w", encoding="utf-8").write(html)
    if senza_img: print("  IMMAGINI DELLE SCENE NON ANCORA GENERATE (" + str(len(senza_img)) + "): " + "; ".join(senza_img[:8]) + (" …" if len(senza_img) > 8 else ""))
    print(f"ok: scene scritte in src/tavolo.html — " + ", ".join(f"{s['id']} ({len(s.get('punti') or [])} punti)" for s in scene))

BEST_START, BEST_END = "/*@BESTIARIO*/", "/*@/BESTIARIO*/"
def bestiario():
    """Mostri e PNG da combattimento: un file per creatura in contenuti/_bestiario/<id>.json (forma del BESTIARIO del sorgente)."""
    import json
    d = os.path.join(CONT, "_bestiario"); voci = []
    alias = json.load(open(os.path.join(CONT, "_immagini.json"), encoding="utf-8"))
    if os.path.isdir(d):
        for fn in sorted(os.listdir(d)):
            if not fn.endswith(".json"): continue
            e = json.load(open(os.path.join(d, fn), encoding="utf-8"))
            if e.get("img") and not e["img"].startswith(("img/", "http")): e["img"] = alias.get(e["img"], "")
            e.setdefault("note", ""); e.setdefault("actions", []); voci.append(e)
    html = open(SRC, encoding="utf-8").read()
    a = html.index(BEST_START); b = html.index(BEST_END) + len(BEST_END)
    html = html[:a] + BEST_START + "const BESTIARIO_EXTRA=" + json.dumps(voci, ensure_ascii=False, separators=(",", ":")) + ";" + BEST_END + html[b:]
    open(SRC, "w", encoding="utf-8").write(html)
    print(f"ok: bestiario aggiuntivo — {len(voci)} creature")

PG_START, PG_END = "/*@PG*/", "/*@/PG*/"
def pg():
    """Schede Roll20 complete dei PG: contenuti/pg/<id>.json → blocco PG_DATA del sorgente (senza il campo «differenze», che è per Claude)."""
    import json
    d = os.path.join(CONT, "pg"); voci = {}
    if os.path.isdir(d):
        for fn in sorted(os.listdir(d)):
            if not fn.endswith(".json"): continue
            e = json.load(open(os.path.join(d, fn), encoding="utf-8")); e.pop("differenze", None); voci[e["id"]] = e
    html = open(SRC, encoding="utf-8").read()
    a = html.index(PG_START); b = html.index(PG_END) + len(PG_END)
    html = html[:a] + PG_START + "const PG_DATA=" + json.dumps(voci, ensure_ascii=False, separators=(",", ":")) + ";" + PG_END + html[b:]
    open(SRC, "w", encoding="utf-8").write(html)
    print(f"ok: schede dei PG — {', '.join(voci) or 'nessuna'}")

INC_START, INC_END = "/*@INCANTESIMI*/", "/*@/INCANTESIMI*/"
def incantesimi():
    """Testi di regolamento completi: contenuti/_incantesimi/*.json (chiave = nome inglese di SPELLS) → blocco SPELLS_EXTRA."""
    import json
    d = os.path.join(CONT, "_incantesimi"); voci = {}
    if os.path.isdir(d):
        for fn in sorted(os.listdir(d)):
            if fn.endswith(".json"): voci.update(json.load(open(os.path.join(d, fn), encoding="utf-8")))
    html = open(SRC, encoding="utf-8").read()
    a = html.index(INC_START); b = html.index(INC_END) + len(INC_END)
    html = html[:a] + INC_START + "const SPELLS_EXTRA=" + json.dumps(voci, ensure_ascii=False, separators=(",", ":")) + ";" + INC_END + html[b:]
    open(SRC, "w", encoding="utf-8").write(html)
    print(f"ok: incantesimi completi — {len(voci)}")

ICO_START, ICO_END = "/*@ICONE*/", "/*@/ICONE*/"
def icone():
    """Immagini degli oggetti e icone delle abilità: contenuti/_icone.json → blocco ICONE_DATA (v117)."""
    import json
    f = os.path.join(CONT, "_icone.json")
    d = json.load(open(f, encoding="utf-8")) if os.path.exists(f) else {}
    voci = {"oggetti": d.get("oggetti", {}), "abilita": d.get("abilita", {})}
    html = open(SRC, encoding="utf-8").read()
    a = html.index(ICO_START); b = html.index(ICO_END) + len(ICO_END)
    html = html[:a] + ICO_START + "const ICONE_DATA=" + json.dumps(voci, ensure_ascii=False, separators=(",", ":")) + ";" + ICO_END + html[b:]
    open(SRC, "w", encoding="utf-8").write(html)
    print(f"ok: immagini di oggetti e abilità — {len(voci['oggetti'])} oggetti, {len(voci['abilita'])} abilità")

CRO_START, CRO_END = "/*@CROCIATA*/", "/*@/CROCIATA*/"
def crociata():
    """La Crociata (v136): contenuti/_crociata.json (membri, carri, città e tappe della mappa del Ducato,
    valori iniziali del Registro) → blocco CROCIATA_DATA. Le tappe devono puntare a scene esistenti."""
    import json
    f = os.path.join(CONT, "_crociata.json")
    d = json.load(open(f, encoding="utf-8")) if os.path.exists(f) else {}
    d.pop("_fonte", None)
    scene_ids = {fn[:-5] for fn in os.listdir(os.path.join(CONT, "scene")) if fn.endswith(".json")}
    errori, ids = [], set()
    for c in (d.get("citta") or []) + (d.get("tappe") or []):
        if c.get("id") in ids: errori.append(f"id ripetuto: {c.get('id')}")
        ids.add(c.get("id"))
        if not isinstance(c.get("x"), (int, float)) or not isinstance(c.get("y"), (int, float)): errori.append(f"{c.get('id')}: mancano x / y")
    for t in d.get("tappe") or []:
        if t.get("scena") and t["scena"] not in scene_ids: errori.append(f"tappa {t['id']}: la scena «{t['scena']}» non esiste")
    for m in d.get("membri") or []:
        if m.get("gruppo") not in [g[0] for g in d.get("gruppi") or []]: errori.append(f"membro {m.get('id')}: gruppo sconosciuto")
    if errori:
        print("CROCIATA CON ERRORI:\n  " + "\n  ".join(errori)); sys.exit(1)
    html = open(SRC, encoding="utf-8").read()
    a = html.index(CRO_START); b = html.index(CRO_END) + len(CRO_END)
    html = html[:a] + CRO_START + "const CROCIATA_DATA=" + json.dumps(d, ensure_ascii=False, separators=(",", ":")) + ";" + CRO_END + html[b:]
    open(SRC, "w", encoding="utf-8").write(html)
    print(f"ok: la Crociata — {len(d.get('membri') or [])} voci di membri, {len(d.get('citta') or [])} città, {len(d.get('tappe') or [])} tappe")

def build():
    contenuti()
    scene()
    crociata()
    bestiario()
    pg()
    incantesimi()
    icone()
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
    elif a[:1] == ["--contenuti"]: contenuti(); scene(); crociata()
    elif a[:1] == ["--extract"]: extract(a[1])
    else: build()
