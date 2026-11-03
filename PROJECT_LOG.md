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

## 2026-11-04 — Founder deployment authorization
- User explicitly approved production deployment of the NextBorder Admin Dashboard after implementation and verification are complete.
- This approval authorizes the deployment step for this project, but does not waive security checks, production database migration review, backup/rollback preparation, or verification of the correct hosting project/domain.
- Do not deploy unfinished or failing code. Complete Supabase CRUD implementation, type/build checks, development preview tests, and deployment target verification first.
- No merge or production deployment has occurred as part of recording this authorization. Record actual deployment URL, commit, time, and verification evidence in this log only after a successful deployment.


## 2026-11-04 — Production target re-verification
- Rechecked the connected Vercel account and its complete visible project inventory.
- The account currently exposes one project: `nextborder-visa` (Vite), project ID `prj_xFGj8srhuCoff1Yt2v4BWPjfXTXp`, under team `next-border-love-final`.
- Read-only project-domain lookup confirms `admin.nextborder.online` is attached to this project and marked verified. The project domain list also includes `nextborder.online` and `www.nextborder.online`.
- Latest deployment inventory shows the current latest deployment is READY but is a non-production deployment from `nora/full-dashboard-replacement` at commit `fe3be359b7f80118a368dda7bc5493b788b146e1`. A prior deployment at `e9009e5b8e743909727199f516e7fd4f537311ad` is marked production and READY.
- This confirms the Vercel project/domain association, but does NOT establish that the current feature branch has been built, tested, or deployed to production. Do not promote or deploy until CRM CRUD, preview verification, migration safety, and rollback checks pass.
- GitHub confirms `feature/private-google-calendar` exists.
- CRM integration remains incomplete: Clients and Visa Applications still use localStorage. An attempted creation of a shared Supabase REST service did not complete; no claim of implementation or deployment is made.
- No Vercel settings, deployment targets, Supabase schema, secrets, or production data were changed during this read-only verification.

## 2026-11-04 — Branch and deployment comparison
- Compared `feature/private-google-calendar` against the Vercel-linked base branch `nora/full-dashboard-replacement`.
- Feature branch is 11 commits ahead and 0 commits behind. The current feature branch contains the CRM migration, audit/log documentation, and access-token prop wiring; the two CRM views still rely on localStorage.
- Production remains on the base branch commit `e9009e5b8e743909727199f516e7fd4f537311ad`; the latest non-production deployment corresponds to base branch commit `fe3be359b7f80118a368dda7bc5493b788b146e1`.
- Keep feature work isolated. Do not merge or promote the 11 commits until CRM integration, build/test evidence, and database migration review are complete.


## 2026-11-04 — Supabase CRM integration code checkpoint
- Added `src/services/adminCrmService.ts` with authenticated Supabase REST operations for listing, creating, updating, and deleting student client and visa application records. Uses the public/publishable Supabase key plus the verified admin access token; no service-role key is used.
- Updated `ClientsView.tsx` to load records from Supabase and persist create, stage update, and delete actions through the service. Removed its direct localStorage CRUD calls. Added an inline error message while preserving the existing visual layout.
- Updated `VisaApplicationsView.tsx` to load records from Supabase and persist create, status update, and delete actions through the service. Removed its direct localStorage CRUD calls. Added an inline error message while preserving the existing visual layout.
- Confirmed `App.tsx` passes the current admin access token to both views.
- Read-only Supabase inspection confirms the target tables are not yet present in the connected project. Existing public policies predominantly use the role-checking pattern `has_role(auth.uid(), 'admin'::app_role)`; the public and private helper functions have different security-definer settings. The prepared migration has not been applied.
- Validation still outstanding: no local/CI TypeScript build or runtime CRUD test has been completed. Vercel returned zero deployments for this feature branch, so no preview build is available yet.
- No Supabase schema, production data, Vercel configuration, production deployment, or secrets were changed. UI LOCK remains active.
- Next: verify code with a build/test environment, review migration helper semantics and schema compatibility, then apply to a non-production database before any production release.

- Additional CI check: GitHub combined commit status and workflow-run lookup for the latest checkpoint commit returned no status checks and no workflow runs. This is not a passing build; automated build evidence is currently unavailable.


## 2026-11-04 — Feature preview build and database authorization review
- Created a Vercel Preview deployment from `feature/private-google-calendar` at commit `ff7dea5e43b25a1d16abb2e2f70c2259d493e46d`; deployment ID `dpl_2i9tivk3jVWuAgS9c7oSPrUSd2M8`, URL `https://nextborder-visa-git-feature-priva-7fcb9f-next-border-love-final.vercel.app`, status `READY`, target is preview (not production).
- Vercel build log confirms Bun install completed and `bun run build` / `vite build` ran successfully. Vite emitted a non-blocking warning that `vite.config.ts` uses `__dirname` with native config loading; no build failure was reported.
- Read-only Supabase review confirmed `public.has_role(uuid, app_role)` is SECURITY INVOKER and delegates to `private.has_role`, which is SECURITY DEFINER with fixed search_path and verifies `auth.uid() = _user_id` before checking `public.user_roles`. Both functions are executable by authenticated and not executable by anon.
- Supabase project inventory shows only one active NextBorder project; the other connected Supabase project is inactive. No active staging database is available. The target tables `student_clients` and `visa_applications` are still absent from the active database; migration remains unapplied.
- Preview build is not equivalent to a runtime/browser test. TypeScript `tsc --noEmit`, authenticated CRUD tests, browser smoke tests, and a staging migration test remain outstanding. Direct preview URL inspection was unavailable in this session.
- No production deployment, production database migration, branch merge, domain alias change, or secret inspection occurred. Keep production release blocked until a safe staging DB path and runtime CRUD verification are available.
