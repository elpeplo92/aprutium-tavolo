# Token di Aprutium (05-10-2026): ogni ritratto del Compendio diventa un token rotondo con la cornice della sua categoria.
# Uso: py Sito/strumenti/token/genera.py   (rifà tutti i token; il foglio di controllo va nella cartella temporanea)
# Categorie: eroi (Personaggi giocanti), alleati (membri della Crociata, elenco ALLEATI),
#            nemici (03_Compendio/09 Creature + elenco NEMICI), png (tutti gli altri).
# Il token va nella cartella "Token" accanto alla cartella "Ritratti" da cui viene, col nome "TOKEN — <nome>.png".
# Inquadrature a mano in MANO: (cx, cy) = centro del viso in frazioni dell'immagine; zoom = lato del ritaglio / lato corto.
import os, re, glob, tempfile, unicodedata
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
from fai_token import token

B = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".."))
C = os.path.join(B, "03_Compendio")
def norm(s): return re.sub(r'[^a-z ]', '', unicodedata.normalize('NFD', s.lower()).encode('ascii', 'ignore').decode())

ALLEATI = ['silvanus', 'kostandin', 'vasco', 'brizio', 'pippo', 'colangelo', 'giustino', 'albino', 'tiberius', 'iosephus',
           'vhaerun', 'micuccio', 'cuncetta', 'nicola lu funare', 'cecco', 'mimi lu bannitore']
NEMICI = ['iuvenza', 'umbrax', 'impalox', 'ceruso']
MANO = {
 'Fra Bonizio': (.53, .42, .5), 'Il ragazzo di Stalla': (.43, .52, .55), 'Ilderico Panzalonga': (.62, .19, .5),
 'Le Guardie di Levante': (.66, .55, .85), 'Mastro Berardo Lu Pesature': (.45, .15, .5), 'Mastro Sabbatino lu Ferrare': (.45, .16, .5),
 'Peppe Tremonete': (.6, .36, .5), 'Cardinal Virellius Sanctorus': (.32, .16, .45), "Erminio 'Lu Cardanétte'": (.57, .24, .5),
 'Frate Odilon de Serlum': (.37, .19, .45), 'Capitan Silvanus Ardentus': (.55, .22, .62), 'Ombra del pubblico': (.45, .22, .6),
 'Strisciante carogna': (.55, .45, .7), 'Armatura di Iuvenza': (.43, .13, .45), 'Vhaerun, comandante Brak': (.5, .27, .5),
 "Margherita 'de li Scurèlle'": (.42, .23, .45), 'Frate Davide de li Piccole Vie': (.55, .14, .45)}

fonti = []
for d in glob.glob(os.path.join(C, "*", "*", "Ritratti")) + glob.glob(os.path.join(C, "*", "Ritratti")):
    for p in glob.glob(os.path.join(d, "*")):
        if not p.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')): continue
        n = norm(os.path.splitext(os.path.basename(p))[0])
        if 'Personaggi giocanti' in d: cat = 'eroi'
        elif any(a in n for a in ALLEATI): cat = 'alleati'
        elif '09 Creature' in d or any(a in n for a in NEMICI): cat = 'nemici'
        else: cat = 'png'
        fonti.append((p, cat))

casc = [cv2.CascadeClassifier(cv2.data.haarcascades + x) for x in ('haarcascade_frontalface_default.xml', 'haarcascade_profileface.xml')]
def viso(p):
    im = Image.open(p).convert('RGB'); w, h = im.size; k = 800 / max(w, h)
    g = cv2.equalizeHist(cv2.cvtColor(np.array(im.resize((int(w * k), int(h * k)))), cv2.COLOR_RGB2GRAY))
    best = None; mw = int(min(g.shape) * 0.10)
    for c in casc:
        for (x, y, fw, fh) in c.detectMultiScale(g, 1.08, 9, minSize=(mw, mw)):
            fx = (x + fw / 2) / g.shape[1]; fy = (y + fh / 2) / g.shape[0]
            if fy > 0.6 or fx < 0.18 or fx > 0.82: continue
            if best is None or fw > best[2]: best = (x, y, fw, fh)
    if best is None: return None
    x, y, fw, fh = [v / k for v in best]; return (x + fw / 2) / w, (y + fh * 0.55) / h, fw / min(w, h)

log = []
for p, cat in fonti:
    nome = re.sub(r'^(PNG|Ritratto|Mostro|Bestiario)\s*—\s*', '', os.path.splitext(os.path.basename(p))[0]).strip()
    if nome in MANO: cx, cy, zoom = MANO[nome]
    else:
        v = viso(p)
        if v: cx, cy, fr = v; zoom = min(.95, max(.5, fr * 3.3))
        else: cx, cy, zoom = .5, .32, .82
    d = os.path.join(os.path.dirname(os.path.dirname(p)), "Token"); os.makedirs(d, exist_ok=True)
    out = os.path.join(d, f"TOKEN — {nome}.png"); token(p, cat, out, cx=cx, cy=cy, zoom=zoom)
    log.append({'nome': nome, 'cat': cat, 'token': out})

# foglio di controllo, fuori dalle cartelle del progetto
f = ImageFont.truetype(os.path.join(B, "Sito", "font", "ScalySans.otf"), 20); cols, T = 8, 200
L = sorted(log, key=lambda x: ['eroi', 'alleati', 'nemici', 'png'].index(x['cat'])); rows = (len(L) + cols - 1) // cols
sh = Image.new('RGB', (cols * 220 + 20, rows * 250 + 20), (7, 10, 17)); dr = ImageDraw.Draw(sh)
for i, x in enumerate(L):
    t = Image.open(x['token']).resize((T, T), Image.LANCZOS); X = 20 + (i % cols) * 220; Y = 20 + (i // cols) * 250
    sh.paste(t, (X, Y), t); dr.text((X + T // 2, Y + T + 18), x['nome'][:24], fill=(232, 225, 207), font=f, anchor='mm')
fo = os.path.join(tempfile.gettempdir(), 'foglio-token-aprutium.jpg'); sh.save(fo, quality=88)
print({c: sum(1 for x in log if x['cat'] == c) for c in ('eroi', 'alleati', 'nemici', 'png')}, '— foglio:', fo)
