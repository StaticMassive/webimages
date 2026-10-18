"""Static Massive paper whoop kit - one Letter sheet, cut / fold / glue.
Vector PDF via reportlab. All art is original stylised line work."""
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import Color, black, white
import math

F = '/tmp/claude-0/-home-claude/029d9b45-41d6-5ea9-9540-ba9e11bee6ef/scratchpad/fonts/'
pdfmetrics.registerFont(TTFont('Anton', F + 'anton-latin-400-normal.ttf'))
pdfmetrics.registerFont(TTFont('Courier', F + 'courier-prime-latin-700-normal.ttf'))
pdfmetrics.registerFont(TTFont('CourierR', F + 'courier-prime-latin-400-normal.ttf'))
pdfmetrics.registerFont(TTFont('Archivo', F + 'archivo-latin-400-normal.ttf'))

OUT = '/home/claude/webimages/inserts/papercraft/static-massive-paper-whoop-kit.pdf'
W, H = letter
GLUE = Color(0.82, 0.82, 0.82)
INK = black
c = canvas.Canvas(OUT, pagesize=letter)
c.setTitle('Static Massive paper whoop kit')
c.setLineJoin(1); c.setLineCap(1)


# ---------- line styles ----------
def cut():
    c.setStrokeColor(INK); c.setLineWidth(1.1); c.setDash()

def fold():
    c.setStrokeColor(INK); c.setLineWidth(0.6); c.setDash(3, 2.5)

def art(w=1.4):
    c.setStrokeColor(INK); c.setLineWidth(w); c.setDash()

def foldline(x1, y1, x2, y2):
    fold(); c.line(x1, y1, x2, y2); cut()

def tab(x, y, w, h, side):
    """glue tab attached along one edge of rect-ish piece. side: 'l','r','t','b'."""
    c.setFillColor(GLUE); cut()
    p = c.beginPath()
    k = 5  # chamfer
    if side == 'r':
        p.moveTo(x, y); p.lineTo(x + w, y + k); p.lineTo(x + w, y + h - k); p.lineTo(x, y + h)
    elif side == 'l':
        p.moveTo(x + w, y); p.lineTo(x, y + k); p.lineTo(x, y + h - k); p.lineTo(x + w, y + h)
    elif side == 't':
        p.moveTo(x, y); p.lineTo(x + k, y + h); p.lineTo(x + w - k, y + h); p.lineTo(x + w, y)
    else:
        p.moveTo(x, y + h); p.lineTo(x + k, y); p.lineTo(x + w - k, y); p.lineTo(x + w, y + h)
    c.drawPath(p, stroke=1, fill=1)
    # fold edge re-drawn dashed
    if side == 'r': foldline(x, y, x, y + h)
    elif side == 'l': foldline(x + w, y, x + w, y + h)
    elif side == 't': foldline(x, y, x + w, y)
    else: foldline(x, y + h, x + w, y + h)
    c.setFillColor(INK)

def label(x, y, n, text, size=9):
    c.setFillColor(INK)
    c.setFont('Anton', 13); c.drawString(x, y, f'{n}')
    c.setFont('Courier', size); c.drawString(x + 12, y, text.upper())

def note(x, y, text, size=6.5, right=False):
    c.setFillColor(INK); c.setFont('CourierR', size)
    (c.drawRightString if right else c.drawString)(x, y, text)

def hatch(x, y, w, h, step=3.2):
    c.setLineWidth(0.5); c.setStrokeColor(INK); c.setDash()
    p = c.beginPath()
    for i in range(int((w + h) / step) + 1):
        d = i * step
        x1, y1 = x + d, y
        x2, y2 = x, y + d
        if x1 > x + w: y1 += x1 - (x + w); x1 = x + w
        if y2 > y + h: x2 += y2 - (y + h); y2 = y + h
        if y1 <= y + h and x2 <= x + w:
            p.moveTo(x1, y1); p.lineTo(x2, y2)
    c.drawPath(p, stroke=1, fill=0)


