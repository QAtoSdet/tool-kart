# Roadmap & honest expectations

## Read this first — the honest money picture

- **Cash cost:** ~₹1,000/year (a domain). Everything else runs on free tiers. There is no
  per-user cost, so costs do not rise as traffic grows.
- **Your real cost:** time — about 5–15 hrs/week, mostly on the ongoing content work below.
- **Earnings are ₹0** until AdSense is approved *and* traffic builds. That takes months.
- **Realistic first milestone:** ₹5,000–10,000/month, which needs roughly **50,000–1,00,000
  pageviews/month**. Expect to reach it around the **6–12 month** mark, and only if you keep
  publishing tool pages that rank.
- **The build (Tasks 1–10) is a few weeks. The ongoing SEO/content work (Task 11) is the real
  job and the real source of revenue.** If you build the site and stop, traffic and income
  stay near zero regardless of how good the tools are.
- Finance/money tools (EMI, GST, SIP, income tax) earn a higher RPM, so adding more of them
  lowers the traffic needed to hit the milestone.

Rough earnings reference (at ₹100 RPM, i.e. ₹100 per 1,000 pageviews):

| Monthly pageviews | Approx. monthly ad income |
| --- | --- |
| 50,000 | ~₹5,000 |
| 1,00,000 | ~₹10,000 |
| 3,00,000 | ~₹30,000 |

These are plausible ranges, not guarantees. SEO outcomes vary widely.

## UX improvements (post-MVP pass)

- [x] **Mobile navigation** — accessible hamburger menu listing all tools + key pages (the old
  header hid the nav on mobile, a real gap for mobile-heavy traffic).
- [x] **Cross-tool discovery** — a "Try another free tool" strip at the end of every tool page
  (excludes the current tool). Drives pageviews-per-visit (ad revenue) and internal links (SEO).
- [x] **Privacy-led hero** — homepage now leads with the privacy differentiator + trust chips.
- [x] **Elevated tool panel** — the interactive tool sits in a clear focal card.

## SEO optimization pass (technical)

- [x] **Favicon + PWA manifest + theme colour** (`icon.svg`, `manifest.webmanifest`).
- [x] **Auto-generated social share images** — default OG image + a per-tool OG image (edge
  `ImageResponse`), so shared links show a branded card.
- [x] **Breadcrumbs + BreadcrumbList JSON-LD** on every tool page.
- [x] **Deeper, India-relevant content** on tool pages (e.g. exam/job-form photo-size use case,
  home/car/personal loan context, sq ft / land-area conversions) + more FAQs.
- [x] **Honest SEO playbook** written → `docs/SEO-PLAYBOOK.md` (off-page steps, realistic
  timeline, what not to do). **Note:** no one can guarantee #1; the site is now technically
  strong, but rankings depend on content + backlinks + time, which are the user's ongoing work.

## Build tasks

- [x] **Task 1 — Project scaffold and shared layout.** Next.js + TS + Tailwind, test
  framework (Vitest + RTL), responsive header/footer/container, design-system primitives
  (Button/Input/Card/Container), tool registry, homepage listing tools as cards.
- [x] **Task 2 — ToolPage shell + SEO metadata system.** Reusable tool-page wrapper (title,
  description, tool area, explainer/FAQ, reserved ad slots) + per-route metadata helper +
  JSON-LD (WebApplication/FAQPage). Includes the **"Private by design" badge** on every tool
  page. All four tool routes created with real metadata/explainer/FAQ (widgets land in Tasks
  3–6).
- [x] **Task 3 — Tool 1: Image Compressor / Resizer** (client-side, Canvas API). Drag-drop /
  file picker, format (JPG/WebP/PNG), quality slider, max-width resize, before/after preview,
  reduction %, download. Pure dimension/size logic unit-tested; UI flow tested with a mocked
  encoder. Real Canvas encoding runs only in a browser — verify manually with `npm run dev`.
