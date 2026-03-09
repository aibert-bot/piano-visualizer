# Impact Analysis Template

**Fill this out BEFORE making changes that touch 3+ files or modify shared modules.**

## Change Summary
_One sentence: what are you changing and why?_

## Files Modified
| File | Change Type | Risk |
|------|------------|------|
| _path_ | add/modify/delete | low/med/high |

## Dependency Check
_Which other modules import from or depend on the files you're changing?_

### Upstream (things that call your code)
- 

### Downstream (things your code calls)
- 

## Breaking Change Risk
- [ ] Changes function signatures or return types
- [ ] Changes data model / schema
- [ ] Changes API contract (endpoints, request/response format)
- [ ] Changes shared utility behavior
- [ ] Changes configuration format

## Test Coverage
- [ ] Existing tests cover the changed behavior
- [ ] New tests needed (list them)
- [ ] Integration tests affected

## Rollback Plan
_If this breaks something, what's the fastest way to undo?_

---

## When to Use This
- Any change touching 3+ files
- Any change to shared utilities (utils/, config/, types/)
- Any API contract change
- Any data model change
- Any change the agent is "not sure about"

## When to Skip This
- Single-file changes with clear scope
- Test-only changes
- Documentation changes
- Style/formatting changes
