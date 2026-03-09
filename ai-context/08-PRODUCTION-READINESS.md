# Production Readiness Checklist

Review this at sprint planning. Not everything applies to MVP, but knowing what's missing is part of the plan.

## Database
- [ ] Data model designed (ERD or schema doc)
- [ ] Migration path defined (current → target DB)
- [ ] Backup strategy defined
- [ ] Data validation at storage layer
- [ ] Indexing strategy for common queries
- **Current state:** _describe_
- **Target state:** _describe_
- **Migration plan:** _describe_

## Authentication & Authorization
- [ ] User auth implemented (login/signup)
- [ ] Session management (tokens, expiry, refresh)
- [ ] Role-based access control (if multi-user)
- [ ] API authentication (keys, OAuth, JWT)
- [ ] Password hashing / secure credential storage
- **Current state:** _describe_
- **Target state:** _describe_

## Infrastructure & Deployment
- [ ] CI/CD pipeline configured
- [ ] Staging environment exists
- [ ] Production environment configured
- [ ] Environment variables managed securely
- [ ] Domain / DNS configured
- [ ] SSL/TLS configured
- [ ] Auto-scaling defined (if applicable)
- **Current state:** _describe_
- **Hosting:** _describe_

## Monitoring & Observability
- [ ] Error tracking (Sentry, etc.)
- [ ] Logging (structured, queryable)
- [ ] Uptime monitoring
- [ ] Performance monitoring (response times, throughput)
- [ ] Alerting rules defined
- **Current state:** _describe_

## Security
- [ ] Input validation on all endpoints
- [ ] SQL injection / NoSQL injection protection
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Dependency vulnerability scanning
- [ ] Secrets management (no hardcoded credentials)
- **Current state:** _describe_

## Performance & Scaling
- [ ] Load tested (expected traffic defined)
- [ ] Caching strategy (CDN, application cache)
- [ ] Database query optimization
- [ ] Asset optimization (minification, compression)
- [ ] Pagination for list endpoints
- **Current state:** _describe_

## Error Handling & Recovery
- [ ] Graceful error handling (user-facing messages)
- [ ] Retry logic for external service calls
- [ ] Circuit breaker pattern (if applicable)
- [ ] Data recovery procedures documented
- **Current state:** _describe_

---

## How to Use This

### Sprint 1 (MVP)
Fill in "Current state" for each section. Most will be "Not implemented" and that's fine. The point is awareness.

### Every Sprint After
Review one section per sprint. Update status. If a section becomes blocking, add tasks to the sprint.

### Pre-Launch
All critical sections (Auth, Security, Infra, Error Handling) must have a plan, even if not fully implemented.
