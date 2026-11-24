# Security policy

Report suspected vulnerabilities privately using the family portal's official contact email: albarham.inc@gmail.com. Do not publish member records, credentials, tokens or proof-of-concept material containing personal data in public issues.

The supported production version is the current main branch. Test only systems you own or have explicit authorization to test, without accessing other members' data or disrupting service.

## Security baseline
- Supabase row-level security and server-side authorization for administrative operations.
- MFA required for privileged database operations when the administrator has a verified factor.
- Private storage and limited-time links for published news images.
- Content Security Policy and version-pinned external scripts.
- Automated code analysis and limited-permission GitHub workflows.
- No service-role keys or passwords in client code or public repository.
- Security event records stored in a non-public database schema.

Account MFA enrollment, leaked-password checks, repository push protection, backup retention, and production testing require separate verification by the owner.
