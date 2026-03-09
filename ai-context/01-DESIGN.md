# MVP Design Document: Piano Visualizer

_Last reviewed: 2026-03-09_

## Purpose
Interactive web app that shows a virtual piano keyboard with highlighted keys for chords and melody. Designed for a beginner learning 错位时空 (Cuo Wei Shi Kong) by 艾辰 (Ai Chen), but with universal chord input for any song.

## Primary User
Piano beginner who can read chord names but needs visual guidance for hand placement and fingering. Uses on laptop/tablet while sitting at a piano.

## MVP Scope (Must-Haves)

### Core Features
1. **Chord Explorer** — Select any chord → keys light up with LH finger numbers, L1–L5 pattern levels with animation
2. **Melody Player** — Step through melody note-by-note with lyrics, RH fingering, and current chord context
3. **Universal Chord Input** — Text input + chord builder dropdowns to display any chord
4. **SVG Piano Keyboard** — 3-octave responsive keyboard (C3–B5) with note highlighting

### Technical Requirements
- React + Vite SPA (no backend)
- SVG piano keyboard component
- Tailwind CSS for styling
- GitHub Pages deployment
- localStorage for saved chords

## Explicit Non-Goals
- ❌ Audio playback (V1 is visual only)
- ❌ MIDI input/output
- ❌ User accounts or auth
- ❌ Mobile-first layout (desktop priority, responsive is nice-to-have)
- ❌ Multiple songs (hardcoded to 错位时空 for now)
- ❌ Sheet music rendering

## Core User Flows

### Flow 1: Explore a Chord
1. User selects chord from presets OR types chord name OR uses builder dropdowns
2. Keyboard highlights the notes with finger numbers
3. User selects LH level (L1–L5)
4. User clicks "Play Pattern" to see animated sequence
5. Pattern visualization shows beat-by-beat breakdown

### Flow 2: Learn the Melody
1. User opens Melody Player tab
2. Keyboard shows first melody note highlighted (orange)
3. Lyrics displayed above keyboard, current chord below
4. User steps through with ← → arrows or on-screen buttons
5. Each step shows next note, updates lyrics highlight

### Flow 3: Save Custom Chords
1. User inputs a chord via text or builder
2. Clicks "Save to My Chords"
3. Chord appears in saved section (persists via localStorage)
4. Can delete saved chords

## Data Model

### Chord
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | ✅ | Display name (e.g. "Cm", "A♭") |
| notes | string[] | ✅ | Scientific pitch notation (e.g. ["C3", "Eb3", "G3"]) |
| fingers | number[] | ✅ | LH fingering (e.g. [5, 3, 1]) |

### Melody Note
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| note | string | ✅ | Scientific pitch (e.g. "Eb4") |
| lyric | string | ✅ | Chinese character for this beat |
| chord | string | ✅ | Current chord name |
| finger | number | ✅ | RH finger number |

## Success Criteria

### Functional
- [x] Chord Explorer shows correct notes + fingering for all 8 song chords
- [x] Universal input parses standard chord names correctly
- [x] LH levels L1–L5 animate correctly
- [x] Melody player steps through all chorus notes
- [x] Saved chords persist across sessions

### Usability
- [x] User can find and display any chord within 5 seconds
- [x] Keyboard is readable on a laptop screen

### Technical
- [x] App builds and deploys to GitHub Pages
- [x] No console errors in normal operation
- [ ] Tests pass (no tests yet)

## Future (V2+)
- Song View with section navigation
- Both-hands Practice Mode
- Progress Tracker
- Audio via Web Audio API / Tone.js
- Tempo control
- Multiple songs

---

**Update this file when scope changes. Design is the contract — if it's not here, it's not in scope.**
