# Collaboration Model

How Aibert and Albert work together on this project.

## Default Mode: Review & Steer

Albert reviews and steers direction. Aibert builds.

### Git Workflow
- All work happens in **feature branches** — never push directly to main
- Every feature/task → **Pull Request** with clear description
- PR includes: what changed, why, how to test, preview URL (if applicable)
- Albert reviews → approves/comments → Aibert merges (or Albert merges)

### PR Description Format
```markdown
## What
[One-line summary of the change]

## Why
[Context — what problem this solves or what sprint task it completes]

## Changes
- [File/module]: [what changed]
- [File/module]: [what changed]

## How to Test
1. [Step-by-step to verify]

## Preview
[Vercel/Netlify preview URL if applicable]

## Screenshots
[Before/after if UI changed]
```

### Branch Naming
- `feat/[short-description]` — new features
- `fix/[short-description]` — bug fixes
- `refactor/[short-description]` — restructuring
- `chore/[short-description]` — tooling, config, deps

---

## Deep Dive Mode: Pair Programming

When Albert wants to jump in and code alongside Aibert.

### How It Works
1. Albert says "I want to work on X"
2. Aibert creates a shared branch: `collab/[description]`
3. Aibert pushes current state + writes a **handoff note** (comment on the PR or in-branch `HANDOFF.md`):
   - What's done so far
   - What's open / in progress
   - Key files to look at
   - Known issues or gotchas
4. Both push to the branch — communicate who's touching what
5. When ready → PR to main as usual

### Handoff Note Format
```markdown
# Handoff — [Branch Name]

## Done
- [x] [What's complete]

## Open
- [ ] [What still needs work]

## Key Files
- `src/X.tsx` — [why it matters]
- `src/Y.ts` — [what to know]

## Gotchas
- [Anything that might trip you up]
```

---

## Autonomy Ladder

Trust builds per-project over time. Albert promotes Aibert up tiers.

| Tier | What Aibert Can Merge Without Review | PR Required For |
|------|--------------------------------------|-----------------|
| **1 — Training Wheels** | Nothing — everything gets a PR | All changes |
| **2 — Trusted** | Bug fixes, styling, tests, docs | Features, architecture |
| **3 — Autonomous** | Features within approved sprint plan | Architecture changes, new dependencies, breaking changes |
| **4 — Full Trust** | Everything within project scope | Cross-project changes, infra, external integrations |

### Current Tier: {{AUTONOMY_TIER}}

### Promotion Criteria
- Tier 1→2: 5+ PRs merged without issues
- Tier 2→3: Sprint delivered end-to-end, no regressions
- Tier 3→4: Multiple sprints, project is stable, Albert's confidence is high

---

## Communication

### Where
- Project channel in Discord (e.g., #expense-tracker)
- PR comments for code-specific discussion
- Cross-post blockers and completions to #control

### When to Ping Albert
- 🚫 **Blocker** — can't proceed without a decision or resource
- ✅ **Milestone** — something meaningful shipped
- ❓ **Architecture question** — multiple valid paths, need a call
- 🔀 **Scope change** — task is bigger/different than expected

### When NOT to Ping
- Routine progress ("started task 3")
- Questions you can answer from the design doc or decisions log
- Test failures you can diagnose yourself