# ---------- header ----------
def header():
    c.setFillColor(INK)
    c.rect(36, H - 36 - 34, W - 72, 34, stroke=0, fill=1)
    c.setFillColor(white); c.setFont('Anton', 22)
    c.drawString(44, H - 36 - 25, 'STATIC MASSIVE')
    c.setFont('Courier', 11)
    c.drawString(228, H - 36 - 24, 'PAPER WHOOP KIT')
    c.setFont('Archivo', 7.5)
    c.drawRightString(W - 44, H - 36 - 24, 'cut. fold. glue. fly it nowhere.')
    # legend
    y = H - 36 - 34 - 14
    c.setFillColor(INK)
    cut(); c.line(40, y + 3, 64, y + 3); note(68, y, 'cut')
    fold(); c.line(96, y + 3, 120, y + 3); cut(); note(124, y, 'fold')
    c.setFillColor(GLUE); c.rect(158, y - 1, 24, 8, stroke=1, fill=1); c.setFillColor(INK); note(186, y, 'glue')
    note(W - 40, y, 'tag @staticmassive when it is built   |   staticmassive.com', right=True)


# ---------- 1. tinywhoop (1:1, 65mm class) ----------
def whoop(cx, cy):
    R_OUT, R_IN, OFF = 56, 47, 65
    hubs = [(cx + sx * OFF, cy + sy * OFF) for sx in (-1, 1) for sy in (-1, 1)]
    # frame arms + centre plate (drawn first, under ducts)
    art(1.1); c.setFillColor(white)
    for hx, hy in hubs:
        ang = math.atan2(hy - cy, hx - cx)
        px, py = -math.sin(ang) * 6, math.cos(ang) * 6
        p = c.beginPath()
        p.moveTo(cx + px, cy + py); p.lineTo(hx + px, hy + py); p.lineTo(hx - px, hy - py); p.lineTo(cx - px, cy - py); p.close()
        c.drawPath(p, stroke=1, fill=1)
    # ducts
    for hx, hy in hubs:
        c.setFillColor(white); cut(); c.circle(hx, hy, R_OUT, stroke=1, fill=1)
        art(0.8); c.circle(hx, hy, R_IN, stroke=1, fill=0)
        # duct wall shading: short radial ticks
        c.setLineWidth(0.5)
        for i in range(36):
            a = i * math.pi / 18
            c.line(hx + math.cos(a) * (R_IN + 2), hy + math.sin(a) * (R_IN + 2), hx + math.cos(a) * (R_OUT - 2), hy + math.sin(a) * (R_OUT - 2))
        # motor
        art(1.0); c.setFillColor(white); c.circle(hx, hy, 11, stroke=1, fill=1)
        c.setFillColor(INK); c.circle(hx, hy, 3.5, stroke=0, fill=1)
        c.setLineWidth(0.6)
        for i in range(3):
            a = i * 2 * math.pi / 3 + 0.4
            c.line(hx + math.cos(a) * 11, hy + math.sin(a) * 11, hx + math.cos(a) * (R_IN - 1), hy + math.sin(a) * (R_IN - 1))
    # centre plate / flight controller
    art(1.1); c.setFillColor(white); c.roundRect(cx - 24, cy - 24, 48, 48, 4, stroke=1, fill=1)
    c.setFillColor(INK)
    for i in range(4):
        for j in range(4):
            c.circle(cx - 15 + i * 10, cy - 15 + j * 10, 1.3, stroke=0, fill=1)
    c.rect(cx - 9, cy - 9, 18, 18, stroke=1, fill=0)
    note(cx - 22, cy - 36, 'canopy here', 5.5)
    # cut outline around the whole frame: outer silhouette = union, so draw ducts' outer circles again as the cut line
    cut()
    for hx, hy in hubs: c.circle(hx, hy, R_OUT, stroke=1, fill=0)
    # arms' outer edges are cut lines where exposed: approximate by re-stroking arms
    for hx, hy in hubs:
        ang = math.atan2(hy - cy, hx - cx)
        px, py = -math.sin(ang) * 6, math.cos(ang) * 6
        c.line(cx + px, cy + py, hx + px, hy + py); c.line(cx - px, cy - py, hx - px, hy - py)
    # hide arm strokes that cross inside ducts/plate
    c.setFillColor(white)
    for hx, hy in hubs: c.circle(hx, hy, R_OUT - 0.6, stroke=0, fill=1)
    c.roundRect(cx - 24, cy - 24, 48, 48, 4, stroke=0, fill=1)
    # redraw duct interiors (they were just erased)
    for hx, hy in hubs:
        art(0.8); c.setFillColor(white); c.circle(hx, hy, R_IN, stroke=1, fill=0)
        c.setLineWidth(0.5)
        for i in range(36):
            a = i * math.pi / 18
            c.line(hx + math.cos(a) * (R_IN + 2), hy + math.sin(a) * (R_IN + 2), hx + math.cos(a) * (R_OUT - 2), hy + math.sin(a) * (R_OUT - 2))
        art(1.0); c.circle(hx, hy, 11, stroke=1, fill=1)
        c.setFillColor(INK); c.circle(hx, hy, 3.5, stroke=0, fill=1)
        c.setLineWidth(0.6)
        for i in range(3):
            a = i * 2 * math.pi / 3 + 0.4
            c.line(hx + math.cos(a) * 11, hy + math.sin(a) * 11, hx + math.cos(a) * (R_IN - 1), hy + math.sin(a) * (R_IN - 1))
    art(1.1); c.setFillColor(white); c.roundRect(cx - 24, cy - 24, 48, 48, 4, stroke=1, fill=1)
    c.setFillColor(INK)
    for i in range(4):
        for j in range(4):
            c.circle(cx - 15 + i * 10, cy - 15 + j * 10, 1.3, stroke=0, fill=1)
    c.rect(cx - 9, cy - 9, 18, 18, stroke=1, fill=0)
    note(cx - 22, cy - 36, 'canopy here', 5.5)


