# Repo Map — Piano Visualizer

## Structure
```
piano-visualizer/
├── ai-context/              # Agent workbench (this system)
├── src/
│   ├── App.jsx              # Root — tab navigation between Chords/Melody
│   ├── main.jsx             # React entry point
│   ├── styles/
│   │   └── index.css        # Tailwind imports + custom styles
│   ├── components/
│   │   ├── PianoKeyboard.jsx  # ⭐ Core SVG keyboard (245 lines)
│   │   │                      #    Props: highlightedNotes=[{note, color, finger}]
│   │   │                      #    Renders 3 octaves C3–B5
│   │   ├── ChordExplorer.jsx  # Chord selection + LH levels + universal input
│   │   ├── MelodyPlayer.jsx   # Step-through melody with lyrics
│   │   └── Navigation.jsx     # Tab bar (Chords | Melody)
│   ├── data/
│   │   ├── chords.js          # Chord definitions + getLHPattern(chord, level)
│   │   └── melody.js          # Chorus melody notes with lyrics
│   └── utils/
│       └── chordParser.js     # Universal chord name → notes parser
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── BRIEF.md                   # Original build brief
└── .github/workflows/
    └── deploy.yml             # GitHub Pages CI/CD
```

## Key Interfaces

### PianoKeyboard (reusable)
```jsx
<PianoKeyboard highlightedNotes={[
  { note: "C3", color: "#3b82f6", finger: 5 },
  { note: "Eb3", color: "#3b82f6", finger: 3 },
  { note: "G3", color: "#3b82f6", finger: 1 },
]} />
```

### getLHPattern(chordKey, level) → Beat[]
Returns array of `{ notes: string[], fingers: number[], beat: number }` for L1–L5 patterns.

### parseChord(chordName) → { root, quality, notes, fingers }
Parses any standard chord name and returns playable data.

## Conventions
- Blue (#3b82f6) = Left Hand
- Orange (#f97316) = Right Hand
- Scientific pitch notation (C3, Eb4, etc.)
- LH fingering: 5=pinky, 3=middle, 1=thumb (standard piano)
