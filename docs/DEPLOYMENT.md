# Deployment

All changes reach any server through GitHub Actions only. No manual commands or edits on any server.

- Push to `main`: build, test, build Docker image, deploy to staging, run smoke test.
- Production: manual `workflow_dispatch` run, choosing an image tag. Runs the same steps.
- Rollback: manual `workflow_dispatch` run with the previous image tag.
- Health check: the pipeline calls the health endpoint after each deploy and fails the run if it doesn't respond.
- Migration to a dedicated host: same workflow, new target. Runbook added in Phase 7.

Phase 0 creates no workflow files. Workflows arrive in Phase 1.