def prop(cx, cy, r=42, blades=3, rot=0.0):
    """3-blade prop, cut piece."""
    cut(); c.setFillColor(white)
    p = c.beginPath()
    n = blades
    first = True
    for b in range(n):
        a0 = rot + b * 2 * math.pi / n
        # blade: leaves hub at a0-0.35, sweeps to tip at a0+0.25, returns at a0+0.75
        pts = []
        for t in range(0, 21):
            u = t / 20
            a = a0 - 0.45 + u * 1.25
            rr = 9 + math.sin(u * math.pi) * (r - 9)
            pts.append((cx + math.cos(a) * rr, cy + math.sin(a) * rr))
        if first: p.moveTo(*pts[0]); first = False
        else: p.lineTo(*pts[0])
        for q in pts[1:]: p.lineTo(*q)
    p.close(); c.drawPath(p, stroke=1, fill=1)
    art(0.9); c.setFillColor(white); c.circle(cx, cy, 8, stroke=1, fill=1)
    c.setFillColor(INK); c.circle(cx, cy, 2.2, stroke=0, fill=1)
    return
    for b in range(n):
        a0 = rot + b * 2 * math.pi / n
        for k in (0.15, 0.35, 0.55):
            a = a0 - 0.45 + k * 1.25 + 0.3
            c.line(cx + math.cos(a) * 12, cy + math.sin(a) * 12, cx + math.cos(a + 0.25) * (r * 0.75), cy + math.sin(a + 0.25) * (r * 0.75))


