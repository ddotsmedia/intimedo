# Operations

- Health: `GET /api/health` returns `{"status":"ok"}`. Point an external uptime monitor at it.
- Deploy and rollback: GitHub Actions only. See docs/DEPLOYMENT.md.
- Logs: the web container writes to stdout; collect with the host's Docker logging.
- Known gaps before launch: no error tracker; no rate limiting on the sign-in endpoint; search is ranked substring match with synonyms, not full-text. Launch steps are in docs/LAUNCH_CHECKLIST.md.
