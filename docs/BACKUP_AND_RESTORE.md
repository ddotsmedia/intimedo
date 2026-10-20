# Backup and restore

- Backup: `scripts/backup.sh <dir>` writes a custom-format `pg_dump`. Run from a scheduled job, not by hand on a server.
- Restore test: `scripts/restore-test.sh <dump>` restores into a scratch database and compares table counts. CI runs this on every push (job `restore-test`).
- A backup is not trusted until a restore test has passed on the same schema version.
- Retention and off-site copies: set when the production host is chosen (see docs/OPEN_DECISIONS.md).
