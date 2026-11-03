# NextBorder Admin Dashboard Audit

Date: 2026-11-04

## UI LOCK
Preserve the existing dashboard layout, colors, typography, navigation and effects. No production merge or promotion. Do not inspect or expose secrets. Do not weaken RLS. Prefer free-tier capabilities.

## Repository checkpoint
- Repository: dawantradelink-byte/dashbord
- Base branch: nora/full-dashboard-replacement
- Working branch: feature/private-google-calendar
- Production domain: https://admin.nextborder.online

## Findings from source and database inspection
1. Frontend uses Vite, React and TypeScript.
2. Admin authentication uses Supabase Auth and checks public.user_roles for the admin role.
3. App.tsx loads public.enquiries from Supabase using the verified admin access token.
4. Inspected enquiries RLS policies show admin SELECT, but no admin INSERT, UPDATE or DELETE policies. Current lead edit/status/delete handlers write through localStorage, so changes are not reliably shared across devices.
5. Students/clients, visa applications and staff views use the localStorage-backed StorageService. These are not yet a central multi-device CRM.
6. Existing Supabase tables include enquiries, user_roles, content_articles, site_visits, editorial settings/logs, IELTS data and NORA conversations. RLS is enabled on inspected public tables.
7. Security advisor findings: agent_state and security_rate_limits have RLS enabled without policies; pg_net is installed in public; leaked-password protection is disabled. No changes were made.
8. Performance advisor reported unindexed foreign keys and RLS policy optimization warnings. No changes were made.
9. No website-side Google Calendar OAuth implementation was found in the inspected source files. A Google Calendar connection in ChatGPT is not automatically available to the deployed website.

## Approved Google Calendar design
- Private, admin-only integration.
- Read upcoming events and create/update/cancel events after explicit OAuth authorization.
- Asia/Dhaka as default timezone.
- Meeting form includes title, client, purpose, start/end, optional attendee email, optional Meet link and reminder.
- OAuth callback and token handling must be server-side, preferably Supabase Edge Functions.
- Never expose client secret or refresh tokens in browser code or VITE_* variables.
- Enforce admin authorization on every calendar operation.
- Verify event changes against the connected Google Calendar.

## Required Google setup
A Google Cloud OAuth Web Client is required. The authorized redirect URI can only be finalized after the server-side callback endpoint is implemented. The client secret must be stored as a server-side secret, not in frontend variables.

## Implementation sequence
1. Preserve and test login/UI baseline.
2. Implement secure server-side Google OAuth callback and token storage.
3. Implement admin-only calendar list/create/update/cancel endpoints.
4. Add Upcoming Meetings using existing visual components and no shell redesign.
5. Test only on feature branch/preview.
6. Separately address CRM persistence with explicit admin-only database authorization and safe migration.

## Out of scope without separate approval
UI redesign, production merge/promotion, destructive data changes, automatic blog publishing, unrelated website changes, and unrelated database policy changes.
