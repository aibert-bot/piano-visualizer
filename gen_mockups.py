from PIL import Image, ImageDraw, ImageFont
import os

W, H = 600, 520
BG = (15, 15, 35)
WHITE_KEY = (245, 245, 245)
BLACK_KEY = (34, 34, 34)
BLUE = (59, 130, 246)
ORANGE = (249, 115, 22)
DARK_PANEL = (26, 26, 46)
TEXT = (200, 200, 200)
DIM = (100, 100, 100)

out = os.path.dirname(__file__)

def draw_keyboard(draw, x0, y0, active_whites=None, active_blacks=None, color_whites=None, color_blacks=None):
    """Draw a 2-octave piano keyboard. active_whites/blacks are index lists."""
    active_whites = active_whites or []
    active_blacks = active_blacks or []
    color_whites = color_whites or {}
    color_blacks = color_blacks or {}
    kw, kh = 34, 140
    bw, bh = 22, 88
    
    # White keys
    for i in range(14):
        c = color_whites.get(i, BLUE) if i in active_whites else WHITE_KEY
        draw.rectangle([x0 + i*kw, y0, x0 + i*kw + kw - 2, y0 + kh], fill=c, outline=(180,180,180))
    
    # Black key positions relative to white keys
    black_offsets = [0, 1, 3, 4, 5, 7, 8, 10, 11, 12]  # which white keys have a black to their right
    bx_positions = []
    for idx, wi in enumerate(black_offsets):
        bx = x0 + wi * kw + kw - bw//2
        bx_positions.append(bx)
        c = color_blacks.get(idx, BLUE) if idx in active_blacks else BLACK_KEY
        draw.rectangle([bx, y0, bx + bw, y0 + bh], fill=c, outline=(20,20,20))
    
    return bx_positions

