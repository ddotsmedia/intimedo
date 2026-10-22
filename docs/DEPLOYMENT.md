# Deployment

All changes reach any server through GitHub Actions only. No manual commands or edits on any server.

- Push to `main`: build, test, build Docker image, deploy to staging, run smoke test.
- Production: manual `workflow_dispatch` run, choosing an image tag. Runs the same steps.
- Rollback: manual `workflow_dispatch` run with the previous image tag.
- Health check: the pipeline calls the health endpoint after each deploy and fails the run if it doesn't respond.
- Migration to a dedicated host: same workflow, new target. Runbook added in Phase 7.

Phase 0 creates no workflow files. Workflows arrive in Phase 1.

## Production deploy (implemented, not yet run)
- Workflow: `.github/workflows/deploy.yml`, manual only, environment `production`.
- Secrets (standard names, Oct 22, 2026): `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `DB_PASSWORD`, `DB_NAME`, `INTIMEDO_SECRET`. Variable: `BETTER_AUTH_URL`.
- Automatic rollback: if the health check fails, the workflow redeploys the image that was running before. The first deploy has nothing to roll back to, so it fails without rollback.
- Manual rollback: run the workflow with a previous commit SHA.
- Unverified until a host exists and the secrets are set.
- Needs a one-off `prisma migrate deploy` before the first production deploy (not yet automated).