def canopy(x, y):
    """Tent canopy: tab / back / top / front(slope, camera) / tab. Width 40."""
    w = 40
    segs = [('tab', 9), ('back', 22), ('top', 28), ('front', 32), ('tab', 9)]
    yy = y
    # draw bottom to top
    for name, h in reversed(segs):
        if name == 'tab':
            tab(x, yy, w, h, 't' if yy > y + 20 else 'b')
        else:
            cut(); c.setFillColor(white); c.rect(x, yy, w, h, stroke=0, fill=1)
        yy += h
    total = sum(h for _, h in segs)
    cut(); c.rect(x, y + 9, w, total - 18, stroke=1, fill=0)
    # folds between panels
    yy = y + 9
    for name, h in segs[1:-1]:
        yy += h
        if yy < y + total - 9: foldline(x, yy, x + w, yy)
    # art: front = camera lens + vents ; top = canopy ridge ; back = antenna tube
    fy = y + 9 + 22 + 28  # front panel bottom... compute panels bottom-up: tab(9) back(22) top(28) front(32)
    # panels from bottom: tab 9, then back? we reversed when drawing, so bottom tab, then front?? keep it simple:
    # bottom->top order is reversed(segs): tab, front, top, back, tab
    front_y = y + 9; top_y = front_y + 32; back_y = top_y + 28
    art(1.0); c.setFillColor(white)
    c.circle(x + w / 2, front_y + 17, 9, stroke=1, fill=1)
    c.setFillColor(INK); c.circle(x + w / 2, front_y + 17, 5, stroke=0, fill=1)
    c.setFillColor(white); c.circle(x + w / 2 - 1.8, front_y + 18.8, 1.4, stroke=0, fill=1)
    c.setLineWidth(0.6)
    for i in range(3): c.line(x + 5, front_y + 5 + i * 2.6, x + 13, front_y + 5 + i * 2.6)
    for i in range(3): c.line(x + w - 13, front_y + 5 + i * 2.6, x + w - 5, front_y + 5 + i * 2.6)
    # top: ridge + small text
    c.setFillColor(INK); c.setFont('Anton', 7); c.drawCentredString(x + w / 2, top_y + 12, 'STATIC')
    c.setLineWidth(0.6); c.line(x + 6, top_y + 6, x + w - 6, top_y + 6)
    # back: vtx antenna stub
    c.rect(x + w / 2 - 2, back_y + 5, 4, 12, stroke=1, fill=1)
    c.circle(x + w / 2, back_y + 18, 3, stroke=1, fill=1)
    note(x + w + 4, front_y + 2, 'front', 5.5); note(x + w + 4, top_y + 2, 'top', 5.5); note(x + w + 4, back_y + 2, 'back', 5.5)


