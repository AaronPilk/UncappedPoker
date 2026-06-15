#!/usr/bin/env python3
"""
Build product mockups for Uncapped Poker.

Pipeline:
  design-source/<raw>  --trim-->  assets/_flat/<slug>.webp  --composite-->  assets/<slug>.webp

The flat (trimmed) designs are kept in assets/_flat/ so this script is re-runnable
without compositing a mockup onto a mockup. Caps in design-source are already real
product mockups and are passed through untouched by the separate optimise step.

Run from repo root:  python3 tools/build_mockups.py
"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageOps, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "design-source")
FLAT = os.path.join(ROOT, "assets", "_flat")
OUT = os.path.join(ROOT, "assets")
os.makedirs(FLAT, exist_ok=True)
S = 1200

# raw source file -> slug  (tees + hoodie only; caps/emblem handled elsewhere)
GARMENTS = {
    "IMG_2347.jpeg": "degen-tee",
    "IMG_2350.jpeg": "bluff-tee",
    "IMG_2341.jpeg": "call-tee",
    "IMG_2340.jpeg": "table-captain-tee",
    "IMG_2343.jpeg": "nothin-funner-tee",
    "IMG_2353.jpeg": "limpin-tee",
    "D4268226-711B-4A15-B1F9-F5AF11CDEDF8.PNG": "once-tee",
    "IMG_2338.jpeg": "no-backers-tee",
    "IMG_2337.jpeg": "raise-tee",
    "IMG_2339.jpeg": "pocket-aces-tee",
    "IMG_2352.jpeg": "max-pain-hoodie",
}

# per-slug render tuning: brightness boost, alpha floor, alpha range, contrast
# tonal "blackout" designs need a lower floor + higher boost so the embossed art reads
TUNE = {
    "degen-tee":        dict(boost=1.18, afloor=18, arange=28, contrast=1.12),
    "bluff-tee":        dict(boost=1.18, afloor=18, arange=28, contrast=1.12),
    "call-tee":         dict(boost=1.20, afloor=18, arange=28, contrast=1.12),
    "table-captain-tee":dict(boost=1.15, afloor=18, arange=28, contrast=1.10),
    "nothin-funner-tee":dict(boost=1.12, afloor=18, arange=28, contrast=1.10),
    "limpin-tee":       dict(boost=1.85, afloor=14, arange=30, contrast=1.35),
    "once-tee":         dict(boost=2.00, afloor=12, arange=24, contrast=1.55),
    "no-backers-tee":   dict(boost=2.00, afloor=12, arange=24, contrast=1.55),
    "raise-tee":        dict(boost=2.15, afloor=12, arange=22, contrast=1.65),
    "pocket-aces-tee":  dict(boost=2.05, afloor=12, arange=24, contrast=1.55),
    "max-pain-hoodie":  dict(boost=1.55, afloor=14, arange=28, contrast=1.30),
}

def trim_white(im):
    a = np.asarray(im.convert("RGB")).astype(int)
    bright = a.mean(axis=2) > 205
    h, w = bright.shape
    t, b, l, r = 0, h, 0, w
    while t < b and bright[t, :].mean() > 0.7: t += 1
    while b > t and bright[b-1, :].mean() > 0.7: b -= 1
    while l < r and bright[:, l].mean() > 0.7: l += 1
    while r > l and bright[:, r-1].mean() > 0.7: r -= 1
    return im.crop((l, t, r, b))

def build_flat():
    for raw, slug in GARMENTS.items():
        im = Image.open(os.path.join(SRC, raw)).convert("RGB")
        im = trim_white(im)
        sq = ImageOps.fit(im, (900, 900), Image.LANCZOS, centering=(0.5, 0.5))
        sq.save(os.path.join(FLAT, f"{slug}.webp"), "WEBP", quality=88, method=6)

# ---------- garment renderer ----------
PTS = [(470,238),(600,250),(730,238),(762,250),(1012,332),(984,476),(822,432),
       (872,560),(842,1022),(360,1022),(330,560),(380,432),(218,476),(190,332),(440,250)]

def bg():
    img = Image.new("RGB", (S, S), (9, 9, 11))
    grad = Image.new("L", (S, S), 0); d = ImageDraw.Draw(grad)
    for i in range(60):
        a = int(46*(1-i/60)); r = int(S*0.66*(i/60))
        d.ellipse([S/2-r, S*0.40-r, S/2+r, S*0.40+r], fill=a)
    return Image.composite(Image.new("RGB", (S, S), (40, 38, 46)), img, grad)

def shirt_mask():
    m = Image.new("L", (S, S), 0); ImageDraw.Draw(m).polygon(PTS, fill=255)
    return m.filter(ImageFilter.GaussianBlur(1.0))

def shade(mask):
    yy = np.linspace(0, 1, S)[:, None]
    base = np.repeat((34-12*yy).astype("float32"), S, axis=1)
    fab = np.stack([base, base*0.97, base*1.07], axis=2)
    img = Image.fromarray(np.clip(fab, 0, 255).astype("uint8"))
    hl = Image.new("L", (S, S), 0); d = ImageDraw.Draw(hl)
    for i in range(50):
        a = int(34*(1-i/50)); r = int(360*(i/50))
        d.ellipse([600-r, 520-r*1.4, 600+r, 520+r*1.4], fill=a)
    hl = hl.filter(ImageFilter.GaussianBlur(46))
    img = ImageChops.add(img, Image.merge("RGB", [hl]*3))
    n = (np.random.rand(S, S)*9).astype("uint8")
    img = ImageChops.add(img, Image.merge("RGB", [Image.fromarray(n)]*3))
    edge = ImageOps.invert(mask).filter(ImageFilter.GaussianBlur(28)); edge = ImageChops.multiply(edge, mask)
    img = ImageChops.subtract(img, Image.merge("RGB", [edge.point(lambda v: int(v*0.55))]*3))
    return img

def hood(canvas):
    hm = Image.new("L", canvas.size, 0); dd = ImageDraw.Draw(hm)
    dd.ellipse([432,150,768,372], fill=255)
    dd.polygon([(470,300),(730,300),(792,360),(408,360)], fill=255)
    hm = hm.filter(ImageFilter.GaussianBlur(4))
    yy = np.linspace(0, 1, canvas.size[1])[:, None]
    base = np.repeat((52-20*yy).astype("float32"), canvas.size[0], axis=1)
    hf = Image.fromarray(np.clip(np.stack([base, base*0.97, base*1.08], 2), 0, 255).astype("uint8"))
    canvas = Image.composite(hf, canvas, hm)
    om = Image.new("L", canvas.size, 0); ImageDraw.Draw(om).ellipse([486,236,714,366], fill=255)
    om = om.filter(ImageFilter.GaussianBlur(7))
    canvas = Image.composite(Image.new("RGB", canvas.size, (12,11,14)), canvas, om)
    ImageDraw.Draw(canvas).arc([486,236,714,366], 20, 160, fill=(70,67,76), width=4)
    return canvas

def collar(img, hoodie):
    d = ImageDraw.Draw(img)
    d.arc([512,236,688,330], 200, -20, fill=(96,92,100), width=10)
    d.arc([520,244,680,322], 200, -20, fill=(160,155,162), width=2)
    if hoodie:
        d.line([(560,300),(556,470)], fill=(20,19,22), width=10); d.ellipse([548,462,566,480], fill=(180,150,90))
        d.line([(640,300),(644,470)], fill=(20,19,22), width=10); d.ellipse([636,462,654,480], fill=(180,150,90))
    return img

def drop_shadow(canvas, mask):
    sh = mask.filter(ImageFilter.GaussianBlur(36)).point(lambda v: int(v*0.62))
    off = Image.new("L", (S, S), 0); off.paste(sh, (0, 30))
    return Image.composite(Image.new("RGB", (S, S), (0,0,0)), canvas, off)

def lum_alpha(d, floor, rng):
    a = np.asarray(d.convert("RGB")).astype(np.float32)
    L = 0.2126*a[:,:,0] + 0.7152*a[:,:,1] + 0.0722*a[:,:,2]
    al = np.clip((L-floor)/rng, 0, 1); al = np.clip(al*1.7, 0, 1)
    return Image.fromarray((al*255).astype("uint8"))

def make(slug, hoodie=False, scale=0.40, cy=545, **t):
    canvas = bg(); mask = shirt_mask()
    canvas = drop_shadow(canvas, mask)
    canvas = Image.composite(shade(mask), canvas, mask)
    if hoodie: canvas = hood(canvas)
    canvas = collar(canvas, hoodie)
    d = Image.open(os.path.join(FLAT, f"{slug}.webp")).convert("RGB")
    w0, h0 = d.size; cr = int(min(w0, h0)*0.055); d = d.crop((cr, cr, w0-cr, h0-cr))
    d = ImageEnhance.Brightness(d).enhance(t["boost"]); d = ImageEnhance.Contrast(d).enhance(t["contrast"])
    w = int(S*scale); h = int(w*d.height/d.width); d = d.resize((w, h), Image.LANCZOS)
    al = lum_alpha(d, t["afloor"], t["arange"])
    x = 600-w//2; y = int(cy-h/2) - (34 if hoodie else 0)
    region = canvas.crop((x, y, x+w, y+h)).convert("RGB")
    shaded = ImageChops.multiply(d, region.point(lambda v: min(255, int(v*3.4))))
    d = Image.blend(d, shaded, 0.30)
    canvas.paste(d, (x, y), al)
    if hoodie:
        dd = ImageDraw.Draw(canvas)
        dd.arc([402,792,540,902], 85, 180, fill=(64,62,70), width=3)
        dd.line([(471,852),(729,852)], fill=(64,62,70), width=3)
        dd.arc([660,792,798,902], 0, 95, fill=(64,62,70), width=3)
    out = canvas.crop((100, 0, 1100, 1200)).resize((900, 1080), Image.LANCZOS)
    out.save(os.path.join(OUT, f"{slug}.webp"), "WEBP", quality=82, method=6)

def main():
    build_flat()
    for slug, t in TUNE.items():
        make(slug, hoodie=(slug == "max-pain-hoodie"), **t)
        print("built", slug, os.path.getsize(os.path.join(OUT, f"{slug}.webp"))//1024, "KB")
    print("done")

if __name__ == "__main__":
    main()
