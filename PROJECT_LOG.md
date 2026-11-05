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
- Enables RLS; grants authenticated CRUD only where the existing `public.has_role(auth.uid(), 'admin'::app_role)` check passes.
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
- No merge or production deployment has occurred as part of recording this authorization. Record actual deployment URL, commit, time, and verification evidence in this log only after a successful production deployment.

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
- Keep feature work isolated. Do not merge the 11 commits until CRM integration, build/test evidence, and database migration review are complete.

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

## 2026-11-04 — CI validation and security-path review
- Added `.github/workflows/nextborder-ci.yml` on the feature branch. Pushes to the feature branch and pull requests targeting `nora/full-dashboard-replacement` now run locked Bun dependency installation, `bun run lint` (TypeScript `tsc --noEmit`), and `bun run build`.
- Reviewed the admin sign-in gate: it authenticates through Supabase Auth and separately verifies the user's `admin` role before rendering the dashboard. The legacy `adminPasscode` field in local settings is not used by this sign-in gate; it is a settings UI field, not an authentication control. Do not treat it as security.
- Confirmed that operational summary counts still read clients and visa records from browser localStorage, while their dedicated views now use Supabase. This creates a dashboard consistency gap until the summary is migrated to the same database source.
- Confirmed that leads, blogs, staff, portal settings and telemetry still use browser localStorage in the inspected storage service. They are not yet cross-device database-backed. Avoid describing the entire admin portal as production-persistent.
- No UI changes, production deployment, merge, Supabase schema changes, or secrets inspection occurred. CI result is pending after this commit.

## 2026-11-04 — Latest feature preview smoke check
- GitHub Actions run `41742187748` completed successfully on commit `831636fc605e50437dfa198920648b0f381beb65`: locked Bun dependency install, TypeScript validation, and Vite production bundle validation all passed.
- Created a Vercel Preview deployment from the exact same feature-branch commit: deployment `dpl_DVD6vrK8L6zg2vKqQbLQvPDNNvbU`, URL `https://nextborder-visa-2711iz3j9-next-border-love-final.vercel.app`, state READY, target preview (not production).
- HTTP smoke checks returned 200 for the preview root HTML and its referenced JavaScript bundle. This verifies static delivery only; it does not prove authenticated browser behavior or Supabase CRUD.
- Build warning observed: main JavaScript bundle is approximately 709 kB minified (193 kB gzip), above Vite's 500 kB advisory threshold. Existing Vite config also warns about `__dirname` under native config loading. Neither warning failed the build; evaluate safe code-splitting/config cleanup without changing UI.
- Source re-review confirms dashboard lead status/edit/delete/evaluation actions still write browser localStorage while public enquiries are loaded from Supabase. The dashboard's top KPI cards also have not yet been proven to use live CRM data. This is a material production-readiness gap.
- Dedicated Clients and Visa Applications views call the new Supabase CRUD service, but their target tables remain absent from the active Supabase project because the migration is unapplied. No authenticated CRUD test can pass until a safe database migration environment is available.
- No production deployment, merge, production alias change, Supabase migration, or secrets inspection occurred. Production release remains blocked pending runtime auth/CRUD verification, migration safety, and consistency across CRM data views.

## 2026-11-04 — Firecrawl preview QA
- Ran a read-only browser inspection against the feature Preview URL using Firecrawl. The root URL rendered the Admin Console login form with email/password inputs and the Supabase admin-role explanation. No credentials were entered and no form was submitted.
- The page loaded its JavaScript and CSS assets; no browser console errors were reported by the inspection.
- Unauthenticated direct requests to `/dashboard`, `/admin`, and `/ielts-practice` returned Vercel `404 NOT_FOUND`. Source review shows this app currently uses one root-mounted React application with dashboard tabs held in component state; those pathnames are not declared routes. Therefore these 404s are not, by themselves, proof of a broken supported route. No visible dashboard/client/visa navigation exists before successful login.
- The browser session did not contain the user's Supabase login state. Authenticated dashboard navigation and CRUD could not be independently verified through Firecrawl. No login attempt, data mutation, or deletion was performed.
- A follow-up browser interaction timed out during responsive viewport inspection; mobile layout is unverified.
- Read-only Vercel runtime-error summary for the project showed six historical `security-rate-limit` errors on `/__server` with message `Cannot read properties of undefined (reading 'rest')`; the most recent timestamp was 2026-11-04 00:49:46 UTC. These errors predate the current preview session and need separate attribution before changing the security limiter.
- The source branch's current `PROJECT_LOG.md` records prior checkpoints; no source-code, Supabase schema, Vercel settings, or production deployment was changed during this QA pass.

