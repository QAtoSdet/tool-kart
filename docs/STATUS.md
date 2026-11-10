# Project status — at a glance

> **What to do next?** See [`docs/PLAN.md`](./PLAN.md) — the living execution checklist
> (Phase 0–4 with checkboxes, patterns, and current verified state).

_Last updated: November 2026._

Quick summary: **the app is fully built, tested, and production-ready.** All 9 build tasks and
the UX pass are done. What remains is the public launch (manual, needs your accounts) and the
ongoing content work that actually earns the money.

Health check: **188 automated tests passing**, production build clean, dev server serves every
route. Stack pinned to **Next.js 15.5.x + React 19.0** (the newer Next 16 line caused a runtime
crash and must not be used until stable).

---

## ✅ Completed

### Core build (Tasks 1–9)
| # | Task | What's done |
| --- | --- | --- |
| 1 | Project scaffold + shared layout | Next.js + TS + Tailwind, Vitest + RTL tests, header/footer/container, design-system primitives, tool registry, homepage grid |
| 2 | ToolPage shell + SEO metadata | Reusable tool wrapper (title, explainer, FAQ, ad slots), per-route metadata, JSON-LD, "Private by design" badge |
| 3 | Image Compressor | Client-side Canvas compress/resize, drag-drop, format/quality/size controls, before-after preview, download |
| 4 | QR Code Generator | Live text/URL → QR, size + error-correction + colour options, PNG/SVG download |
| 5 | Age / Date Calculator | Exact age, days-to-birthday, born-on weekday, days-between-dates; timezone-safe date math |
| 6 | EMI Calculator + Unit Converter | EMI with yearly amortization + INR formatting; converter for length/weight/area/temperature |
| 7 | Legal/info pages | Privacy, Terms, About, Contact — AdSense-ready, honest data disclosure, linked in footer |
| 8 | SEO infrastructure | sitemap.xml, robots.txt, site-wide + per-tool JSON-LD, static prerendering, per-tool code-split |
| 9 | AdSlot (switch-ready) + analytics | Env-flag AdSense (off until approval, no per-page edits), prod-only Google Analytics |

### UX pass (post-MVP)
- ✅ Accessible mobile navigation (hamburger menu).
- ✅ Cross-tool "Try another free tool" discovery strip on every tool page.
- ✅ Privacy-led homepage hero with trust chips.
- ✅ Elevated tool panel (clear focal point).
- ✅ "Browse tools" button smooth-scrolls without putting `#tools` in the URL.

### SEO quick fixes (Phase 0)
- ✅ Dedicated homepage metadata (absolute title, no duplicated brand) + `ItemList` JSON-LD listing all tools.
- ✅ Reusable `CopyButton` + copy-to-clipboard on calculator outputs (unit converter, GST, percentage; password generator already had it).
- ✅ `STATUS.md` refreshed to match reality.

### Category hubs (Phase 2a)
- ✅ 5 category hub pages (`/finance-calculators`, `/image-tools`, `/calculators`, `/converters`, `/generators`) from a `lib/categories.ts` registry, with `ItemList` JSON-LD, auto-added to the sitemap.
- ✅ Tool breadcrumbs now go `Home > Category hub > Tool`; homepage has a "Browse by category" section linking to every hub.

### Content hub + topic clusters (Phase 1)
- ✅ Lightweight content system: `lib/guides.ts` registry (mirrors the tool registry), reusable `ContentPage` shell (breadcrumbs, related-tool callout, optional table of contents, prose body, FAQ, cross-linking), and `Article` + `FAQPage` JSON-LD.
- ✅ Guides auto-included in `sitemap.xml`; `/guides` index page grouped by category with `ItemList` JSON-LD.
- ✅ Bidirectional tool↔guide linking: every tool page shows its related guides; every guide links to its tool and to other guides (topic clusters).
- ✅ 4 cornerstone guides shipped (EMI, GST, SIP-vs-lump-sum, image-to-KB), spanning Finance + Image.
- ✅ "Guides" link added to desktop + mobile nav for sitewide hub discovery.

---

## 🟡 Partly done — needs your action

### Task 10 — Deploy & launch
The code is build-verified and ready. The remaining steps are manual because they need **your**
accounts/credentials (I can't and shouldn't do these). Full guide: `docs/DEPLOYMENT.md`.

Your checklist:
- [x] Set a real contact email in `src/lib/site.ts` (now `toolkart.help@gmail.com`).
- [ ] Push the repo to GitHub.
- [ ] Deploy on Vercel (free tier); set `NEXT_PUBLIC_SITE_URL`.
- [ ] Buy + connect a custom domain (HTTPS is automatic).
- [ ] Submit `sitemap.xml` in Google Search Console; request indexing.
- [ ] (Optional) Create a GA4 property; set `NEXT_PUBLIC_GA_ID`.
- [ ] After a few weeks of traffic: apply to AdSense, then set `NEXT_PUBLIC_ADS_ENABLED=true` +
  `NEXT_PUBLIC_ADSENSE_CLIENT` to turn on ads.

---

## ⬜ Not started

### Task 11 — Ongoing growth engine (this is what earns the money)
- [x] Content hub system built: `lib/guides.ts` + `ContentPage` shell + sitemap integration (Phase 1). Adding a guide = one registry entry + one route, like adding a tool.
- [x] 3 cornerstone guides shipped (EMI, GST, image-to-KB) as proof of the cluster pattern.
- [ ] Keep publishing ~one guide per week; expand finance guides next (SIP, income tax).
- [ ] Add high-demand tools over time: PDF compress/merge/split, image format converter,
  income-tax calculator, CGPA-to-percentage, simple/compound interest.
- [ ] Use Search Console data to improve pages ranking on page 2–3.
- Reuses the existing shells, so no rearchitecting.

### Optional polish (deferred, not required to launch)
- [ ] Replace emoji icons with an inline SVG icon set (more consistent across devices).
- [x] Copy-to-clipboard on calculator outputs (unit converter, GST, percentage; password already had it).
- [ ] Favicon / brand mark.
- [ ] Refined empty/loading states.

---

## 📌 Known notes & honest caveats
- **Lighthouse score** not machine-verified here — run it on the deployed URL. Architecture is
  built for strong scores (static, code-split, client-side).
- **Browser-rendered pixels / real-device testing** can't be done from the build environment —
  the tool logic and page structure are tested, but visual/interaction polish should be
  eyeballed in a browser.
- **Earnings reality:** ₹0 until AdSense approval + traffic; ₹5,000–10,000/month is a 6–12 month
  effort driven by Task 11, not the build. See the top of `docs/ROADMAP.md`.
