# Backlog (acceptance in one line each)

## Phase 1: Foundation
- Scaffold Next.js, TS strict, lint, test, Docker Compose, CI workflow. AC: CI green, `compose up` serves home page.
- Design tokens and base components, WCAG 2.2 AA checks. AC: axe passes on base pages.
- Locale routing and dictionary structure (English). AC: switch-ready structure, no hard-coded strings in pages.

## Phase 2: CMS and editorial
- Schema and migrations for Entry, Alias, Article, versions, references, roles. AC: migrations apply on empty DB.
- Editorial workflow states and permissions. AC: unauthorised publish is rejected server-side.
- Admin with MFA for editor, reviewer, admin roles. AC: MFA enforced on those roles.

## Phase 3: Public site and search
- A–Z index and article pages. AC: only Published articles are visible.
- Search with synonyms. AC: relevance test set passes.
- SEO basics, sitemap, robots, canonical. AC: drafts excluded from sitemap.

## Phase 4: Educational tools
- Small set of calculators with stated limits. AC: boundary tests pass, limits shown on page.

## Phase 5: AI (deferred)
- Provider abstraction, retrieval, citations, abstention. AC: evaluation set passes; disabled by default.

## Phase 6: Learning
- Quizzes and progress for optional accounts. AC: progress visible only to owner.

## Phase 7: Production readiness
- Backups with tested restore, monitoring, rollback drill, launch checklist. AC: restore tested and documented.
