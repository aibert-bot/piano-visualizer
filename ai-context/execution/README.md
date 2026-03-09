# Execution

State tracking for autonomous mode.

## Files

- **current-state.md** → see `../01-CURRENT-STATE.md` (consolidated)
- **preflight.md** → run before starting autonomous mode on a new sprint

## Autonomous Mode Flow

```
preflight → resolve blockers → start task 1 → test → update state → next task → ... → retro
```

1. **Preflight:** Scan all tasks, surface blockers, get user answers
2. **Execute:** Work through tasks one at a time
3. **Between tasks:** Update 01-CURRENT-STATE.md with position
4. **On completion:** Trigger retro, update all context files
