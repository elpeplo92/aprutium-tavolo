# Token di Aprutium: ritratto in un cerchio, cornice metallica col colore della categoria.
import math, sys, os
from PIL import Image, ImageDraw, ImageFilter, ImageFont
S = 512; SS = 4  # disegno a 4x poi riduco (bordi lisci)
CAT = {  # (chiaro, medio, scuro) della cornice, colore del simbolo
 'eroi':    ((255,236,170),(201,162,74),(92,66,20)),
 'png':     ((236,240,246),(150,158,172),(52,58,70)),
 'alleati': ((176,232,190),(62,140,92),(18,52,32)),
 'nemici':  ((250,170,150),(170,48,40),(60,12,10)),
}
def lerp(a,b,t): return tuple(int(a[i]+(b[i]-a[i])*t) for i in range(3))
def token(src, cat, out, cx=.5, cy=.30, zoom=.78):
    c1,c2,c3 = CAT[cat]; N = S*SS
    im = Image.open(src).convert('RGB'); w,h = im.size
    side = int(min(w,h)*zoom); x0 = int(w*cx - side/2); y0 = int(h*cy - side/2)
    x0 = max(0,min(w-side,x0)); y0 = max(0,min(h-side,y0))
    face = im.crop((x0,y0,x0+side,y0+side)).resize((N,N), Image.LANCZOS)
    R = N//2; rin = int(R*0.84)
    canvas = Image.new('RGBA',(N,N),(0,0,0,0))
    m = Image.new('L',(N,N),0); ImageDraw.Draw(m).ellipse((R-rin,R-rin,R+rin,R+rin),fill=255)
    canvas.paste(face,(0,0),m)
    d = ImageDraw.Draw(canvas)
    # anello metallico: luce dall'alto a sinistra
    rout = int(R*0.985)
    ring = Image.new('RGBA',(N,N),(0,0,0,0)); rd = ImageDraw.Draw(ring)
    steps = 90
    for i in range(steps):
        a0 = i*360/steps; a1 = (i+1)*360/steps + .6
        light = (math.cos(math.radians((a0+a1)/2 + 135))+1)/2   # 1 = in alto a sinistra
        col = lerp(c3, c1, light**1.4) if light > .5 else lerp(c3, c2, light*2)
        rd.pieslice((R-rout,R-rout,R+rout,R+rout), a0, a1, fill=col+(255,))
    hole = Image.new('L',(N,N),255); ImageDraw.Draw(hole).ellipse((R-rin,R-rin,R+rin,R+rin),fill=0)
    ring.putalpha(Image.composite(ring.getchannel('A'), Image.new('L',(N,N),0), hole))
    canvas = Image.alpha_composite(canvas, ring); d = ImageDraw.Draw(canvas)
    lw = max(2,N//170)
    d.ellipse((R-rout,R-rout,R+rout,R+rout), outline=(8,10,16,255), width=lw*2)          # filo esterno scuro
    d.ellipse((R-rin,R-rin,R+rin,R+rin), outline=(8,10,16,255), width=lw*2)              # filo interno scuro
    mid = (rin+rout)//2
    d.ellipse((R-mid,R-mid,R+mid,R+mid), outline=c1+(150,), width=lw)                    # filo di luce
    # rombo della categoria in basso
    k = int(N*0.05); by = R+mid
    d.polygon([(R,by-k),(R+k,by),(R,by+k),(R-k,by)], fill=c2+(255,), outline=(8,10,16,255))
    d.polygon([(R,by-k//2),(R+k//2,by),(R,by+k//2),(R-k//2,by)], fill=c1+(255,))
    canvas.resize((S,S), Image.LANCZOS).save(out)
if __name__ == '__main__':
    token(*sys.argv[1:4])
