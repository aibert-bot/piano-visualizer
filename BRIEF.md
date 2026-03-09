# Piano Visualizer — Build Brief

## What to Build
An interactive web app that shows a virtual piano keyboard and helps a beginner learn 错位时空 (Cuo Wei Shi Kong) by 艾辰 (Ai Chen).

## Tech
- **React + Vite** (SPA, no backend)
- **SVG piano keyboard** (responsive, 3 octaves: C3 to B5)
- **Tailwind CSS** for styling
- **No audio** in V1 — visual only

## MVP Screens

### 1. Chord Explorer
- Render an SVG piano keyboard (3 octaves, C3–B5)
- White keys and black keys properly positioned
- Dropdown or buttons to select a chord: **Cm, Gm, A♭, E♭, Fm, D♭, B♭, G**
- When a chord is selected, highlight the keys (blue color for LH)
- Show finger numbers on the highlighted keys
- **LH Level toggle** (L1–L5):
  - L1: Show block chord (all notes at once, whole note)
  - L2: Show block chord pulsing on beats 1 & 3
  - L3: Show root-5th-octave pattern animated in sequence
  - L4: Show root-3rd-5th-octave animated in sequence
  - L5: Show octave bass + arpeggio fill animated

### 2. Melody Player (Chorus)
- Same SVG piano keyboard
- Melody notes for the chorus displayed as a sequence
- Step-through with left/right arrow keys or on-screen buttons
- Current note highlighted on keyboard (orange color for RH)
- Lyrics displayed above the keyboard, current syllable highlighted
- Current chord shown below for context
- Finger number on the active key

### Chord & Melody Data

**Chords (LH, lower octave):**
```
Cm:  C3, Eb3, G3
Gm:  G2, Bb2, D3
Ab:  Ab2, C3, Eb3
Eb:  Eb3, G3, Bb3
Fm:  F2, Ab2, C3
Db:  Db3, F3, Ab3
Bb:  Bb2, D3, F3
G:   G2, B2, D3
```

**Chorus Melody (RH):**
```json
[
  {"note": "Eb4", "lyric": "我", "chord": "Cm", "finger": 3},
  {"note": "Eb4", "lyric": "吹", "chord": "Cm", "finger": 3},
  {"note": "D4", "lyric": "过", "chord": "Cm", "finger": 2},
  {"note": "Eb4", "lyric": "你", "chord": "Cm", "finger": 3},
  {"note": "D4", "lyric": "吹", "chord": "Gm", "finger": 2},
  {"note": "Eb4", "lyric": "过", "chord": "Gm", "finger": 3},
  {"note": "D4", "lyric": "的", "chord": "Gm", "finger": 2},
  {"note": "C4", "lyric": "晚", "chord": "Gm", "finger": 1},
  {"note": "Bb3", "lyric": "风", "chord": "Gm", "finger": 1},
  {"note": "Bb3", "lyric": "那", "chord": "Ab", "finger": 1},
  {"note": "C4", "lyric": "我", "chord": "Ab", "finger": 1},
  {"note": "Eb4", "lyric": "们", "chord": "Ab", "finger": 3},
  {"note": "D4", "lyric": "曾", "chord": "Ab", "finger": 2},
  {"note": "C4", "lyric": "不", "chord": "Eb", "finger": 1},
  {"note": "Bb3", "lyric": "算", "chord": "Eb", "finger": 1},
  {"note": "Ab3", "lyric": "相", "chord": "Eb", "finger": 4},
  {"note": "G3", "lyric": "拥", "chord": "Eb", "finger": 3},
  {"note": "G3", "lyric": "可", "chord": "Fm", "finger": 3},
  {"note": "Ab3", "lyric": "如", "chord": "Fm", "finger": 4},
  {"note": "Bb3", "lyric": "梦", "chord": "Fm", "finger": 1},
  {"note": "C4", "lyric": "初", "chord": "Fm", "finger": 1},
  {"note": "Bb3", "lyric": "醒", "chord": "Db", "finger": 1},
  {"note": "Ab3", "lyric": "般", "chord": "Db", "finger": 4},
  {"note": "G3", "lyric": "的", "chord": "Db", "finger": 3},
  {"note": "F3", "lyric": "两", "chord": "Db", "finger": 2},
  {"note": "Eb3", "lyric": "手", "chord": "Db", "finger": 1},
  {"note": "D3", "lyric": "空", "chord": "Db", "finger": 1},
  {"note": "Eb3", "lyric": "空", "chord": "Db", "finger": 1},
  {"note": "Eb4", "lyric": "心", "chord": "G", "finger": 3},
  {"note": "D4", "lyric": "也", "chord": "G", "finger": 2},
  {"note": "C4", "lyric": "空", "chord": "G", "finger": 1}
]
```

## Design
- Dark background (#1a1a2e or similar dark blue)
- White keys: white/light gray
- Black keys: dark gray/black
- LH highlight: blue (#3b82f6)
- RH highlight: orange (#f97316)
- Both hands: show both colors simultaneously
- Clean, minimal UI. Large keyboard, controls below.
- Mobile responsive

## Song Structure (for Song View, future)
Intro → Verse → Pre-Chorus → Chorus → Verse 2 → Pre-Chorus → Chorus → Bridge → Final Chorus → Outro

## File Structure
```
src/
  App.jsx
  components/
    PianoKeyboard.jsx    — SVG keyboard component
    ChordExplorer.jsx    — chord selection + LH level toggle
    MelodyPlayer.jsx     — step-through melody with lyrics
    Navigation.jsx       — tab switching between screens
  data/
    chords.js            — chord definitions
    melody.js            — chorus melody data
  styles/
    index.css
```
