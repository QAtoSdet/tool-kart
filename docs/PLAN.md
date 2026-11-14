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

## Verified state (as of 2026-11-09; Search Console figures updated 2026-11-14)

- **Live site:** `https://www.tool-kart.com`. The `www` host is canonical — keep
  `NEXT_PUBLIC_SITE_URL=https://www.tool-kart.com` in Vercel. Non-www → www is a 308 redirect
  (correct).
- **Sitemap** uses `www` for every URL — no canonical mismatch. Includes 10 tools + 4 guides +
  the `/guides` index.
- **Homepage IS indexed** and ranks #1 for the brand "tool kart".
- **Search Console (2026-11-14):** 13 pages indexed, 5 not indexed, 6 web-search clicks so far.
  The live sitemap has 36 URLs, so most pages are still waiting to be indexed. That's normal for a
  new domain. Indexing for the 10 newest pages was requested the same day (see below).
- 129 tests passing; build clean.

> A keyword being present on a page does **not** earn a ranking — it only makes the page eligible.
> Rankings come from relevance + site authority + competition + time. See `SEO-PLAYBOOK.md`.
> For a new domain, expect little for the first 2–4 months even with everything right.

---

## Traffic diagnosis (2026-11-14) — read this before choosing the next item

Search Console, last 28 days: **245 impressions, 6 clicks, average position 68.7** (page 7).
Impressions only began around 23 Oct, so the site has been visible to Google for ~3 weeks.

- **83% of impressions (203 of 245) are the SIP calculator**, for searches like "mf calculator",
  "sip calculator 40 years", "growing sip calculator", at positions 66–99. Page 1 for these is
  entirely Groww, HDFC, Bajaj, Angel One, 5paisa and other banks/brokers. Finance is a topic where
  Google strongly prefers trusted brands, so a 3-week-old site can't compete there. The plan's
  "prefer high-RPM finance tools" advice is right for revenue per visit but wrong for getting the
  first visitors.
- **Winnable searches look different.** "calculate percentage" already ranks at position 7.
  The image compressor got 2 clicks from 5 impressions. Page 1 for "SSC CGL photo signature
  resizer" is all small sites, each with **one page per exam**.
- Not a technical problem: sitemap read (36 URLs), 13 pages indexed, no errors. Of the 3 "crawled –
  not indexed", 2 are a preview image and the favicon (fine).

**Revised priority order (overrides the order below):**
**Decision (2026-11-14):** distribution (Quora/Reddit/Telegram) isn't possible for the owner, so
growth depends on publishing many specific pages that each answer one narrow search. Order:
exam batch 2 → Hindi versions of existing tools → signature cleaner inside the exam pages.
Researched and **rejected** as new tools (page 1 already full of dedicated sites or big brands):
labour-code salary/gratuity, 8th Pay Commission, state electricity bills, stamp duty, name-and-date
on photo, state-wise land units (also unsafe: sources disagree, e.g. Bihar bigha quoted as 27,000 /
27,220 / 27,225 sq ft). Don't revisit these without new evidence.

