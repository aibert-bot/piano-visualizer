# Sprints

Each sprint has a numbered file: `sprint-XX.md`

## Sprint File Format

```markdown
# Sprint XX: {{Theme}}

## Goal
_One sentence: what does this sprint accomplish?_

## Tasks

### Task 1: {{Title}}
- **Depends on:** none | Task X
- **Files likely touched:** list them
- **Acceptance criteria:**
  - [ ] Criterion 1
  - [ ] Criterion 2
- **Tests required:**
  - [ ] Test description

### Task 2: ...

## Production Readiness Review
_Pick ONE section from 08-PRODUCTION-READINESS.md to review this sprint._
- **Section:** {{e.g., Database, Security}}
- **Status update:** {{what changed}}

## Retro Trigger
When all tasks complete:
1. Run all tests
2. Update 01-CURRENT-STATE.md
3. Create retro/sprint-XX.md
4. Update 03-REPO-MAP.md if structure changed
```

## Sprint Planning Process
1. Review `06-IDEATION.md` for scored ideas
2. Review `retro/latest.md` for lessons
3. Review one section of `08-PRODUCTION-READINESS.md`
4. Select tasks that fit a 1-2 day sprint
5. Write sprint file with clear acceptance criteria
