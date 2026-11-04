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
