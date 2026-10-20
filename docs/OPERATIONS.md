# Operations

- Health: `GET /api/health` returns `{"status":"ok"}`. Point an external uptime monitor at it.
- Deploy and rollback: GitHub Actions only. See docs/DEPLOYMENT.md.
- Logs: the web container writes to stdout; collect with the host's Docker logging.
- Known gaps before launch: database migrations are not yet run by the deploy workflow (run `prisma migrate deploy` as a one-off step before first production deploy); no error tracker; no rate limiting on the sign-in endpoint; search uses case-insensitive substring match, not full-text.
