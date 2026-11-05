# Project Log

## 2026-11-06 | Admin logo correction
- Target: `dawantradelink-byte/dashbord`, branch `fix/use-live-main-site-logo`.
- User requested the Admin dashboard use the exact official logo from `https://www.nextborder.online/`.
- Verified the public homepage references `https://www.nextborder.online/nextborder-logo.svg` in its crest and footer.
- Updated `src/components/NextBorderLogo.tsx` to load that canonical live-site SVG instead of the unrelated local PNG.
- Preserved the component props (`className`, `size`, `showText`) for existing call sites.
- Change committed on an isolated fix branch; production not yet updated.
- Component commit: `96d46e390b30454345aa405527430ff049c7dfd0`.