## 2026-11-04 — Admin route fallback fix (Preview only)
- Added `vercel.json` on `feature/private-google-calendar` with rewrites for the supported admin entry paths `/dashboard` and `/admin` to the Vite `index.html`. No public content paths are rewritten.
- Created Vercel Preview deployment `dpl_74Q7oSDJHiBzJtPAoTLBHbgiDShR` from commit `d4151fdad3076f599fb77ec42d634a416e237fd2`; build completed and state is READY. Preview URL: `https://nextborder-visa-520m9c18j-next-border-love-final.vercel.app`.
- Firecrawl read-only check confirmed `/dashboard` and `/admin` now return the React Admin Console login screen rather than Vercel 404. No credentials were entered, and no user data was changed.
- The rewrite does not create separate route-specific pages; the app still initializes its Dashboard tab at the root after successful admin authentication.
- This is a Preview-only verification. Production was not changed or promoted.
- CRM CRUD remains blocked for real data until the prepared Supabase migration creates `student_clients` and `visa_applications` in a safe database environment. There is no active staging Supabase project, and the migration has not been applied to the live project.
- The Vercel build still reports the existing 709 kB JavaScript chunk advisory and the `__dirname` config warning. Build itself succeeded.

## 2026-11-05 — CRM migration and production-readiness checkpoint
- Rechecked the feature branch. Current HEAD before this log update: `32374815e5cd68d1cbf4e6ef1ebbc5414af08cfd`. Compared with the latest feature Preview source commit `d4151fdad3076f599fb77ec42d634a416e237fd2`; the only intervening change was this project log, so the Preview contains the same application code.
- GitHub Actions run [41751251770](https://github.com/dawantradelink-byte/dashbord/actions/runs/41751251770) on the current HEAD completed successfully. Locked Bun install, `bun run lint` (TypeScript `tsc --noEmit`), and `bun run build` all passed. `package.json` has no unit/integration test script, so there is no automated test suite beyond typecheck/build in this repository.
- Feature Preview deployment `dpl_74Q7oSDJHiBzJtPAoTLBHbgiDShR` is READY at `https://nextborder-visa-520m9c18j-next-border-love-final.vercel.app`. Read-only browser checks returned HTTP 200 for both the root login page and `/admin`; neither check signed in or submitted a form.
- Confirmed the Vercel project's non-secret `VITE_SUPABASE_URL` resolves to Supabase project ref `jgxgzwoediekyeiysgwo`. That is the sole active healthy project under the connected NextBorder Supabase account; the other connected project is inactive. No secret environment values were read or exposed.
- Applied the additive migration `admin_crm_tables_20261104` to the confirmed active Supabase project. Supabase recorded migration version `20261105030519`. It created `public.student_clients` and `public.visa_applications`; both have RLS enabled and zero rows. Their only policies are `FOR ALL TO authenticated` with `public.has_role(auth.uid(), 'admin'::app_role)` in both `USING` and `WITH CHECK`. CRUD grants are limited to `authenticated`; no service-role key is used by the browser CRM service.
- Reviewed the existing role helper: `public.has_role` is SECURITY INVOKER and delegates to `private.has_role`, which is SECURITY DEFINER with a fixed search path and verifies `auth.uid() = _user_id` before checking the role table.
- Ran transaction-scoped SQL RLS smoke checks with synthetic identities. Admin SELECT/INSERT/UPDATE/DELETE operations completed for both CRM tables and the transaction was rolled back. A synthetic non-admin authenticated identity was denied an INSERT. Follow-up counts confirmed no smoke-test rows remain. This validates the database policy path, but is not a substitute for testing the actual browser session token and UI.
- Supabase security advisor returned no findings against the two new CRM tables. Existing project-wide advisories remain (including RLS-without-policy findings on unrelated internal tables, pg_net in public, and leaked-password protection disabled); none were changed in this checkpoint.
- Rechecked Vercel production aliases. `admin.nextborder.online` currently points to READY deployment `dpl_49J9wRbmgtR5h5CqdcFZKXgdnRye` from `dashbord` / `nora/full-dashboard-replacement` at commit `e9009e5b8e743909727199f516e7fd4f537311ad`. The public aliases `nextborder.online` and `www.nextborder.online` remain on separate deployment `dpl_5fwJVePhbhfiPRymbbekmaxKd7Gd` from the canonical `nextborder-visa` repository. The feature Preview is not aliased to production. A read-only request for Vercel's rollback-candidate listing returned 403, but the existing admin alias target and its READY deployment were verified; manual rollback can restore `admin.nextborder.online` to that deployment with Vercel alias reassignment. Do not reassign the apex or www aliases during an admin-only release.
- Database rollback posture: keep these additive tables in place if application code is rolled back; do not drop them after records are created. Revert only the admin domain alias to the verified baseline deployment unless a separately reviewed forward database migration is needed.
- Important data-preservation gap: Clients and Visa Applications previously stored records in browser localStorage keys `nb_clients_data_v3` and `nb_visas_data_v3`. The new views now read/write Supabase only. Existing browser-local records, if any, are not automatically imported and would no longer appear in these views. This automation cannot inspect or export the founder's browser localStorage. Do not deploy until the founder confirms those stores are empty or exports/imports any records that must be retained.
- Release remains blocked on a real authenticated browser CRUD test using the founder's admin session and the localStorage data-preservation check. No merge, production deployment, alias change, or UI redesign occurred. No paid API was used. Next: preserve/confirm existing local CRM data, perform actual preview login and CRUD verification, then deploy the exact verified feature commit and assign only `admin.nextborder.online`.


## 2026-11-05 — CRM mutation hardening and release-gate recheck
- Re-read this log and inspected the live feature branch before changing files. Starting branch HEAD was `d6daa270c4a3ee374d60e6eff51aaba377f2d2c8`; the only commit since the previously validated code checkpoint `32374815e5cd68d1cbf4e6ef1ebbc5414af08cfd` was a documentation-only update to this log.
- Confirmed `App.tsx` obtains the session token from `useAdminSession()` and passes it to both Clients and Visa Applications views. `AdminAuthGate` validates the Supabase user and separately checks the `admin` role before rendering the dashboard. The CRM service uses the configured public/publishable key with the admin access token; no service-role key is used in the browser.
- Confirmed Vercel environment-variable metadata contains `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for Production, Preview, and Development. Only names/targets/type metadata were checked; no environment value was decrypted or inspected.
- Rechecked the active Supabase project `jgxgzwoediekyeiysgwo`: migration ledger contains version `20261105030519` named `admin_crm_tables_20261104`; both CRM tables exist with RLS enabled and zero rows. The only policies on each table are `FOR ALL TO authenticated` with `has_role(auth.uid(), 'admin'::app_role)` in both USING and WITH CHECK. No additional database migration was needed or applied in this run.
- Found a CRUD edge case: the delete methods previously ignored the PostgREST representation, so a zero-row delete could be treated as successful and the card removed from local UI state. Also, create methods did not explicitly validate that a row was returned, and the shared request helper did not reject an empty session token before sending the request.
- Fixed `src/services/adminCrmService.ts` without changing component layout or visual styling: it now rejects a missing admin token, verifies a created row is returned, and requires exactly one row from each delete operation before the view treats deletion as successful.
- Aligned the local migration filename with the already-applied Supabase ledger version to prevent a future CLI migration-history mismatch: renamed `20261104010000_admin_crm_tables.sql` to `20261105030519_admin_crm_tables_20261104.sql`. The SQL schema/policies are unchanged; this was a repository-only rename and did not reapply the migration.
- Code commit: `d6daa270c4a3ee374d60e6eff51aaba377f2d2c8` — `fix: harden admin CRM mutation handling and align migration history`.
- GitHub Actions run [41965705406](https://github.com/dawantradelink-byte/dashbord/actions/runs/41965705406) completed successfully on that exact code commit. Locked dependency installation, TypeScript validation (`bun run lint`), and production bundle validation (`bun run build`) all passed. This repository has no unit/integration test script, so no automated browser/API CRUD test suite is available.
- Created a Vercel Preview deployment from the exact code commit: `dpl_7qUReSabkzbjwAeeDFRJd37LU17o`, URL `https://nextborder-visa-1asuo3mu8-next-border-love-final.vercel.app`, state READY, target Preview. HTTP smoke checks returned 200 for `/`, `/admin`, and `/dashboard`; these verify static app delivery and rewrites only, not authenticated CRUD. Build warnings remain non-blocking: `vite.config.ts` uses `__dirname` with native config loading, and the main JavaScript bundle is 709.45 kB minified (above the 500 kB advisory threshold).
- Reverified the Vercel project/domain scope: project `nextborder-visa`, ID `prj_xFGj8srhuCoff1Yt2v4BWPjfXTXp`, team `team_oLxJbrU7I0lOA7po7WSzj6ll`. `admin.nextborder.online` is verified and currently aliases to READY baseline deployment `dpl_49J9wRbmgtR5h5CqdcFZKXgdnRye` from `nora/full-dashboard-replacement` at `e9009e5b8e743909727199f516e7fd4f537311ad`. The public aliases `nextborder.online` and `www.nextborder.online` remain on `dpl_5fwJVePhbhfiPRymbbekmaxKd7Gd`; do not reassign them during an admin-only release. The latest project Production deployment `dpl_Gk6GsdDStS66GwizVLrjwCSfVkEi` is READY but does not currently own the custom admin alias.
- Verified the targeted rollback method: if a later admin-only deployment fails, reassign only `admin.nextborder.online` to baseline deployment `dpl_49J9wRbmgtR5h5CqdcFZKXgdnRye` using Vercel alias assignment. The baseline is still READY and the current alias mapping was read back. No alias was changed in this run.
- Production remains blocked on two founder-side checks that cannot be completed by this automation: (1) sign in to the Preview using the real admin account and verify create/read/update/delete for one temporary Client and one Visa Application; (2) confirm the old browser-localStorage keys `nb_clients_data_v3` and `nb_visas_data_v3` are empty or export/import any records that must be retained. The automation cannot access the founder's browser session or localStorage, and must not ask for or inspect credentials.
- Additional scope note: other dashboard modules (including Leads, Blogs, Staff, Settings, and some analytics state) still use browser localStorage. This release must not be described as making the entire admin portal cross-device persistent.
- No merge, Production deployment, Production alias change, database mutation, secret inspection, or paid API usage occurred in this run. Next: complete the real Preview CRUD test and localStorage preservation check, then deploy the verified code to the admin alias only and record the live commit/URL/evidence.

- Preview database-isolation check: there are no branch-specific Vercel environment overrides for `feature/private-google-calendar`; the shared Preview environment has the same `VITE_SUPABASE_URL` target as the active project identified above. The Preview therefore uses the active Supabase database, not an isolated staging database. No browser CRUD writes were made. Do not run create/update/delete smoke tests on Preview until the founder explicitly accepts temporary QA rows in the live CRM or provides an active staging Supabase project.
