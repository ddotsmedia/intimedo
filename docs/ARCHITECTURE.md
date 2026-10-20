# Architecture

Modular monolith. One Next.js app, one PostgreSQL database, one Compose project. Split only with a documented need.

## Decisions (ADR summaries)
- **ADR-001 Modular monolith.** Options: microservices, monolith. Chosen: monolith. Reason: one team, low ops cost.
- **ADR-002 Next.js App Router + TypeScript strict.** Reason: SSR/SSG for public pages, typed code.
- **ADR-003 PostgreSQL + Prisma.** Reason: relational editorial data, migrations. Alternative: MongoDB (rejected, weak relations for review workflow).
- **ADR-004 Search: PostgreSQL full-text + pg_trgm.** Vector search deferred to Phase 5.
- **ADR-005 Auth: Better Auth (1.7.11).** Auth.js joined Better Auth, so one maintained library. Email+password with TOTP two-factor for editorial roles. Node: `.npmrc` sets legacy-peer-deps because an optional peer of Better Auth conflicts with vitest.
- **ADR-007 Prisma 7 with driver adapter (pg).** Prisma engines download from binaries.prisma.sh; CI must reach it.
- **ADR-006 AI provider abstraction.** Deferred to Phase 5. Provider set by environment variable.

## Modules
identity, content, editorial, taxonomy/A–Z, search, learning (later), admin, ai (later).
