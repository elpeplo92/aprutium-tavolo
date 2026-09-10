#!/usr/bin/env python3
"""Build del sito Aprutium Tavolo.

Il sorgente è src/tavolo.html e usa le immagini in img/ (percorsi "img/xxx.jpg").
  python3 build.py            → copia src/tavolo.html in index.html (quello servito da GitHub Pages)
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

def build():
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
    elif a[:1] == ["--extract"]: extract(a[1])
    else: build()
