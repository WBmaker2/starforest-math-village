import sys, os
from PIL import Image
sheet, cols, rows = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
names = sys.argv[4].split(",")
outdir = sys.argv[5]
os.makedirs(outdir, exist_ok=True)
img = Image.open(sheet).convert("RGB")
W, H = img.size
m = 0.03
idx = 0
for r in range(rows):
    for c in range(cols):
        if idx >= len(names):
            break
        box = (int(W*(c/cols+m)), int(H*(r/rows+m)), int(W*((c+1)/cols-m)), int(H*((r+1)/rows-m)))
        cell = img.crop(box)
        cw, ch = cell.size
        px = cell.load()
        alpha = Image.new("L", (cw, ch), 255)
        ap = alpha.load()
        for y in range(ch):
            for x in range(cw):
                rr, gg, bb = px[x, y]
                if min(rr, bb) - gg > 50:
                    ap[x, y] = 0
        cell.putalpha(alpha)
        bbox = alpha.getbbox()
        if bbox:
            pad = 6
            bbox = (max(0, bbox[0]-pad), max(0, bbox[1]-pad), min(cw, bbox[2]+pad), min(ch, bbox[3]+pad))
            cell = cell.crop(bbox)
        cell.save(os.path.join(outdir, names[idx] + ".png"))
        print(names[idx], cell.size)
        idx += 1
