# Decisions — Piano Visualizer

## D001: SVG over Canvas for keyboard
**Date:** 2026-03-09 | **Status:** Active
**Decision:** Use SVG for piano keyboard rendering
**Why:** Better accessibility, easier DOM manipulation for highlights, no coordinate math for click handlers. Performance is fine for 3 octaves.
**Trade-off:** Canvas would be faster for >5 octaves or real-time audio visualization.

## D002: No audio in V1
**Date:** 2026-03-09 | **Status:** Active
**Decision:** Visual-only MVP, no sound playback
**Why:** Scope control. Audio adds Web Audio API complexity, latency concerns, and sound font loading. Visual highlighting solves the core learning problem.
**Revisit:** V2 with Tone.js or Web Audio API.

## D003: Hardcoded song data
**Date:** 2026-03-09 | **Status:** Active
**Decision:** All chord/melody data in JS files, no backend
**Why:** Single song focus, no need for a database. Makes deployment trivial (static site). Data is small (<5KB).
**Revisit:** When adding multiple songs, move to JSON files or a simple API.

## D004: localStorage for saved chords
**Date:** 2026-03-09 | **Status:** Active
**Decision:** Saved chords stored in browser localStorage
**Why:** No auth, no backend, instant persistence. Good enough for single-user learning tool.
**Trade-off:** Data doesn't sync across devices.

## D005: React useState only
**Date:** 2026-03-09 | **Status:** Active
**Decision:** No external state management (Redux, Zustand, etc.)
**Why:** App state is simple — selected chord, current level, animation state, current melody note. useState handles this cleanly.
**Revisit:** If adding complex features like undo/redo or cross-component state.
