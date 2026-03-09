---
status: not_run
last_run: null
sprint: null
blockers_found: 0
questions_resolved: 0
ready_for_autonomous: false
---

# Pre-flight Check

Run this before starting autonomous mode on a new sprint.

## Checklist

### Environment & Config
- [ ] Required environment variables documented and available
- [ ] External API keys/credentials accessible
- [ ] Dev environment set up and working
- [ ] Server starts without errors

### Dependencies
- [ ] All task dependencies satisfiable within sprint
- [ ] No circular task dependencies
- [ ] External services reachable

### Clarity
- [ ] All tasks have clear acceptance criteria
- [ ] No ambiguous requirements
- [ ] Design decisions sufficient for implementation

### Context Health
- [ ] 01-CURRENT-STATE.md is accurate
- [ ] 03-REPO-MAP.md reflects current structure
- [ ] No stale blockers listed

### Impact Awareness
- [ ] Reviewed dependency graph for shared modules
- [ ] Identified high-risk files for this sprint's tasks
- [ ] Existing tests pass (baseline established)

## Blockers Found
_Populated during preflight scan._

## Questions for User
_Populated during preflight scan._

## User Answers
_Record answers here._

---

When complete, update frontmatter:
```yaml
status: complete
ready_for_autonomous: true
```

Then proceed to autonomous mode.