1. 🔄 **Exam-specific photo/signature pages** — first batch ✅ built and deployed 2026-11-14:
   `/exams` hub + `/exams/ssc-cgl-photo-signature-size`, `/exams/upsc-photo-signature-size`,
   `/exams/ibps-sbi-photo-signature-size`, `/exams/neet-ug-photo-signature-size`.
   - Data in `src/lib/exams.ts`, one entry per exam with sources + `lastChecked`. **Every figure
     was read from the official document itself** (SSC CGL 2026 notice of 21 May 2026; UPSC
     upload instructions on upsconline.nic.in; IBPS Clerk CSA-XVI and SBI Junior Associates 2026
     annexures on ibpsreg.ibps.in; NTA NEET (UG) 2026 bulletin). `exams.test.ts` pins each figure.
   - Corrections vs popular sites: UPSC photo 20–200 KB (not 300) + **triple** signature 20–100 KB;
     NEET signature 10–100 KB (not 4–30) and no postcard upload in 2026; SSC signature 10–20 KB
     (not 12). Notice inconsistencies are shown, not hidden (SSC 6×2 vs 4×2 cm; NEET impressions
     10–200 vs 50–300 KB → preset 50–200 satisfies both).
   - Compress-to-KB now supports a **minimum** (`minKb`, measured as 1 KB = 1,024 B so it's safe
     either way): raises quality to 100% when needed, and warns instead of claiming success if
     the image is still too small. Real browser: normal signature → 18.8 KB (10–20 ✓); a 140×60
     signature only reaches 2.7 KB even at 100%, so the page tells users to keep scans larger.
   - Linked from footer, compress-to-KB tool and the image guide. Sitemap → 41 URLs.
   - ✅ **Batch 2 — built 2026-11-14, ⬜ not yet deployed:**
     `/exams/ssc-chsl-photo-signature-size`, `/exams/rrb-ntpc-photo-signature-size`,
     `/exams/jee-main-photo-signature-size`, `/exams/ctet-photo-signature-size`. Sitemap → 45 URLs.
     - Sources: SSC CHSL 2026 notice (7 Sep 2026, ssc.gov.in); RRB CEN 06/2026 + 07/2026 NTPC
       (also checked 08/2026 Station Master, 09/2026 Isolated) on rrb.indianrailways.gov.in; NTA
       JEE (Main) 2027 bulletin (24 Oct 2026) + notices; CBSE CTET Sept 2026 bulletin.
     - Findings: RRB 2026 = live photo + signature **30–49 KB** JPG, min 140×60 px (old sites say
       photo 20–50 / signature 10–20). All SSC 2026 notices (CGL, CHSL, JE, CPO, Steno) = live
       photo + 10–20 KB signature, and CHSL repeats CGL's 6×2 vs 4×2 cm wording. JEE = NEET's
       limits (photo 10–200, signature 10–100) + Class 10 PDF 50–300 KB. CTET = photo 10–100,
       signature 3–30 KB, no live photo.
     - Real browser: a clean 800×400 signature → 40.6 KB (RRB 30–49 ✓); a 413×236 one reaches only
       19 KB at 100% and the page warns. RRB page says so (~800 px wide needed on pure white).
     - RRB's site blocks direct downloads (WAF): open the homepage in a browser first, then fetch
       `/-/image/<file>/examsDocuments` from that page.
   - ⬜ **Batch 3** (verify each from its official notice first): state PSCs (UPPSC, BPSC, MPSC),
     SSC MTS 2026 and SSC GD (notices not out on 2026-11-14), CUET UG 2027 (bulletin not out).
     Skip passport: the photo is taken at the Passport Seva Kendra, not uploaded. Any exam whose
     official document can't be read is left out rather than filled from coaching sites.
   - ⬜ **Each new exam cycle:** re-check the notice, update figures, sources and `lastChecked`
     (NEET 2027 bulletin expected ~Feb 2027).
2. 🔄 **Hindi versions of existing tools** — ✅ built 2026-11-14 (⬜ not yet deployed):
   `/hi/tools/percentage-calculator`, `/hi/tools/age-calculator`. Sitemap → 47 URLs.
   - Age page: worked "borrow" example (15-08-2001 → 01-01-2027 = 25 साल 4 महीने 17 दिन, pinned
     in tests), exam cut-off-date advice + link to /exams, Hindi weekdays, Feb 29 rule.
   - How it works: `src/lib/hindi.ts` registry → hreflang (`en`, `hi`, `x-default`) in both pages'
     `<head>` (via `buildMetadata`) and in the sitemap; `HindiToolPage` shell (`lang="hi"` on the
     article, Hindi breadcrumbs/privacy/FAQ/share text); widgets take a `labels` prop.
   - Adding the next one: add a `HINDI_PAGES` entry, give the widget a `labels` prop, create
     `src/app/hi/tools/<slug>/page.tsx`. Header/footer stay English (single root layout).
   - ⬜ Have a native Hindi speaker read the page text.
   - Next: compress-to-KB, EMI, GST. Original note — start with percentage (English page already ranks #7
   for "calculate percentage"), then age, compress-to-KB, EMI, GST. Evidence: page 1 for
   "प्रतिशत कैसे निकाले कैलकुलेटर" is all small sites (calculatorlib, ck12, infohotspot), no brands.
   Same calculators, Hindi text; path-based URLs (`/hi/tools/<slug>`) with `hreflang`
   (this is Phase 4, pulled forward). Have a native Hindi speaker read the text before publishing.
3. ⬜ **Signature cleaner, built into the exam pages** (not a separate tool): whiten the
   background and darken the ink of a phone photo of a signature, then fit the KB range. Solves
   a real gap — phone photos often can't reach IBPS's 10 KB minimum and most tools fail silently.