- [x] **Task 4 — Tool 2: QR Code Generator** (client-side, `qrcode` lib). Live preview from
  text/URL, size + error-correction + fg/bg colour options, PNG and SVG download. Pure
  option/validation logic unit-tested; UI flow tested with a mocked encoder.
- [x] **Task 5 — Tool 3: Age / Date Calculator.** Exact age (years/months/days), total
  days/months, days-to-next-birthday, born-on weekday, plus a days-between-two-dates tool.
  Timezone-safe "count-up" date math (leap years, month boundaries, Feb-29 convention
  documented), 15 unit tests + 3 UI tests.
- [x] **Task 6 — Tool 4: EMI Calculator + Unit Converter.** EMI: reducing-balance formula
  (zero-interest edge case handled), monthly EMI / total interest / total payable, yearly
  amortization table, INR formatting. Unit converter: config-driven length/weight/area
  (linear) + temperature (non-linear), two-way + swap. 17 logic unit tests + 6 UI tests. All
  four MVP tools are now live.
- [x] **Task 7 — Legal/info pages** (Privacy, Terms, About, Contact) for AdSense + trust.
  Original content; Privacy Policy accurately states client-side processing and discloses
  AdSense cookies + analytics (matches the privacy badge, no overclaiming). All linked from the
  footer. 5 tests (page renders + footer link-check). **Action needed before launch:** set a
  real contact email in `src/lib/site.ts` (currently a placeholder).
- [x] **Task 8 — SEO infrastructure.** `sitemap.xml` + `robots.txt` generated from the central
  route list (new tools auto-included); per-tool WebApplication + FAQPage JSON-LD (Task 2) plus
  site-wide WebSite + Organization JSON-LD in the root layout. All routes statically prerendered
  and code-split per tool (good for Core Web Vitals). 8 tests (sitemap coverage + JSON-LD
  validity). **Note:** a full Lighthouse audit needs a browser run — do it on the deployed URL
  (Task 10); the architecture is built for strong scores but the number isn't machine-verified
  here.
- [x] **Task 9 — AdSlot component (switch-ready) + analytics.** `AdSlot` renders a dev
  placeholder, nothing in production pre-approval, and real AdSense `<ins>` markup once
  `NEXT_PUBLIC_ADS_ENABLED=true` + `NEXT_PUBLIC_ADSENSE_CLIENT` are set — no per-page edits.
  AdSense library loads only when ads are active; Google Analytics loads only in production
  with a GA ID. Config centralized in `lib/ads.ts`; env vars documented in `.env.example`. 6
  tests. Verified live: with ads off, the page injects no AdSense/GA/`<ins>` markup.
- [~] **Task 10 — Deploy to Vercel, connect domain, Search Console, AdSense readiness.**
  Build-verified and production-ready: all 12 routes return 200 on `npm run start`, 93 tests
  pass, `.env*` is gitignored. Full step-by-step in `docs/DEPLOYMENT.md`. **Remaining steps are
  manual (need your accounts):** push to GitHub, deploy on Vercel, connect domain, submit
  sitemap to Search Console, apply to AdSense after traffic builds. One required edit first: set
  a real contact email in `src/lib/site.ts`.
- [~] **Task 11 — Ongoing growth engine (started).** Added 5 high-value tools, taking the site
  from 5 → **10 tools**: GST Calculator, SIP Calculator, Percentage Calculator, Word & Character
  Counter, Password Generator (all client-side, each with explainer + FAQ + OG image, 24 new
  logic unit tests). Sitemap auto-updated to 10 tools. **Still ongoing:** keep adding ~one tool
  per week (PDF tools, image format converter, income-tax / CGPA calculators) and refine content
  using Search Console data after launch.

## After launch — the weekly habit that actually earns money

1. Check Google Search Console for queries where you rank on page 2–3 (positions 11–30).
2. Improve or add a tool/content page targeting those queries.
3. Ship one new or improved tool page per week.
4. Keep pages fast (good Core Web Vitals) and ads non-intrusive (protects ranking + AdSense).
5. Repeat for months. Compounding traffic is what gets you to the milestone.
