# Project Log

## 2026-11-06 | Admin logo correction
- Target: `dawantradelink-byte/dashbord`, branch `fix/nextborder-logo-asset`.
- Confirmed the Vercel production deployment is sourced from `nora/full-dashboard-replacement`; production branch was not changed.
- Updated `src/components/NextBorderLogo.tsx` to use the existing `src/assets/company-logo.png` asset instead of the hand-drawn inline SVG.
- Preserved the component props (`className`, `size`, `showText`) so existing Sidebar and Header call sites remain compatible.
- Verification: source file and referenced asset both exist on the production source branch; change committed on an isolated fix branch.
- Not done: no merge, production deployment, domain change, secrets inspection, or paid API call.
- Commit: `bd7ed5192a8eef476f654469ee1983286c815d89`.
