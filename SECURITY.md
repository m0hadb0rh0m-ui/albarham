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

## Deployment and assurance boundaries
The portal is a static GitHub Pages application. Browser CSP and client validation are defense in depth, not server-side authorization or rate limiting. The security tests in tests/security.test.cjs are regression checks, not a penetration test. Run node --test tests/security.test.cjs with Node 20+.

For new passwords the UI requires 15–128 characters; enforce a compatible policy in Supabase Auth independently. Review leaked-password protection, CAPTCHA/Turnstile integration (frontend and Auth together), server-side Auth rate limits, email confirmation, JWT lifetime, and mandatory administrator MFA. Test with a second non-admin account before tightening policies. Preserve public certificate verification and validate minimal disclosure and abuse protection.

GitHub Pages does not apply custom response-header files. A supported edge provider or configurable host is required for site-specific HTTP CSP including frame-ancestors, permissions policy, HSTS decisions, WAF and bot rules. Restrict the backend independently: protecting the HTML host alone does not protect direct requests to Supabase. Do not cache authenticated API responses. Verify external script SRI or vendor audited copies; version pinning alone is not integrity verification.

Require reviewed pull requests and passing security checks on main; enable account MFA and secret push protection where supported. Maintain independent encrypted database/storage backups and test restoration. Passkeys, PQC, SIEM, RASP, malware scanning and immutable backup infrastructure are separate provider/backend projects and must not be claimed as active without verification.

## Cloudflare migration readiness (not deployed)
The allowlisted static build is `sh scripts/build-pages.sh`, output directory `dist`. Configure Cloudflare Pages Git integration for the main branch and test the preview before changing the production domain. The _headers file applies on Cloudflare Pages, not GitHub Pages. Configure HTTPS, WAF managed rules, bot protections and rate limits according to the chosen plan. The direct Supabase API needs its own protection. Update Auth URL allowlists and canonical links, and preserve old certificate QR links before migration.
Turnstile frontend integration covers signup, password sign-in and recovery. Set ONLY the public production site key in security-config.js; store the secret in Supabase Auth settings (never in Git). Allow the exact host in Cloudflare; verify staging flows and then coordinate activation of both ends. An empty key intentionally preserves current authentication. See https://supabase.com/docs/guides/auth/auth-captcha and https://developers.cloudflare.com/turnstile/.
Passkeys are available through newer Supabase SDKs; the pinned 2.49.4 SDK needs a separately tested upgrade and relying-party configuration. Do not weaken administrator AAL2 enforcement for passkey sign-in. See https://supabase.com/docs/guides/auth/passkeys.
On 2026-11-24 database administrator authorization was tightened to require a live session, confirmed email, verified MFA factor and AAL2 for all administrators. Enrollment was checked before migration; a database-only claims test rejected AAL1 and accepted AAL2. Preserve the administrator's recovery process and never remove their last factor without a verified replacement.

The administrator security center now provides a live same-origin response-header check and an explicit infrastructure checklist. A missing or unverified header is not marked active. GitHub Actions status is read from the main branch push workflow only. These checks do not establish actual WAF, DDoS, PQC or backup coverage.

## Provider-independent upgrade (2026-11-24)
Vercel deployment is prepared with vercel.json; import this repository, use main and the allowlisted dist build. It is not a deployed WAF. hCaptcha is supported as an opt-in alternative to Turnstile; create a real site key, configure it in security-config.js and enable the matching secret in Supabase Auth Protection. Do not enable either end alone. New private event dates and archive source references are guarded by existing member-content RLS. A read-only database test under a synthetic authenticated identity returned no applications, lineage, member requests or private content and was not an admin. No approved non-admin pair was available for a real cross-account test. Continue to require independently verified backups, malware quarantine, provider rate limits and breached-password protection.

The dependency-review job audits the pinned deployed npm SDK graph and retrieves the candidate SDK and QR browser files to syntax-check and report their public SHA-384 digests. This is not itself SRI or a browser regression test; inspect the results and independently verify the bytes before deploying an SDK update. The SQL access check in database/verify_access.sql is intentionally read-only and uses a synthetic identity.

The candidate SDK digest and QR digest were retrieved from successful GitHub Actions job 138675239359. The browser now pins these assets using SRI; CI re-fetches both exact URLs, verifies digests, checks SDK distribution equality with npm, and checks the methods used by the portal without real credentials. A full browser test of login, recovery, MFA and uploads remains necessary. SDK 2.119.2 is the release identified on 2026-11-24. Database-only active-session policies were also applied and checked for private member tables and archive access; existing certificate and application RPCs still require separate review.

## Password screening and WebAuthn readiness
The browser screens new passwords against Have I Been Pwned's Pwned Passwords range API only on form submission. It sends a five-character SHA-1 prefix and requests padded responses; the full password and full hash are never sent to HIBP. The SHA-1 is solely for matching the public corpus, not for storing passwords. New-password submission fails closed on a known match or an unavailable check; ordinary password sign-in is unaffected. This is a client-side safeguard and can be bypassed by direct Auth API callers. Native Supabase leaked-password enforcement requires Pro or higher and is not enabled. See https://haveibeenpwned.com/API/v3 and https://supabase.com/docs/guides/auth/password-security.
Passkey sign-in and registration are prepared behind passkeysEnabled=false. Supabase's experimental passkey API requires a configured relying-party origin and explicit Auth enablement; verify real browser flows and recovery before enabling the flag. AAL2 remains required for administrators. hCaptcha/Turnstile, external WAF, immutable backup retention, PQC and external SIEM remain unverified and are not enabled by this commit.
