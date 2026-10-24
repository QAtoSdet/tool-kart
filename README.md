# Utility Tools Hub (India)

A fast, privacy-friendly collection of free online utility tools (image compressor, QR
generator, age/date calculator, EMI calculator, unit converter, and more). Each tool is its
own SEO landing page. The site is monetized with ads (Google AdSense) once it has content and
organic traffic.

## Business model (in one paragraph)

This is a **free tool, organic SEO traffic, ad-monetized** project (no paid ads, no direct
selling). Visitors arrive from Google search for a specific tool, use it, and see
non-intrusive ads. Processing happens **client-side (in the browser)** wherever possible, so
there is no server/storage cost and user files never leave their device — both a cost win and
a privacy selling point.

See [`docs/ROADMAP.md`](docs/ROADMAP.md) for the honest earnings and timeline expectations
before you invest time. Short version: expect ₹0 for the first few months, and ~₹5,000–10,000/
month is realistic around the 6–12 month mark **only if the content habit is maintained**.

## Tech stack

> Versions are pinned intentionally. We use **Next.js 15.5.x with React 19.0.0** (the
> production-proven combination). The newer Next 16.4 / React 19.3 line caused a client-side
> hydration crash (`enqueueModel is not a function`) that broke interactive tools, so do not
> upgrade to Next 16 until that line is stable.

- **Next.js (App Router)** + **TypeScript** — React framework with great SEO/static rendering.
- **Tailwind CSS** — styling.
- **Vitest + React Testing Library** — unit and component tests.
- **Vercel (free tier)** — hosting.
- **Google AdSense** — monetization (enabled after approval, via an env flag).
- **Google Analytics / Plausible (free)** — traffic measurement.

## Project structure

```
src/
  app/
    layout.tsx            Root layout (fonts, global shell)
    page.tsx              Homepage (lists all tools)
    tools/
      <tool-slug>/page.tsx  One route per tool (each is an SEO landing page)
    privacy|terms|about|contact/page.tsx  Legal/info pages (AdSense prerequisites)
  components/
    layout/               Header, Footer, Container, SiteShell
    ui/                   Button, Input, Card and other primitives (design system)
    ads/                  AdSlot (env-flag controlled)
    seo/                  Metadata + JSON-LD helpers
    tools/                ToolPage shell + per-tool UI components
  lib/
    tools.ts              Central registry of tools (used by homepage, nav, sitemap)
    <tool logic>.ts       Pure, testable functions (compression, EMI math, date math, ...)
docs/                     Reference documentation (architecture, roadmap, SEO/AdSense)
```

## Running locally

```bash
npm install          # install dependencies
npm run dev          # start the dev server at http://localhost:3000
npm run build        # production build
npm run start        # run the production build locally
npm test             # run the test suite once
npm run test:watch   # run tests in watch mode
npm run lint         # lint
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in values as they become available.

| Variable | Purpose | When to set |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL (used for SEO/sitemap) | Before deploy |
| `NEXT_PUBLIC_ADS_ENABLED` | `true` turns on AdSense slots | After AdSense approval |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense publisher ID (`ca-pub-...`) | After AdSense approval |
| `NEXT_PUBLIC_GA_ID` | Google Analytics measurement ID | When analytics is set up |

## Deploying

1. Push the repo to GitHub.
2. Import the project into Vercel (free tier). Framework preset: Next.js.
3. Set the environment variables above in the Vercel dashboard (keep `NEXT_PUBLIC_ADS_ENABLED`
   as `false` until AdSense is approved).
4. Connect a custom domain and verify HTTPS.
5. Submit the sitemap (`/sitemap.xml`) to Google Search Console and request indexing.
6. Apply to AdSense only once there is real content and some organic traffic.

See [`docs/SEO-ADSENSE.md`](docs/SEO-ADSENSE.md) for the full checklist.
