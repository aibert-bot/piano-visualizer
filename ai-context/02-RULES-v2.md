# Rules v2

Everything from v1, plus scaling improvements.

---

## Core Rules (unchanged)
- One task per session
- Tests are mandatory
- Update context when changes affect structure/design/decisions
- Stay in scope
- Question user requests that skip tests, expand scope, or introduce anti-patterns

---

## New: Context Management Rules

### Context Budget
- Track how many files you've loaded this session
- Stop loading context at ~60% of window — leave room for actual work
- Load in priority order: current-state → rules → design → repo-map → sprint task
- Only load decisions/debug files when directly relevant

### Pruning Duty
- Every retro: review all ai-context files for stale content
- Remove completed sprint references from current-state
- Archive old debug sessions (move to debug/archive/)
- Collapse resolved decisions in 05-DECISIONS.md

---

## New: Bug Fix Protocol (Test-First Debugging)

When a bug is reported (by user, tests, or observation):

### Step 1: Reproduce with a test
- **Write a failing test FIRST** that reproduces the exact bug
- The test should fail in the way the user described
- If the bug is vague, clarify with the user before writing the test
- Name the test descriptively: `test_[feature]_[broken_behavior]`

### Step 2: Fix the code
- Only after the test exists and fails, fix the underlying code
- Keep the fix minimal — don't refactor or "improve" unrelated code in the same change

### Step 3: Verify and report
- Run the new test — it must pass
- Run the full test suite — no regressions
- Report back: what the test covers, what the fix was, confirmation it passes

### Why
- Bugs never come back (regression suite grows organically)
- Forces understanding the bug before fixing it (no blind patching)
- Gives the user confidence: "here's the test proving it works now"
- Builds a living spec of edge cases the codebase handles

### No Exceptions
- Even "obvious" one-line fixes get a test
- If the bug can't be unit tested (UI-only, timing, env-specific): document why in the test file as a skipped test with reproduction steps

---

## New: Impact Analysis Rules

### Before Any Multi-File Change
1. List every file you'll touch
2. Check what imports from / depends on those files
3. If touching shared modules (utils, config, types): fill out 07-IMPACT-ANALYSIS.md
4. If changing API contracts: document before/after
5. Run existing tests BEFORE making changes (establish baseline)

### After Changes
1. Run all tests, not just the ones you wrote
2. If tests fail that you didn't expect: STOP. Analyze before fixing blindly.
3. Update repo map if structure changed

---

## New: Dependency Awareness

### Repo Map Requirements
The repo map must include:
1. File listing (existing)
2. **Module dependency graph** — which modules import from which
3. **Shared modules** flagged — these are high-risk change targets
4. **API surface** — public endpoints and their contracts

### When Adding New Files
1. Add to repo map immediately
2. Document which existing modules it connects to
3. If it's a shared utility: flag it as high-risk

---

## New: Production Awareness

### Every Sprint Planning
- Review one section of 08-PRODUCTION-READINESS.md
- Update status fields
- If a gap becomes risky: add a task to address it

### Before Any "Demo" or "Show Someone"
- Quick scan of security section (no exposed secrets, no open debug endpoints)
- Check error handling (no stack traces visible to users)