def text_center(draw, y, text, fill, size=16):
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", size)
    except:
        font = ImageFont.load_default()
    bbox = draw.textbbox((0,0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw)//2, y), text, fill=fill, font=font)

def get_font(size=14):
    try:
        return ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", size)
    except:
        return ImageFont.load_default()

# ===== MOCKUP 1: Chord Explorer =====
img1 = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(img1)

text_center(d, 16, "错位时空 — Chord Explorer", (255,255,255), 20)
text_center(d, 42, "Left Hand Practice", DIM, 13)

# Tab bar
font = get_font(13)
d.rounded_rectangle([150, 62, 290, 88], 6, fill=DARK_PANEL, outline=(80,80,80))
d.text((164, 68), "🎹 Chords", fill=(255,255,255), font=font)
d.rounded_rectangle([290, 62, 450, 88], 6, fill=DARK_PANEL, outline=(60,60,60))
d.text((320, 68), "🎵 Melody", fill=DIM, font=font)

# Chord buttons
chords = ["Cm", "Gm", "A♭", "E♭", "Fm", "D♭", "B♭", "G"]
bx_start = 52
for i, ch in enumerate(chords):
    x = bx_start + i * 62
    c = BLUE if i == 0 else DARK_PANEL
    ol = BLUE if i == 0 else (60,60,60)
    d.rounded_rectangle([x, 100, x+56, 126], 6, fill=c, outline=ol)
    d.text((x+12, 106), ch, fill=(255,255,255) if i==0 else DIM, font=font)

# Level pills
levels = ["L1","L2","L3","L4","L5"]
for i, lv in enumerate(levels):
    x = 170 + i * 52
    c = BLUE if i == 0 else DARK_PANEL
    d.rounded_rectangle([x, 138, x+42, 158], 12, fill=c, outline=(80,80,80) if i==0 else (60,60,60))
    d.text((x+12, 142), lv, fill=(255,255,255) if i==0 else DIM, font=get_font(11))

# Keyboard - Cm chord: C3 (white 0), Eb3 (black 1), G3 (white 4)
kx = 62
ky = 178
draw_keyboard(d, kx, ky, 
              active_whites=[0, 4], color_whites={0: BLUE, 4: BLUE},
              active_blacks=[1], color_blacks={1: BLUE})

# Finger numbers on active keys
sf = get_font(15)
d.text((kx + 0*34 + 10, ky + 110), "1", fill=(255,255,255), font=sf)
d.text((kx + 4*34 + 10, ky + 110), "5", fill=(255,255,255), font=sf)
# Eb3 black key finger
d.text((kx + 0*34 + 34 - 11 + 4, ky + 62), "3", fill=(255,255,255), font=sf)

# Label
text_center(d, ky + 150, "Cm — C, E♭, G", BLUE, 16)
text_center(d, ky + 172, "Block chord · Whole note", DIM, 12)

# Legend
d.rectangle([kx, ky+200, kx+12, ky+212], fill=BLUE)
d.text((kx+18, ky+200), "Left Hand", fill=DIM, font=get_font(11))

img1.save(os.path.join(out, "mock1_chord_explorer.png"))

# ===== MOCKUP 2: Melody Player =====
img2 = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(img2)

text_center(d, 16, "错位时空 — Melody Player", (255,255,255), 20)
text_center(d, 42, "Right Hand · Chorus", DIM, 13)

# Tab bar
d.rounded_rectangle([150, 62, 290, 88], 6, fill=DARK_PANEL, outline=(60,60,60))
d.text((164, 68), "🎹 Chords", fill=DIM, font=font)
d.rounded_rectangle([290, 62, 450, 88], 6, fill=DARK_PANEL, outline=(80,80,80))
d.text((320, 68), "🎵 Melody", fill=(255,255,255), font=font)

# Lyrics
lyrics = list("我吹过你吹过的晚风")
active_idx = 3  # 你
lf = get_font(22)
lf_sm = get_font(22)
total_w = len(lyrics) * 34
lx_start = (W - total_w) // 2
for i, ch in enumerate(lyrics):
    col = ORANGE if i == active_idx else (80,80,80)
    f = get_font(26) if i == active_idx else lf_sm
    d.text((lx_start + i*34, 102), ch, fill=col, font=f)

# Chord badge
text_center(d, 140, "Current chord: Cm", BLUE, 14)

# Keyboard - Eb4 highlighted orange (black key index 6 in our layout)
ky2 = 170
draw_keyboard(d, kx, ky2,
              active_blacks=[6], color_blacks={6: ORANGE})
# Finger number
d.text((kx + 7*34 + 34 - 11 + 4, ky2 + 62), "3", fill=(255,255,255), font=sf)

# Step controls
text_center(d, ky2 + 154, "◀     Note 4 / 31     ▶", DIM, 16)
text_center(d, ky2 + 178, "E♭4 · Finger 3", ORANGE, 15)
text_center(d, ky2 + 200, "← → arrow keys to navigate", (70,70,70), 11)

# Legend
d.rectangle([kx, ky2+226, kx+12, ky2+238], fill=ORANGE)
d.text((kx+18, ky2+226), "Right Hand", fill=DIM, font=get_font(11))

img2.save(os.path.join(out, "mock2_melody_player.png"))

# ===== MOCKUP 3: Both Hands =====
img3 = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(img3)

text_center(d, 16, "错位时空 — Full View", (255,255,255), 20)
text_center(d, 42, "Both Hands · Chorus", DIM, 13)

# Lyrics
for i, ch in enumerate(lyrics):
    col = ORANGE if i == active_idx else (80,80,80)
    f = get_font(26) if i == active_idx else lf_sm
    d.text((lx_start + i*34, 70), ch, fill=col, font=f)

text_center(d, 108, "Cm", BLUE, 16)

# Keyboard - LH: C3(w0), Eb3(b1), G3(w4) blue  |  RH: Eb4(b6) orange
ky3 = 138
draw_keyboard(d, kx, ky3,
              active_whites=[0, 4], color_whites={0: BLUE, 4: BLUE},
              active_blacks=[1, 6], color_blacks={1: BLUE, 6: ORANGE})

# Finger numbers
d.text((kx + 0*34 + 10, ky3 + 110), "1", fill=(255,255,255), font=sf)
d.text((kx + 4*34 + 10, ky3 + 110), "5", fill=(255,255,255), font=sf)
d.text((kx + 0*34 + 34 - 11 + 4, ky3 + 62), "3", fill=(255,255,255), font=sf)
d.text((kx + 7*34 + 34 - 11 + 4, ky3 + 62), "3", fill=(255,255,255), font=sf)

# Legend
ly = ky3 + 160
d.rectangle([180, ly, 192, ly+12], fill=BLUE)
d.text((198, ly), "Left Hand (Cm)", fill=DIM, font=get_font(11))
d.rectangle([320, ly, 332, ly+12], fill=ORANGE)
d.text((338, ly), "Right Hand (E♭4)", fill=DIM, font=get_font(11))

# Step controls
text_center(d, ly + 30, "◀     Note 4 / 31     ▶", DIM, 16)
text_center(d, ly + 54, "E♭4 · Finger 3", ORANGE, 15)

img3.save(os.path.join(out, "mock3_both_hands.png"))

print("Done — 3 mockups generated")
