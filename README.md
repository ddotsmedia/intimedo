# intimedo

International, evidence-based A–Z sexual and reproductive health education platform. Education only, not medical advice. Public content, no user accounts at launch.

## Stack
Next.js (App Router, TypeScript strict), PostgreSQL, Prisma, Zod, Tailwind + accessible primitives, Docker Compose, GitHub Actions.

## Status
Phase 0 (planning). See docs/PRD.md, docs/ARCHITECTURE.md, docs/BACKLOG.md.

## Local run
Added in Phase 1.

## Deployment
GitHub Actions only. Push to `main` deploys to staging. Production is a manual workflow run. See docs/DEPLOYMENT.md.

## Secrets
Never committed. Copy `.env.example` to `.env` locally.