4. ⏸ **Distribution** (Quora / Reddit / exam Telegram & WhatsApp groups) — not possible for the
   owner right now. Expect slower growth without it; revisit if that changes.
5. ⬜ **SIP page: add what searchers asked for** — step-up ("growing") SIP, lumpsum, and a target
   amount ("reverse") mode. Long-tail only; don't expect page 1 for "sip calculator".
6. Phase 3 polish (shareable links, accordions, icons…) **paused**: it improves the experience of
   visitors who arrive, but doesn't bring new ones. Resume once traffic exists.
7. ⬜ Re-check Search Console around 2026-11-21 and 2026-12-14 (compare impressions, position,
   and which queries appear).

## Immediate / highest-leverage (do these first)

Not "phases" — these are the launch & growth actions that move the needle most. Several are
manual (need your accounts).

- ✅ `sitemap.xml` submitted in **Google Search Console**. On 2026-11-14 Google read it the same
  day: status Success, 36 discovered pages.
- ✅ **Indexing requested (2026-11-14)** via URL Inspection for all 10 new/changed pages:
  `/tools/compress-image-to-kb`, `/tools/pdf-tools`, `/tools/cgpa-to-percentage`,
  `/tools/interest-calculator`, `/tools/image-format-converter`,
  `/guides/compress-image-to-50kb-100kb`, `/guides/how-to-convert-cgpa-to-percentage`,
  `/guides/simple-vs-compound-interest`, `/guides/jpg-vs-png-vs-webp`, `/document-tools`.
  All "Indexing requested"; no quota error. Before the request, all were "URL is not on Google"
  except `/tools/interest-calculator`, which was already indexed.
  - ⬜ **Check again around 2026-11-21:** Search Console → Pages. Expect these to move to
    Indexed over days to a few weeks. Don't re-request; it doesn't change queue position.
  - Tip for next time: inspect first and only request pages showing "URL is not on Google", or
    pages whose content changed. Requests on already-indexed, unchanged pages waste the ~10/day quota.
- ✅ **Bing Webmaster Tools** — site imported from Google Search Console (no verification needed).
  - 2026-11-14: Bing's copy of the sitemap was stale (last read 24 Oct, 15 URLs), so it was
    resubmitted; status "Processing". Check it shows ~36 URLs in a few days.
  - 2026-11-14: 23 URLs pushed via Bing's URL Submission (quota is 100/day, far more generous than
    Google's ~10): homepage, `/guides`, the 6 new tools + image compressor, all 8 guides, all 6
    hubs. The 10 original tools were already submitted on 25 Oct.
  - Next time a page is added: submit it in Bing URL Submission too (or automate with IndexNow).
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

## Phase 3 — Engagement & polish 🔄 IN PROGRESS (1 of 6 done)

Improves dwell time / pageviews-per-visit / shareability — indirect ranking signal + ad revenue.

- ✅ **Charts on finance tools** — hand-drawn, no chart library (each page grew ~1.5 kB, to 111 kB).
  - EMI: "Where your money goes" card with a principal/interest split bar (amounts + % in text,
    not colour alone) and yearly stacked columns showing the interest share fall.
  - SIP: "Growth over time" line/area chart, total value vs amount invested. Built from a new
    `sipYearlySchedule()` in `lib/sip.ts` that reuses `calculateSip`, so the chart always ends
    at the headline number.
  - Components in `src/components/charts/` (`SplitBar`, `StackedColumns`, `GrowthChart`); helpers
    in `src/lib/chart.ts` (`niceCeil` axis rounding, `labelIndices`, `compactINR` ₹K/L/Cr labels).
    Axis text is HTML, not SVG, so it stays readable on phones. Each chart is one labelled image
    for screen readers, with a plain-language summary (e.g. "In year 1, 92% of what you pay goes
    to interest; by the final year it is 4%").
  - Browser-checked (Playwright MCP) at 1280px and 375px, light and dark mode, 10- and 30-year
    loans. That check caught three problems, all fixed with tests: a cramped "Y9 Y10" label pair,
    the last label clipped on phones, and axes rounding too high (₹20L for an ₹11.6L curve).
  - Possible follow-ups: same charts for the interest and income-tax calculators.
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

- Tests: **345 passing** (43 files). Production build clean. All tools browser-verified with the
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
