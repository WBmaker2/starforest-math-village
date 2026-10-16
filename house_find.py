from PIL import Image
img = Image.open("assets/img/flow/map-a.jpg").convert("RGB")
W, H = img.size
small = img.resize((150, 112))
px = small.load()
sat = []
for y in range(112):
    row = []
    for x in range(150):
        r, g, b = px[x, y]
        mx, mn = max(r, g, b), min(r, g, b)
        row.append(mx - mn)
    sat.append(row)
seen = [[False] * 150 for _ in range(112)]
comps = []
for y in range(112):
    for x in range(150):
        if seen[y][x] or sat[y][x] < 70:
            continue
        stack = [(x, y)]
        seen[y][x] = True
        xs, ys, rs, gs, bs, n = [], [], 0, 0, 0, 0
        while stack:
            cx, cy = stack.pop()
            xs.append(cx); ys.append(cy); n += 1
            r, g, b = px[cx, cy]
            rs += r; gs += g; bs += b
            for nx, ny in ((cx+1, cy), (cx-1, cy), (cx, cy+1), (cx, cy-1)):
                if 0 <= nx < 150 and 0 <= ny < 112 and not seen[ny][nx] and sat[ny][nx] >= 70:
                    seen[ny][nx] = True
                    stack.append((nx, ny))
        if n >= 25:
            comps.append((n, sum(xs)/n/150, sum(ys)/n/112, rs/n, gs/n, bs/n))
comps.sort(reverse=True)
for c in comps[:12]:
    print("size=%d x=%.2f y=%.2f rgb=(%d,%d,%d)" % c)
