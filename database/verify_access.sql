-- Run from the owner's SQL editor only. Read-only check, no member records returned.
-- Synthetic authenticated subject is not an existing account; this is NOT a two-member test.
BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated","aal":"aal1"}',true);
SELECT NOT public.family_is_admin() AS non_admin_denied,
 (SELECT count(*) FROM public.member_applications)=0 AS applications_hidden,
 (SELECT count(*) FROM public.family_lineage)=0 AS lineage_hidden,
 (SELECT count(*) FROM public.family_member_requests)=0 AS requests_hidden,
 (SELECT count(*) FROM public.family_member_content)=0 AS private_content_hidden;
ROLLBACK;