# ---------- 2. goggles (Skyzone-style box, ~1:3.5) ----------
def goggles(x, y):
    """Net origin = bottom-left of the BACK panel. Column: back(61) / bottom(81) / front(61) / top(81). Sides on front."""
    FW, FH, D = 146, 61, 81
    back_y = y; bot_y = back_y + FH; front_y = bot_y + D; top_y = front_y + D
    # tabs: left/right of back, bottom, top ; and on the far edges of sides
    for yy, hh in ((back_y, FH), (bot_y, D), (top_y, D)):
        tab(x - 10, yy, 10, hh, 'l'); tab(x + FW, yy, 10, hh, 'r')
    tab(x, top_y + D, FW, 10, 't')
    # side panels on front
    tab(x - D - 10, front_y, 10, FH, 'l'); tab(x + FW + D, front_y, 10, FH, 'r')
    cut(); c.setFillColor(white)
    c.rect(x, back_y, FW, FH + D + FH + D, stroke=1, fill=1)
    c.rect(x - D, front_y, D, FH, stroke=1, fill=1)
    c.rect(x + FW, front_y, D, FH, stroke=1, fill=1)
    # internal folds
    for yy in (bot_y, front_y, top_y): foldline(x, yy, x + FW, yy)
    foldline(x, front_y, x, front_y + FH); foldline(x + FW, front_y, x + FW, front_y + FH)
    # --- FRONT: visor ---
    c.setFillColor(INK); art(1.0)
    vx, vy, vw, vh = x + 12, front_y + 14, FW - 24, FH - 26
    c.roundRect(vx, vy, vw, vh, 12, stroke=1, fill=1)
    c.setStrokeColor(white); c.setLineWidth(1.2); c.line(vx + 14, vy + vh - 7, vx + vw - 14, vy + vh - 7)
    c.setStrokeColor(INK)
    # nose notch bottom
    c.setFillColor(white); c.setLineWidth(0.8)
    c.ellipse(x + FW / 2 - 9, front_y - 4, x + FW / 2 + 9, front_y + 8, stroke=1, fill=1)
    note(x + FW - 2, front_y + 3, 'front', 5.5, right=True)
    # --- TOP: antenna slits + vents ---
    for ax in (x + FW * 0.38, x + FW * 0.62):
        cut(); c.setLineWidth(1.4); c.line(ax - 6, top_y + 18, ax + 6, top_y + 18)
        note(ax - 15, top_y + 22, 'slit', 5)
    art(0.6)
    for i in range(8): c.line(x + 14 + i * 5, top_y + D - 20, x + 14 + i * 5, top_y + D - 8)
    for i in range(8): c.line(x + FW - 14 - i * 5, top_y + D - 20, x + FW - 14 - i * 5, top_y + D - 8)
    c.setFillColor(INK); c.setFont('Anton', 10); c.drawCentredString(x + FW / 2, top_y + 42, 'STATIC MASSIVE')
    note(x + FW - 2, top_y + 3, 'top', 5.5, right=True)
    # --- BOTTOM: buttons + vent ---
    art(0.8); c.setFillColor(white)
    for i in range(3): c.circle(x + 24 + i * 12, bot_y + D / 2, 3.5, stroke=1, fill=1)
    c.rect(x + FW - 50, bot_y + D / 2 - 6, 30, 12, stroke=1, fill=1)
    c.setLineWidth(0.5)
    for i in range(6): c.line(x + FW - 47 + i * 5, bot_y + D / 2 - 4, x + FW - 47 + i * 5, bot_y + D / 2 + 4)
    note(x + FW - 2, bot_y + 3, 'bottom', 5.5, right=True)
    # --- BACK: eyecups + foam ---
    art(0.9); c.setFillColor(white)
    for ex in (x + FW * 0.3, x + FW * 0.7):
        c.ellipse(ex - 26, back_y + 12, ex + 26, back_y + FH - 10, stroke=1, fill=1)
        c.setFillColor(INK); c.ellipse(ex - 15, back_y + 20, ex + 15, back_y + FH - 18, stroke=0, fill=1); c.setFillColor(white)
    c.setFillColor(INK); c.setFont('CourierR', 5.5); c.drawCentredString(x + FW / 2, back_y + 5, 'foam side')
    # --- SIDES: strap slot + dial ---
    for sx in (x - D, x + FW):
        art(0.8); c.setFillColor(white)
        c.circle(sx + D / 2, front_y + FH / 2, 10, stroke=1, fill=1)
        c.setLineWidth(0.5)
        for i in range(12):
            a = i * math.pi / 6
            c.line(sx + D / 2 + math.cos(a) * 7, front_y + FH / 2 + math.sin(a) * 7, sx + D / 2 + math.cos(a) * 10, front_y + FH / 2 + math.sin(a) * 10)
        c.setFillColor(GLUE); cut(); c.rect(sx + 8, front_y + 10, 14, FH - 20, stroke=1, fill=1) if sx < x else c.rect(sx + D - 22, front_y + 10, 14, FH - 20, stroke=1, fill=1)
        c.setFillColor(INK)
    note(x - D + 2, front_y + 3, 'side: glue strap', 5.5)


def antenna(x, y):
    """stubby lollipop antenna: cap circle + stem + tab that slides into the top slit."""
    cut(); c.setFillColor(INK)
    c.circle(x, y + 30, 8, stroke=1, fill=1)
    c.setFillColor(white); c.rect(x - 2.5, y + 8, 5, 16, stroke=1, fill=1)
    c.setLineWidth(0.5)
    for i in range(4): c.line(x - 2.5, y + 10 + i * 3.5, x + 2.5, y + 10 + i * 3.5)
    tab(x - 2.5, y, 5, 8, 'b')


def strap(x, y, w=36, h=300):
    cut(); c.setFillColor(white); c.rect(x, y, w, h, stroke=1, fill=1)
    tab(x, y + h, w, 10, 't'); tab(x, y - 10, w, 10, 'b')
    c.saveState(); cp = c.beginPath(); cp.rect(x + 1, y + 1, w - 2, h - 2); c.clipPath(cp, stroke=0, fill=0)
    # lightning-vein pattern
    import random
    rnd = random.Random(7)
    art(0.9)
    for k in range(9):
        px, py = x + rnd.uniform(4, w - 4), y + 8 + k * (h - 16) / 9
        p = c.beginPath(); p.moveTo(px, py)
        for s in range(6):
            px = min(max(px + rnd.uniform(-12, 12), x + 3), x + w - 3); py += rnd.uniform(4, 9)
            p.lineTo(px, py)
        c.drawPath(p, stroke=1, fill=0)
        c.setLineWidth(0.5)
        p = c.beginPath(); qx, qy = x + rnd.uniform(4, w - 4), py - 20; p.moveTo(qx, qy)
        for s in range(4):
            qx = min(max(qx + rnd.uniform(-10, 10), x + 3), x + w - 3); qy += rnd.uniform(3, 7); p.lineTo(qx, qy)
        c.drawPath(p, stroke=1, fill=0); art(0.9)
    c.restoreState()
    c.saveState(); c.translate(x + w / 2, y + h / 2); c.rotate(90)
    c.setFillColor(INK); c.setFont('Anton', 9); c.drawCentredString(0, -3, 'STATIC MASSIVE')
    c.restoreState()


