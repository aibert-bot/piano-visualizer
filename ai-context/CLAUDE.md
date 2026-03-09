# CLAUDE.md — Piano Visualizer

This is the single entry point. Read this first, follow routing below.

## Reading Order

1. **This file** — routing + mode selection
2. **ai-context/01-CURRENT-STATE.md** — where we are right now
3. **ai-context/02-RULES-v2.md** — how you operate
4. Then route based on mode below.

## Collaboration

This project follows the Review & Steer model. See `ai-context/09-COLLABORATION.md` for full details.

- **All work in feature branches** — never push to main directly
- **PRs for everything** (unless autonomy tier allows otherwise)
- **Check autonomy tier** in `09-COLLABORATION.md` before merging without review

## Modes

### 🔨 Autonomous Mode (default)
You're executing sprint tasks independently.

**Read:**
- `ai-context/01-CURRENT-STATE.md` → know your position
- `ai-context/02-RULES-v2.md` → follow operating rules
- `ai-context/sprints/current-sprint.md` → your task list
- `ai-context/03-REPO-MAP.md` → only sections relevant to your task

**Before first run:** Execute `ai-context/execution/preflight.md`

**Flow:**
1. Check current-state for position (which task?)
2. Read the task spec
3. If touching 3+ files or shared modules → fill `ai-context/07-IMPACT-ANALYSIS.md`
4. Implement + test
5. Update current-state
6. Move to next task

### 🎨 Design Mode
Working on design, ideation, or scope changes.

**Read:**
- `ai-context/01-DESIGN.md` → current design
- `ai-context/06-IDEATION.md` → ideas backlog

### 📋 Sprint Planning
Creating or adjusting sprints.

**Read:**
- `ai-context/01-DESIGN.md` → what we're building
- `ai-context/sprints/` → existing sprints
- `ai-context/05-DECISIONS.md` → past decisions

### 🔍 Review Mode
Reviewing code, PRs, or architecture.

**Read:**
- `ai-context/03-REPO-MAP.md` → project structure
- `ai-context/05-DECISIONS.md` → why things are the way they are

## Tech Stack
- **Frontend:** React 19 + Vite 6 + Tailwind CSS
- **Keyboard:** Custom SVG piano component (PianoKeyboard.jsx)
- **Data:** JSON song data (chords.js, melody.js)
- **State:** React useState (no external state library)
- **Deploy:** GitHub Pages via Actions
- **Repo:** https://github.com/aibert-bot/piano-visualizer
