# SEO & AdSense guide

## Part 1 — Google AdSense

### Approval prerequisites (do these before applying)
AdSense reviewers check that a site is real, useful, and has original content. Before you
apply, make sure the site has:

- **Original, functional tools** with real explainer/FAQ content on each tool page (not thin
  pages). Several working tools is far better than one.
- **Required policy pages, linked in the footer:** Privacy Policy, Terms, About, Contact. The
  privacy policy must mention cookies and third-party ads (AdSense uses cookies).
- **Clear navigation** so a reviewer (and a user) can move around easily.
- **Good performance and mobile usability** (fast load, no layout shift, works on phones).
- **Some organic traffic.** Apply once pages are indexed and getting a trickle of visitors,
  not on day one.

### Payment facts
- AdSense pays out once your balance reaches the **$100 threshold** (roughly **₹8,500**), via
  bank transfer. Below that, earnings roll over month to month.
- The RPM you see is already your share; Google takes its cut before reporting.

### Turning ads on in this project
1. Get approved and obtain your publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`).
2. Set in the environment:
   - `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX`
   - `NEXT_PUBLIC_ADS_ENABLED=true`
3. Redeploy. The `AdSlot` component starts rendering ads in its reserved positions. No
   per-page code changes are needed.

### Keep ads compliant
- Non-intrusive placements only. Don't push content below the fold with ads, don't encourage
  clicks, don't place ads on empty/error pages.
- Keep the layout stable (reserve ad space) to protect Core Web Vitals and avoid layout shift.

## Part 2 — SEO approach

### The core idea
**One tool = one landing page = one cluster of search queries.** Each page targets a specific
long-tail intent, ideally India-specific, e.g.:

- "compress image to 100kb online"
- "qr code generator free online"
- "age calculator by date of birth"
- "emi calculator for home loan india"
- "sq ft to sq meter converter"

### On-page checklist for every tool page
- A descriptive `<title>` and meta description containing the main query.
- One clear `<h1>` matching the intent.
- The working tool near the top (users should not scroll to use it).
- An explainer section: what it does, how to use it, common questions (FAQ). This is what
  gives the page enough original content to rank and to pass AdSense review.
- `FAQPage` + `WebApplication` JSON-LD structured data.
- A canonical URL.
- Internal links to related tools.

### Site-wide SEO
- `sitemap.xml` and `robots.txt` generated from the tool registry (new tools included
  automatically).
- Fast pages (code-split per tool, small bundles, client-side processing).
- Submit the sitemap to Google Search Console and request indexing after deploy.

### Prioritizing which tools to build next
Favor tools that balance **high search volume** with **high RPM** and **low build effort**.
Finance/money tools (EMI, GST, SIP, income tax) have higher RPM, so they move revenue per
visit the most. Use Search Console's query report to find pages ranking on page 2–3 and
improve them first — that is the fastest traffic win.
