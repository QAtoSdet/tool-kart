# Growth & Enhancement Plan

A living, self-serve checklist. Tick items off as you complete them; pick the next unchecked
item and proceed — no need to re-ask. Grouped by phase, ordered by traffic impact. Each pending
item says **what**, **why**, and **how** (files + patterns to copy), so you can act without
re-deriving the approach.

**Legend:** ✅ done · ⬜ not started · 🔄 ongoing

**Verify after every change:** `npm run build` (clean compile + lint) → `npm test` (all green) →
optionally check the built HTML in `.next/server/app/…` for JSON-LD/links. Current state at the
bottom of this file.

---

## Verified state (as of 2026-11-09)

- **Live site:** `https://www.tool-kart.com`. The `www` host is canonical — keep
  `NEXT_PUBLIC_SITE_URL=https://www.tool-kart.com` in Vercel. Non-www → www is a 308 redirect
  (correct).
- **Sitemap** uses `www` for every URL — no canonical mismatch. Includes 10 tools + 4 guides +
  the `/guides` index.
- **Homepage IS indexed** and ranks #1 for the brand "tool kart".
- `site:tool-kart.com` currently returns only the homepage → **deeper pages likely not yet
  indexed**. Confirm in Search Console → Pages report. This is the most likely reason tool
  keywords show nothing in Google right now.
- 129 tests passing; build clean.

> A keyword being present on a page does **not** earn a ranking — it only makes the page eligible.
> Rankings come from relevance + site authority + competition + time. See `SEO-PLAYBOOK.md`.
> For a new domain, expect little for the first 2–4 months even with everything right.

---

## Immediate / highest-leverage (do these first)

Not "phases" — these are the launch & growth actions that move the needle most. Several are
manual (need your accounts).

- ⬜ Submit `sitemap.xml` in **Google Search Console** (Sitemaps → add `sitemap.xml`), if not done.
- ⬜ In Search Console → **Pages**, check "Indexed" vs "Discovered—currently not indexed".
  **Request indexing** on the top tool pages (image-compressor, emi-calculator, gst-calculator).
- ⬜ Submit to **Bing Webmaster Tools** (free; Bing has a meaningful India share).
- ⬜ **(Later)** Once real traffic builds: apply to AdSense; then set
  `NEXT_PUBLIC_ADS_ENABLED=true` + `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-…` and redeploy.
- ⬜ **(Optional)** Set up GA4; set `NEXT_PUBLIC_GA_ID`.

---

## Phase 0 — SEO quick fixes ✅ DONE

- ✅ Homepage dedicated metadata (absolute title, no duplicated brand) + `ItemList` JSON-LD.
- ✅ Reusable `CopyButton` + copy-to-clipboard on calculator outputs (unit converter, GST, percentage).
- ✅ `STATUS.md` refreshed to match reality.

## Phase 1 — Content hub + topic clusters ✅ DONE

- ✅ `lib/guides.ts` registry (mirrors the tool registry); `ContentPage` shell; `Article`+`FAQPage` JSON-LD.
- ✅ Sitemap/routes integration; `/guides` index grouped by category with `ItemList` JSON-LD.
- ✅ Bidirectional tool↔guide links: `RelatedGuides` on every tool page + tool callout in every guide.
- ✅ 8 guides: how-to-calculate-emi, gst-rates-in-india-explained, sip-vs-lump-sum, compress-image-to-50kb-100kb, old-vs-new-tax-regime, how-to-convert-cgpa-to-percentage, simple-vs-compound-interest, jpg-vs-png-vs-webp.
- ✅ "Guides" link in desktop + mobile nav.
- 🔄 Keep adding ~1 guide per week (see Phase 2/ongoing list).

## Phase 2 — Category hubs + more high-RPM tools 🔄 IN PROGRESS (2a done, 2b pending)

Highest remaining traffic impact. Each tool = one registry entry + one route, same pattern as
existing tools. Each should ship with a companion guide (cluster), like the EMI pair.

