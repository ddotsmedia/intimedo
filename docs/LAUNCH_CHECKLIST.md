# Launch checklist

Every box must be ticked before the first public launch. Items marked (decision) need an answer in docs/OPEN_DECISIONS.md first.

## Decisions
- [ ] (decision) Trademark cleared for "intimedo" (decision 1)
- [ ] (decision) Launch languages and markets set (decision 2)
- [ ] (decision) Legal review done per market: health data, privacy, minors, advertising, transfers (decision 3)
- [ ] (decision) Medical reviewer named; every article reviewed before publish (decision 4)
- [ ] (decision) Production host chosen (decision 5)
- [ ] (decision) Accounts policy confirmed: none at launch (decision 7)

## Platform
- [ ] CI green on main: check, restore-test, e2e, docker
- [ ] GitHub secrets set: VPS_HOST, VPS_USER, VPS_SSH_KEY, DB_PASSWORD, DB_NAME, INTIMEDO_SECRET; variable BETTER_AUTH_URL
- [ ] First production deploy run from Actions (workflow_dispatch) with a commit SHA; migrations ran; health check passed
- [ ] Editor two-factor enrolled on production and sign-in tested
- [ ] Latest backup restored successfully with scripts/restore-test.sh
- [ ] External uptime monitor on GET /api/health (choice of service needed)
- [ ] Placeholder pages (privacy, editorial policy, disclaimer) replaced with legal-reviewed text
- [ ] Sitemap and robots checked; drafts absent from sitemap
- [ ] Rollback drill completed (below)

## Rollback drill
Run once before launch.
1. Deploy a known-good commit SHA (tag A) from Actions.
2. Deploy a second SHA (tag B).
3. Run Actions → Deploy production with image_tag = A. The workflow redeploys A and checks health.
4. Confirm the public site and sign-in work on A.
5. Record the time taken here: ____ minutes.

Migrations are not reversed on rollback. Keep each migration backward-compatible with the previous release until the next one is live.
