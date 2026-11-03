# PROJECT LOG — NextBorder Admin Dashboard

## 2026-11-04
- User approved private admin-only Google Calendar integration.
- UI LOCK active. Preserve current design.
- Working branch created: `feature/private-google-calendar` from `nora/full-dashboard-replacement`.
- No production merge or deployment.
- Source audit: Vite + React + TypeScript; Supabase Auth checks admin role.
- Enquiries are read from Supabase, but inspected RLS policies did not show admin write permissions. Existing UI changes use localStorage.
- Clients and visa applications use localStorage through StorageService.
- Website-side Google Calendar OAuth code was not found in inspected source files.
- Next: implement server-side OAuth and admin-only calendar API, then add Upcoming Meetings without redesigning UI.


## 2026-11-04 — Admin dashboard execution checkpoint
- Admin-confirmed Vercel account email: `nextborder.visa@gmail.com`. This is an account identifier only; no password, token, or secret is stored here.
- Read-only Vercel project inventory under that account returned one project: `nextborder-visa` (Vite). It is associated with the public website domains and does not show `admin.nextborder.online`.
- Vercel domain-to-project lookup for `nextborder.online` returned HTTP 403 (account lacks access to that domain mapping). The correct hosting project for `admin.nextborder.online` is therefore not verified.
- Reconfirmed code risks: lead status/edit/delete and other CRM modules currently rely on browser localStorage; these changes are not shared/persisted across devices. Supabase enquiry read works, but write permissions were not established in the audited policies.
- Google Calendar website OAuth is not implemented. ChatGPT's connected calendar is separate and cannot silently authorize the website.
- Safety: no source code, database schema, RLS policy, Vercel setting, or production deployment was changed in this checkpoint. UI LOCK remains active. Continue on the feature branch only until the correct admin hosting project and secure backend path are verified.


## 2026-11-04 — CRM database migration prepared
- Added `supabase/migrations/20261104010000_admin_crm_tables.sql` on `feature/private-google-calendar`.
- Defines `student_clients` and `visa_applications` tables matching the current dashboard field model.
- Enables RLS; grants authenticated CRUD only where the existing `public.has_role(auth.uid(), 'admin')` check passes.
- Adds lookup/order indexes.
- Migration is committed to the feature branch only. It has NOT been applied to Supabase or production.
- Existing UI remains unchanged. Next implementation step: connect Clients and Visa Applications views to these tables and verify types/build in a preview environment.

## 2026-11-04 — CRM integration implementation in progress
- Passed the authenticated admin access token from `App.tsx` into the Clients and Visa Applications views.
- Updated both view prop interfaces to accept the token. Existing localStorage CRUD remains in place for now; Supabase CRUD is NOT yet implemented or verified.
- No production database migration applied, no merge, and no deployment.
- Next: replace localStorage operations in both views with admin-token Supabase REST reads/writes, then run build/type checks and document results.