### 2a. Category hub pages ✅ DONE
- ✅ 5 hub routes: `/finance-calculators`, `/image-tools`, `/converters`, `/calculators`,
  `/generators`. Registry in `lib/categories.ts`; shared view `components/hub/CategoryHubView.tsx`
  (cards + `ItemList` JSON-LD + breadcrumbs); auto-included in the sitemap via `lib/routes.ts`.
- ✅ Breadcrumbs wired: tool pages now show `Home > <Category hub> > <Tool>` (falls back to the old
  "Tools" crumb if a tool's category has no hub). Hub crumb also appears in BreadcrumbList JSON-LD.
- ✅ Homepage "Browse by category" section links to all 5 hubs (so hubs are not orphaned).
- ✅ `categories.test.ts` guards: unique slugs/categories, **every tool category has a hub**, no
  collision with reserved top-level routes.
- **Why:** mid-tail ranking layer ("finance calculator india") + distributes link equity to child tools.
- ✅ Browser-verified (Edge + Playwright, 25/25 checks): category chip → hub → tool → breadcrumb
  back to hub, tool ↔ guide links, GST maths + copy-to-clipboard, all 5 hubs return 200, mobile
  menu, no horizontal overflow at 375px, 404 for unknown routes, no console errors.
- ✅ Bug found in the browser and fixed: `CopyButton` with a custom `aria-label` hid the "Copied!"
  state from screen readers. Regression test added.
- ✅ **Footer internal links:** new "Explore" column links to Guides + all 5 category hubs on every
  page. Test in `legal-pages.test.tsx`.
- 🔄 Follow-up idea (optional): add a short original intro/FAQ per hub to deepen content (hubs are
  currently card grids + a one-paragraph intro).

### 2b. New high-RPM / high-volume tools ✅ DONE (6 of 6; PDF follow-ups listed below)
- ✅ **Income-tax calculator** (`/tools/income-tax-calculator`): new vs old regime for FY 2026-27,
  standard deduction, 87A rebate with marginal relief, surcharge with marginal relief (25% cap in the
  new regime, 37% in the old), 4% cess, senior/super-senior old-regime slabs, side-by-side table +
  "which saves more" result. Logic `src/lib/income-tax.ts`, 35 tests checked against published
  worked figures. Companion guide `/guides/old-vs-new-tax-regime` (its examples are pinned by a test
  so the article can't drift from the maths). Browser-verified via Playwright MCP, including at 375px.
  - ⚠️ **Yearly maintenance:** tax rules change with each Union Budget (usually 1 Feb). Each year,
    check whether slabs/rebate/standard deduction changed, update the constants at the top of
    `src/lib/income-tax.ts`, the "FY" labels in the tool page, guide and registry entries, and the
    expected values in `income-tax.test.ts`. Budget 2026 made no changes for FY 2026-27.
- ✅ **CGPA-to-percentage calculator** (`/tools/cgpa-to-percentage`, Calculators hub). Formulas,
  each traced to an official document and shown with its source in the UI: CBSE × 9.5 (Circular
  24/2010), VTU 2022 scheme × 10, VTU 2015–2021 (CGPA − 0.75) × 10, GTU (CGPA − 0.5) × 10
  (Notification 1/2012), Anna University × 10. Plus an "Other" custom formula
  ((CGPA − subtract) × multiply) for any other university. Logic `src/lib/cgpa.ts` (13 tests),
  widget test (4). Companion guide `/guides/how-to-convert-cgpa-to-percentage` (its 8.2 comparison
  is pinned by a test). Browser-verified via Playwright MCP incl. copy-to-clipboard and 375px.
  - **Deliberately not included:** Mumbai University, SPPU, AKTU, KTU — I only found their
    formulas on unofficial sites. Add one only after finding the university's own regulation or
    notification, and add a test with its published example. (Anna University's PDF host had an
    SSL certificate error during research; the formula came from the search snippet of that
    official PDF — worth re-checking the PDF in a browser.)
- ✅ **Simple & compound interest calculator** (`/tools/interest-calculator`, Finance hub). Side-by-side
  SI vs CI, yearly / half-yearly / quarterly / monthly compounding, years + months tenure (up to 50
  years), "compounding earns ₹X more" line, and a year-by-year balance table (scrolls inside its
  box; keyboard-focusable). Logic `src/lib/interest.ts` (23 tests, textbook values), widget test (4).
  Companion guide `/guides/simple-vs-compound-interest` — its ₹1L at 7% figures (5 and 20 years),
  effective quarterly yield and rule of 72 are pinned by tests. Browser-verified via Playwright MCP.
- ✅ **Compress image to KB** (`/tools/compress-image-to-kb`, Image Tools hub — new route, own the
  long-tail query). Presets 20/50/100/200/500 KB + custom (5–5000 KB) + optional max width; output
  always JPG. Search (`searchTargetSize` in `src/lib/image-compression.ts`): highest JPG quality that
  fits, shrinking dimensions only if quality 40% is still too big, never upscaling, never below 64 px.
  Targets use 1 KB = 1,000 bytes (fits portals using either 1,000 or 1,024). Size shown rounded
  DOWN ("49.3 KB", never "50 KB" for a file under 50 KB). 10 search tests with a fake encoder + 6
  widget tests.
  - Real-browser results (Playwright MCP, generated 4000×3000 noisy 6.5 MB photo): 50 KB → 49,517 B
    (766×574), 20 KB → 19,749 B in 0.56 s, 5 KB → 4,888 B, 600 px cap respected, transparent PNG
    signature → white background. Valid JPEGs, aspect ratio kept, no console errors, fine at 375px.
  - Paired with the existing guide `/guides/compress-image-to-50kb-100kb` (its `relatedToolSlug`
    now points here; steps + FAQ rewritten to use the tool, manual method kept) instead of writing a
    near-duplicate guide that would compete with it. Image compressor keeps a link to this tool and
    no longer targets "compress image to 100kb". Also fixed a wrong claim in the compressor FAQ
    (it said the size "updates live"; it only updates when you press Compress).
- ✅ **Image format converter** (`/tools/image-format-converter`): converts JPG, PNG and WebP
  without changing dimensions, using the existing browser canvas encoder. HEIC/HEIF inputs are
  explicitly rejected. Fixes after review:
  - Lossy quality is `CONVERT_QUALITY = 0.92` (was 1.0). In Edge, 1.0 made photo→JPG/WebP 2–3×
    larger and screenshot→JPG larger than the input. Now: photo 6.3 MB → ~1.08 MB (JPG/WebP),
    screenshot PNG 263 KB → 184 KB JPG / 114 KB WebP, transparent PNG 10 KB → 7 KB JPG.
  - Shows the size change: "% smaller", "about the same size" (within 1%), or "larger than the
    original" with a pointer to WebP / the compressor.
  - Default output never equals the input format (`defaultConversionTarget`: JPG → PNG, else JPG);
    the input's own format is labelled "(same as original)".
  - Format detection (`detectImageFormat`) accepts non-standard MIME types (`image/jpg`,
    `image/pjpeg`, `image/x-png`) and uses the extension (incl. `.jfif`) when the MIME type is empty
    or `application/octet-stream`.
  - Stale-result guard (run ID) so a slow conversion can't appear under a newly chosen file. Same
    guard added to compress-to-KB. A test for each; the converter's race test fails if the guard is
    removed (checked).
  - Back-links from the image compressor and compress-to-KB pages.
  - Companion guide `/guides/jpg-vs-png-vs-webp` (when each format suits, when converting makes a
    file bigger, which to pick for forms/websites). Qualitative only — no size figures to drift.
  - Browser-verified via Playwright MCP: all 9 format pairs, HEIC rejection, `image/jpg` and
    `.jfif` inputs, race with a 4000×3000 image, guide links, 375px, no console errors.
- ✅ **PDF tools** (`/tools/pdf-tools`, new **Document Tools** hub at `/document-tools`): merge,
  split (one PDF per page) and **optimize** (renamed from "compress", which it never really did).
  `pdf-lib`, browser-only, loaded on demand: first-load JS 112 kB (was 285 kB; the 412 kB chunk
  loads only when the button is pressed). Fixes after review:
  - Optimize re-saves the original document (not a page copy), so form fields + values, title and
    bookmarks survive. Shows before/after size, and says plainly when a PDF (e.g. a scan) can't be
    made smaller. Real results: Edge-printed text PDF 185 KB → 60 KB; 9 MB scan unchanged.
  - Merge/split warn when an input has fillable form fields (pdf-lib can't copy them across) or a
    digital signature (any rewrite invalidates it). No more silent loss.
  - User-facing errors for password-protected PDFs, non-PDFs and damaged files. Note: pdf-lib's
    `EncryptedPDFError` fails `instanceof` (ES5-compiled classes), so detection uses
    `ignoreEncryption: true` + `doc.isEncrypted`. Unknown errors show a generic message, never raw text.
  - Strict page-range parser validated against the page count before expanding (a billion-page
    typo now fails in ~60 ms instead of freezing the tab); rejects `1.5`, `1-3-5`, `-3`, `0`;
    empty input asks for pages; `all` is explicit.
  - File input reset (same file can be picked again after switching mode), stale-result guard
    (run ID; test fails if the guard is removed), `aria-pressed` on mode buttons, numbered merge order.
  - 27 real-PDF library tests (PDFs built with pdf-lib, incl. form, signed and encrypted fixtures)
    + 9 component tests. Browser-verified via Playwright MCP with Edge-printed PDFs.
  - **Still open:** separate `/tools/merge-pdf`, `/tools/split-pdf` pages (one per big search
    query); merge reordering and adding files from several folders; a "pages 1-3 as one PDF"
    split option; drag and drop; a companion guide; real image recompression for scans.
- **Why:** more tools = more keyword clusters; finance tools raise ad RPM (revenue per visit).

## Phase 3 — Engagement & polish ⬜ NOT STARTED

Improves dwell time / pageviews-per-visit / shareability — indirect ranking signal + ad revenue.

- ⬜ **Charts on finance tools** (EMI principal-vs-interest bar; SIP growth curve). Tiny client chart
  lib or hand-rolled SVG (keep bundle small).
- ⬜ **Shareable URL state** for calculators (EMI/SIP/GST read & write `?amount=&rate=&years=`) so a
  user can link/share a specific result → backlinks + re-visits.
- ⬜ **FAQ accordions** (collapsible) to cut long-page height on mobile.
- ⬜ **SVG icon set** replacing emoji (consistency + accessibility across devices).
- ⬜ **Dark-mode toggle** (currently auto-follows OS via Tailwind v4 `prefers-color-scheme`; add a
  manual toggle with `localStorage`).
- ⬜ **Per-guide OG images** (tools have them; guides fall back to the default `opengraph-image.tsx`).

## Phase 4 — Regional language reach ⬜ NOT STARTED

Biggest untapped moat — most tool sites ignore Indian languages.

- ⬜ Hindi versions of the top 3–5 pages (homepage + highest-traffic tools).
- ⬜ `hreflang` tags (`en` + `hi`) in layout metadata.
- ⬜ Decide routing: `/hi/tools/<slug>` (path-based is better for SEO than `?lang=hi`).
- **Why:** India's next-billion users search in Hindi; low competition.

## Ongoing — the actual traffic engine (from `SEO-PLAYBOOK.md`)

- 🔄 Weekly: in Search Console Performance, find queries ranking in positions 11–30; improve those pages.
- 🔄 Weekly: ship ~1 new or improved tool/guide page.
- 🔄 Earn backlinks (Quora, niche forums, small blogs) — quality over quantity. Do NOT buy links.
- 🔄 Keep pages fast (Core Web Vitals) and ads non-intrusive (protects ranking + AdSense).

---

## Patterns (so you never need to ask "how")

- **Add a tool:** add a descriptor to `src/lib/tools.ts`; write pure logic in `src/lib/<name>.ts`
  with a `<name>.test.ts`; create `src/app/tools/<slug>/page.tsx` mirroring `emi-calculator/page.tsx`
  (`buildMetadata` + `ToolJsonLd` + `ToolPage` + a `"use client"` widget). Sitemap/nav auto-update.
- **Add a guide:** add a descriptor to `src/lib/guides.ts`; create `src/app/guides/<slug>/page.tsx`
  mirroring `how-to-calculate-emi/page.tsx` (`buildMetadata` + `ArticleJsonLd` + `ContentPage`).
  Set `relatedToolSlug` for the bidirectional link; sitemap auto-updates.
- **Add a category hub:** add a descriptor to `CATEGORY_HUBS` in `src/lib/categories.ts` (and the
  new category to the `ToolCategory` union in `lib/tools.ts` if it's brand new); create
  `src/app/<slug>/page.tsx` mirroring `finance-calculators/page.tsx` (`buildMetadata` +
  `<CategoryHubView hub={hub} />`). Sitemap, homepage chips and tool breadcrumbs auto-update.
  `categories.test.ts` fails if a tool's category has no hub.
- **If `npm run build` fails with "Unexpected end of JSON input"** after a killed/interrupted
  build: it's a corrupted `.next` cache, not a code error. Delete the `.next` folder (gitignored,
  regenerable) and rebuild.
- **Verify a change:** `npm run build` → `npm test` → for SEO/links, read the built HTML in
  `.next/server/app/<route>.html` and grep for `@type":"Article"` / `href="/guides/…"` etc.

## State snapshot

- Tests: **287 passing** (39 files). Production build clean. All tools browser-verified with the
  Playwright MCP.
- Tools: **16**. Guides: **8**. Category hubs: **6**. Sitemap URLs: **36** (6 static + 16 tools +
  8 guides + 6 hubs; confirmed in the built sitemap) once deployed — the live sitemap has 27.
- `SITE.url` fallback is now `https://www.tool-kart.com` (matches the live canonical). Keep
  `NEXT_PUBLIC_SITE_URL` set to the www host in Vercel anyway.
- Site live at `https://www.tool-kart.com`. Homepage indexed; deeper pages pending indexing.
  Deployed through the income-tax calculator (live sitemap = 27 URLs, resubmitted). **Not yet
  deployed:** CGPA calculator + guide, interest calculator + guide, compress-image-to-KB tool (+
  updated image guide and compressor page), image format converter + `jpg-vs-png-vs-webp`
  guide, PDF tools and the `/document-tools` hub. After deploying, resubmit the sitemap (→ 36) and request indexing for
  `/tools/cgpa-to-percentage`, `/tools/interest-calculator`, `/tools/compress-image-to-kb`,
  `/tools/image-format-converter`, and `/tools/pdf-tools` (plus re-request
  `/guides/compress-image-to-50kb-100kb`, which changed).

## Browser verification (Playwright MCP)

Config: `.kiro/settings/mcp.json` (`@playwright/mcp@0.0.85`). Workflow: `npm run build` →
`npx next start -p 3100` → drive `http://localhost:3100` with the MCP (navigate, click, fill,
snapshot, `browser_resize` 375×800 for mobile, `browser_console_messages` for errors) → stop the
server. Snapshots land in `/.playwright-mcp/` (gitignored) — delete when done.
**Run MCP browser steps one at a time, not in a parallel batch** — batched navigate/click/evaluate
calls race each other and report results from the wrong page.
