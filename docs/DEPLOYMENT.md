# Deployment & launch guide

This app is build-verified and production-ready. The steps below are the ones only you can do
(they need your accounts). Follow them in order to go live.

## 0. Before you start — one required edit
Set a real contact email in `src/lib/site.ts` (`contactEmail`, currently `hello@example.com`).
AdSense and users expect a working contact method. Optionally also update `SITE.name` if you
want a different brand than "ToolNest".

## 1. Put the code on GitHub
```bash
git init
git add .
git commit -m "Utility Tools Hub: initial launch build"
# create an empty repo on github.com, then:
git remote add origin https://github.com/<you>/<repo>.git
git branch -M main
git push -u origin main
```
Note: `.env*` is gitignored, so no secrets are committed. Good.

## 2. Deploy to Vercel (free tier)
1. Go to vercel.com and sign in with GitHub.
2. "Add New… → Project", import your repo.
3. Framework preset auto-detects **Next.js**. Leave build settings as default
   (`next build`, output handled automatically).
4. Add environment variables (Project → Settings → Environment Variables):
   | Variable | Value | Notes |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` | Your real domain (no trailing slash) |
   | `NEXT_PUBLIC_ADS_ENABLED` | `false` | Keep false until AdSense approves |
   | `NEXT_PUBLIC_ADSENSE_CLIENT` | *(blank for now)* | Fill after approval |
   | `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Optional, once you create a GA4 property |
5. Click **Deploy**. You'll get a `*.vercel.app` URL within a minute.

## 3. Connect your domain
1. Buy a domain (any registrar; ~₹800–1,200/yr).
2. In Vercel: Project → Settings → Domains → add your domain.
3. Follow Vercel's DNS instructions (either point nameservers to Vercel, or add the A/CNAME
   records it shows). HTTPS is provisioned automatically.
4. After DNS propagates, confirm `https://yourdomain.com` loads and shows the padlock.
5. Make sure `NEXT_PUBLIC_SITE_URL` matches the final domain, then redeploy so the sitemap and
   canonical URLs use it.

## 4. Google Search Console (get indexed)
1. Go to search.google.com/search-console, add your domain as a property.
2. Verify ownership (DNS TXT record is easiest, or the HTML tag method).
3. Submit your sitemap: enter `sitemap.xml` under Sitemaps.
4. Use "URL Inspection" on a few pages and click "Request indexing".
   Indexing takes days to weeks — this is normal.

## 5. Google Analytics (optional but recommended)
1. Create a GA4 property at analytics.google.com, copy the `G-XXXXXXXXXX` measurement ID.
2. Set `NEXT_PUBLIC_GA_ID` in Vercel and redeploy. Analytics loads in production only.

## 6. Apply to AdSense (do this LAST, after traffic starts)
Do not apply on day one. First let the site get indexed and accumulate a little organic
traffic (a few weeks). Then:
1. Sign up at adsense.google.com, add your site.
2. Add the verification snippet if asked (or confirm site ownership).
3. Wait for review (days to weeks). See `docs/SEO-ADSENSE.md` for the full prerequisite list —
   this build already satisfies the structural ones (privacy/terms/about/contact pages,
   original content, fast static pages, mobile-friendly, clear nav).
4. Once approved: in Vercel set `NEXT_PUBLIC_ADS_ENABLED=true` and
   `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX`, optionally the per-slot IDs, and
   redeploy. Ads appear with no code changes.

## 7. Post-launch — the part that actually earns money
Revenue is ₹0 until approval + traffic. Then, per `docs/ROADMAP.md`:
- Ship ~one new/improved tool page per week.
- Use Search Console to find queries where you rank on page 2–3 and improve those pages.
- Favor higher-RPM finance tools (GST, SIP, income tax) to lower the traffic needed.
Reaching ₹5,000–10,000/month realistically takes 6–12 months of this habit.

## Verifying a production build locally (optional)
```bash
npm run build
npm run start   # serves the production build at http://localhost:3000
```
