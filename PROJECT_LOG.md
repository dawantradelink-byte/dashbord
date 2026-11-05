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