# ---------- 3. radio (pocket gamepad, ~1:2) ----------
def radio(x, y, w=200, h=150):
    """Radiomaster-Pocket-style gamepad: centred screen, level gimbals, T antenna on top. ~1:2.2"""
    def body(stroke, fill, lw):
        c.setLineWidth(lw); c.setStrokeColor(INK); c.setFillColor(white); c.setDash()
        c.roundRect(x + 6, y + 18, w - 12, h - 18, 30, stroke=stroke, fill=fill)
        c.circle(x + 24, y + 24, 24, stroke=stroke, fill=fill)
        c.circle(x + w - 24, y + 24, 24, stroke=stroke, fill=fill)
        c.rect(x + 24, y + 2, w - 48, 40, stroke=0, fill=fill)
        # T antenna: stem + bar
        c.roundRect(x + w / 2 - 6, y + h - 4, 12, 26, 3, stroke=stroke, fill=fill)
        c.roundRect(x + w / 2 - 58, y + h + 16, 116, 12, 6, stroke=stroke, fill=fill)
    body(1, 1, 2.6); body(0, 1, 0)
    # belly between grips
    c.setFillColor(white); c.ellipse(x + 24, y - 10, x + w - 24, y + 22, stroke=0, fill=1)
    c.setLineWidth(1.3); c.setStrokeColor(INK); c.arc(x + 24, y - 10, x + w - 24, y + 22, 180, 180)
    # antenna hinge
    art(0.8); c.setFillColor(white); c.rect(x + w / 2 - 9, y + h - 4, 18, 8, stroke=1, fill=1)
    # screen (centre top)
    sx, sy, sw, sh = x + w / 2 - 27, y + h - 54, 54, 36
    c.setFillColor(INK); c.roundRect(sx, sy, sw, sh, 2, stroke=1, fill=1)
    c.setFillColor(white); c.setFont('Anton', 10); c.drawCentredString(sx + sw / 2, sy + 20, 'STATIC')
    c.drawCentredString(sx + sw / 2, sy + 8, 'MASSIVE')
    c.setFillColor(INK); c.setFont('Anton', 7); c.drawCentredString(x + w / 2, sy - 10, 'POCKET')
    # gimbals, level
    for gx in (x + 46, x + w - 46):
        gy = y + h - 58
        art(1.0); c.setFillColor(white); c.circle(gx, gy, 26, stroke=1, fill=1)
        c.setFillColor(INK); c.circle(gx, gy, 20, stroke=0, fill=1)
        c.setFillColor(white); c.rect(gx - 11, gy - 3, 22, 6, stroke=0, fill=1); c.rect(gx - 3, gy - 11, 6, 22, stroke=0, fill=1)
        c.setFillColor(GLUE); cut(); c.circle(gx, gy, 6, stroke=1, fill=1); c.setFillColor(INK)
        note(gx - 14, gy + 30, 'glue stick', 5)
    # below screen: slider, trims, power
    art(0.8); c.setFillColor(white)
    c.rect(x + w / 2 - 9, y + 78, 18, 5, stroke=1, fill=1)
    c.circle(x + w / 2 - 22, y + 66, 5, stroke=1, fill=1); c.circle(x + w / 2 + 22, y + 66, 5, stroke=1, fill=1)
    c.setFillColor(INK); c.circle(x + w / 2, y + 66, 6, stroke=1, fill=1)
    c.setFillColor(white); c.circle(x + w / 2, y + 66, 2.2, stroke=0, fill=1)
    # speaker
    c.setFillColor(INK)
    for i in range(4):
        for j in range(4): c.circle(x + w / 2 - 7.5 + i * 5, y + 36 + j * 5, 1.1, stroke=0, fill=1)
    # left button column, sys ; right mdl + scroll wheel
    c.setFillColor(white); art(0.8)
    for i in range(4): c.roundRect(x + 44, y + 22 + i * 10, 18, 6, 3, stroke=1, fill=1)
    c.circle(x + 78, y + 44, 6, stroke=1, fill=1)
    c.circle(x + w - 78, y + 44, 6, stroke=1, fill=1)
    c.roundRect(x + w - 58, y + 20, 10, 34, 5, stroke=1, fill=1)
    c.setLineWidth(0.5)
    for i in range(6): c.line(x + w - 57, y + 25 + i * 5, x + w - 49, y + 25 + i * 5)
    # shoulder switches
    art(1.0); c.setFillColor(white)
    for sx2 in (x + 14, x + 34, x + w - 20, x + w - 40): c.rect(sx2, y + h - 2, 6, 10, stroke=1, fill=1)


