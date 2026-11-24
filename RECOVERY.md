# Recovery checklist

- Source code is versioned in Git. Protect the GitHub account with MFA and enable repository rulesets and secret push protection from the repository settings.
- Database and storage are separate assets. In the Supabase dashboard, check the backup retention available for the project. Database backups do not include Storage object contents. Export database data and copy private storage objects to encrypted, access-controlled storage outside the public repository. Never commit exports, service credentials, or member data to Git.
- Keep at least one independent protected copy. Test a restore in an isolated nonproduction project with restricted access before any production recovery. Verify authentication, RLS, member certificate checks, published news and file references. Document recovery time and data loss window.
- For suspected compromise, revoke relevant sessions, rotate exposed secrets in provider settings, review audit records, preserve evidence privately, and deploy a reviewed clean commit. Public publishable keys are not secret administrative credentials.
- Confirm real backups and test results separately. This checklist is not proof of a backup or restore.
