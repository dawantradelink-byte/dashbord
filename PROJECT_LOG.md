# Project Log

## 2026-11-06 | Admin logo correction
- Target: `dawantradelink-byte/dashbord`, branch `fix/use-live-main-site-logo`.
- User requested the Admin dashboard use the exact official logo from `https://www.nextborder.online/`.
- Verified the public homepage references `https://www.nextborder.online/nextborder-logo.svg` in its crest and footer.
- Updated `src/components/NextBorderLogo.tsx` to load that canonical live-site SVG instead of the unrelated local PNG.
- Preserved the component props (`className`, `size`, `showText`) for existing call sites.
- Change committed on an isolated fix branch; production not yet updated.
- Component commit: `96d46e390b30454345aa405527430ff049c7dfd0`.

## 2026-11-06 | Dashboard reset safety fix
- Target: `nora/dashboard-working-fix` (development branch only).
- Replaced the Settings page's broad `localStorage.clear()` reset with removal of only the seven `nb_*_data_v3` dashboard-owned keys.
- This prevents the dashboard reset control from deleting unrelated same-origin application data or authentication/session storage.
- Preserved the existing confirmation dialog and reload behavior.
- Commit: `fdf00b78e0a95801814caaa13fd30d9becd03c1f`.
- Build/lint and browser verification are still pending; no merge or production deployment performed.

## 2026-11-06 | Admin dashboard investigation and handoff state
- Dashboard URL: `https://admin.nextborder.online/`.
- Repository: `dawantradelink-byte/dashbord`.
- Production branch: `nora/full-dashboard-replacement`.
- Working branch: `nora/dashboard-working-fix`. Keep all further work isolated here unless the user explicitly authorizes another branch.
- Vercel project: `prj_xFGj8srhuCoff1Yt2v4BWPjfXTXp`; team slug: `next-border-love-final`.
- Supabase project ref: `jgxgzwoediekyeiysgwo`.
- Audit found that `src/App.tsx` reads public enquiries from Supabase and refreshes them every 30 seconds, while lead edits/status changes/additions/deletions are currently stored only in browser localStorage. A refresh can therefore overwrite those local-only changes.
- `ClientsView.tsx` and `VisaApplicationsView.tsx` currently use localStorage only. Their persistence to Supabase has not been implemented or verified.
- `WebsiteAnalyticsView.tsx` currently shows local/demo analytics values and a GA Measurement ID setting; it does not yet fetch live GA4 reports. Supabase `site_visits` telemetry exists and was observed to contain 787 rows during the audit, but no live analytics integration has been implemented.
- Supabase tables observed during the read-only audit included `enquiries`, `student_clients`, `visa_applications`, `site_visits`, `content_articles`, IELTS tables, and NORA/editorial automation tables. RLS write permissions and exact schemas still need safe verification before any database-backed CRUD work.
- No Supabase schema, RLS policy, or data was changed. No service-role key or secret was inspected.
- No merge, production promotion, or production deployment was performed.
- The development branch did not yet have a confirmed Vercel preview deployment at the time of this log update.
- Remaining verification: run build and lint, obtain a preview deployment if available, and test the dashboard in-browser before calling it working.
- Next safe work: verify build/lint and preview status; inspect only the minimum RLS policies/schema needed to determine whether permitted admin writes are possible. Do not bypass RLS, invent permissions, or write production data.
- UI preservation constraints: retain the approved existing dashboard design, official NextBorder logo, Ruby Glass UI, Koi Pond animation, navigation, and layout. Avoid generic AI-generated styling.
- Operating constraints: Free-first; do not use Lovable; do not inspect secrets; do not merge or promote to production without explicit user authorization; do not make schema/RLS changes without explicit authorization.
- User communication preference: simple Bangla, short and clear; do not send unnecessary progress messages. Do not claim the dashboard is working until build/lint and runtime/browser checks are verified.

## 2026-11-06 | Read-only Supabase permissions and persistence audit
- Rechecked the live schema metadata and `pg_policies` using read-only queries only; no data rows or secrets were read or changed.
- `enquiries`: RLS enabled; current admin policy grants SELECT only. There is no admin INSERT/UPDATE/DELETE policy. Do not wire destructive/edit actions to Supabase or pretend they persist. A secure write design needs explicit user authorization and a reviewed policy/backend approach.
- `site_visits`: RLS enabled; current admin policy grants SELECT only. This supports a potential read-only real analytics view for authenticated admins.
- `student_clients`: RLS enabled; an authenticated admin-only ALL policy exists via `has_role(auth.uid(), 'admin'::app_role)`. Table columns include name, email, phone, target_country, target_university, current_stage, assigned_counselor, notes, created_at, updated_at.
- `visa_applications`: RLS enabled; an authenticated admin-only ALL policy exists via the same admin-role check. Table columns include student_name, country, visa_type, intake_season, application_status, cas_i20_number, deadline, last_updated, created_at.
- Current Clients and Visa Applications React views still use browser localStorage. Their corresponding database tables currently have zero rows in the audit snapshot. A database-backed integration is possible under the existing admin policies, but must be implemented and tested carefully with the verified session token.
- Vercel preview lookup for `nora/dashboard-working-fix` returned zero deployments. GitHub Actions returned zero workflow runs for this branch, and the dashboard commit had no reported status checks. Build/lint and runtime verification therefore remain unconfirmed.
- `package.json` scripts: `npm run build` runs `vite build`; `npm run lint` runs `tsc --noEmit`. No test script is defined.
- Next implementation priority: safely connect Clients and Visa Applications to their existing admin-protected tables, then connect Website Analytics to read-only `site_visits`. Keep Leads read-only against Supabase until a properly authorized write path exists. Add visible save/error/loading states and avoid silently falling back to local-only persistence.
- Verification gate remains unchanged: no claim of completion until build, lint, preview deployment, and browser workflow checks pass. No merge or production deployment without explicit user authorization.