def stick(x, y):
    """folds into a standing triangular prism; base tab glues into gimbal circle."""
    cut(); c.setFillColor(white); c.rect(x, y + 8, 30, 10, stroke=1, fill=1)
    foldline(x + 10, y + 8, x + 10, y + 18); foldline(x + 20, y + 8, x + 20, y + 18)
    tab(x, y, 10, 8, 'b')
    c.setFillColor(INK); c.setLineWidth(0.5)
    for i in range(3):
        for k in range(2): c.line(x + 1 + i * 10, y + 11 + k * 3, x + 9 + i * 10, y + 11 + k * 3)


# ---------- layout ----------
header()
TOP = H - 36 - 34 - 24

# row 1: whoop (left) | radio + sticks (right)
label(40, TOP - 12, 1, 'tinywhoop  1:1', 8.5)
note(40, TOP - 22, 'cut the frame as one piece. prop on each motor,', 6); note(40, TOP - 30, 'canopy folded and glued on the centre plate.', 6)
whoop(40 + 121, TOP - 34 - 121)

label(336, TOP - 12, 3, 'radio', 8.5)
note(336, TOP - 22, 'fold each stick into a triangle,', 6); note(336, TOP - 30, 'glue its tab into the grey circle.', 6)
radio(336, TOP - 34 - 196)
for i in range(2): stick(W - 36 - 32, TOP - 36 - 200 - 6 - i * 26)
note(W - 36 - 30, TOP - 36 - 200 + 18, 'sticks', 5.5)

# row 2: goggles net (left) | canopy, props, strap, antennas (right)
R2 = TOP - 34 - 242 - 22
label(40, R2 - 2, 2, 'goggles', 8.5)
note(40, R2 - 12, 'fold the box, glue the tabs inside. slide the antennas into the top slits. strap glues to the side panels.', 6)
GX, GY = 40 + 81 + 10, R2 - 16 - 284 - 44
goggles(GX, GY)

RX = GX + 146 + 81 + 10 + 14
note(RX, R2 - 2, 'canopy', 6); canopy(RX, R2 - 12 - 100)
note(RX + 70, R2 - 2, 'props  (+1 spare)', 6)
for i, (px, py) in enumerate(((0, 0), (1, 0), (0, 1), (1, 1))):
    prop(RX + 70 + 46 + px * 88, R2 - 12 - 46 - py * 88, rot=i * 0.5)
note(RX, R2 - 12 - 100 - 14, 'antennas', 6)
antenna(RX + 8, R2 - 12 - 100 - 20 - 40); antenna(RX + 28, R2 - 12 - 100 - 20 - 40)
note(RX + 70, R2 - 12 - 176 - 20, 'strap', 6)
strap(RX + 70, R2 - 12 - 176 - 34 - 90, w=118, h=90)

# footer
c.setFillColor(INK); c.setFont('CourierR', 6.5)
c.drawString(40, 30, 'print at 100% on letter. card stock holds its shape.')
c.drawRightString(W - 40, 30, 'guerrilla whoop  -  nyc / la / pdx / tokyo / london')
c.showPage(); c.save()
print('ok', OUT)
