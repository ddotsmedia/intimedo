# intimedo

International, evidence-based A–Z sexual and reproductive health education platform. Education only, not medical advice. Public content, no user accounts at launch.

## Stack
Next.js (App Router, TypeScript strict), Tailwind, PostgreSQL (Prisma planned for Phase 2), Docker Compose, GitHub Actions.

## Status
Phase 1 (foundation) complete: app shell, design tokens, locale structure, health endpoint, Docker, CI. See docs/BACKLOG.md.

## Local run
```
npm ci
npm run dev            # http://localhost:3000
npm run lint && npm run typecheck && npm test && npm run build
```
Docker: `POSTGRES_PASSWORD=change-me docker compose up --build` (web on 127.0.0.1:3000, override with WEB_PORT).

## Deployment
GitHub Actions only. Push to `main` runs CI. Deploy workflows arrive in Phase 7. See docs/DEPLOYMENT.md.

## Secrets
Never committed. Copy `.env.example` to `.env` locally.
