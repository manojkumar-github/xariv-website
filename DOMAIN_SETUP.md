# Custom domain: xarivlabs.com

This guide connects **xarivlabs.com** to the XARIV website on Vercel and sets up Google Search.

---

## Part 1 — Vercel (do this first)

### 1.1 Add domains in Vercel

1. Open [Vercel Dashboard](https://vercel.com) → your **xariv-website** project.
2. Go to **Settings → Domains**.
3. Add both:
   - `xarivlabs.com` (primary)
   - `www.xarivlabs.com`
4. Vercel will show **Invalid Configuration** until DNS is updated — that is expected.

### 1.2 Set primary domain

After DNS validates:

1. In **Domains**, set **xarivlabs.com** as the **Primary** domain.
2. Vercel will redirect `www` → apex automatically (the app also has a www redirect in `next.config.ts`).

### 1.3 Redeploy

Push the latest code (with `site.url = https://xarivlabs.com`) and redeploy, or trigger **Redeploy** in Vercel so sitemap/SEO metadata use the new URL.

---

## Part 2 — DNS at your registrar

Where you bought **xarivlabs.com** (GoDaddy, Namecheap, Google Domains, Cloudflare, etc.), open **DNS settings**.

### Option A — Recommended: keep registrar DNS, add records

| Type | Name / Host | Value | TTL |
|------|-------------|-------|-----|
| **A** | `@` (or blank) | `76.76.21.21` | 3600 (or Auto) |
| **CNAME** | `www` | `cname.vercel-dns.com` | 3600 |

**Notes:**

- `@` means the apex domain `xarivlabs.com`.
- Some registrars use blank instead of `@` for the root.
- Do **not** add both A and CNAME on the same host name.
- Remove any old A/CNAME records pointing elsewhere (parking pages, old hosts).

### Option B — Use Vercel nameservers (optional)

In Vercel → Domains → xarivlabs.com → **Nameservers**, Vercel may offer to manage DNS. If you switch NS to Vercel, update nameservers at your registrar to the values Vercel provides. Then Vercel creates records automatically.

### Verify DNS

After 5–60 minutes (sometimes up to 48h):

```bash
dig xarivlabs.com +short
dig www.xarivlabs.com +short
```

- Apex should resolve to Vercel (often `76.76.21.21` or similar).
- `www` should resolve via CNAME to Vercel.

Vercel dashboard should show **Valid Configuration** with a green check.

---

## Part 3 — Google Search

### 3.1 What the site already provides (after deploy)

| URL | Purpose |
|-----|---------|
| `https://xarivlabs.com/robots.txt` | Tells crawlers what to index |
| `https://xarivlabs.com/sitemap.xml` | Lists all pages for Google |

### 3.2 Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console).
2. **Add property** → choose **URL prefix**: `https://xarivlabs.com`
3. Verify ownership (pick one):

   **DNS TXT (recommended)**  
   - Search Console gives a TXT record like `google-site-verification=xxxxx`  
   - Add at your registrar:  
     - Type: **TXT**  
     - Host: `@`  
     - Value: (paste from Google)  
   - Click **Verify** in Search Console  

   **HTML meta tag (alternative)**  
   - Copy the verification code (content value only).  
   - In Vercel → Project → **Settings → Environment Variables**:  
     - Name: `GOOGLE_SITE_VERIFICATION`  
     - Value: `your-code-here`  
   - Redeploy.  
   - Verify in Search Console.

4. Also add property `https://www.xarivlabs.com` OR rely on www → apex redirect (one property on apex is enough if www redirects).

### 3.3 Submit sitemap

In Search Console → **Sitemaps** → add:

```
https://xarivlabs.com/sitemap.xml
```

### 3.4 Request indexing (optional)

URL Inspection → enter `https://xarivlabs.com` → **Request indexing** for homepage and key pages (`/workflow`, `/lens`, `/pulse`).

### 3.5 Timeline

- DNS + SSL: minutes to a few hours after Vercel validates.
- Google indexing: often **3–14 days** for new domains; sitemap speeds this up.
- Rankings: weeks/months; quality content and backlinks matter.

---

## Part 4 — Email (optional)

`hello@xarivlabs.com` is set in the site config. DNS for **email** is separate from the website:

| Goal | Typical setup |
|------|----------------|
| Forward to Gmail | Registrar email forwarding, or Cloudflare Email Routing |
| Full inbox | Google Workspace / Microsoft 365 → add MX records they provide |
| Transactional only | Resend, SendGrid, etc. |

Website A record does **not** enable email — you need MX records for that.

---

## Part 5 — GitHub Pages redirects (legacy blog)

Old `manojkumar-github.github.io` redirect pages should point to `https://xarivlabs.com` instead of `xariv-website.vercel.app`. Update and push that repo after the custom domain is live.

---

## Checklist

- [ ] Add `xarivlabs.com` and `www.xarivlabs.com` in Vercel Domains
- [ ] Add DNS A record `@` → `76.76.21.21`
- [ ] Add DNS CNAME `www` → `cname.vercel-dns.com`
- [ ] Wait for Vercel green check + HTTPS certificate
- [ ] Set `xarivlabs.com` as primary domain in Vercel
- [ ] Deploy latest code (sitemap, metadata, canonical URLs)
- [ ] Verify site loads at https://xarivlabs.com
- [ ] Open https://xarivlabs.com/sitemap.xml and https://xarivlabs.com/robots.txt
- [ ] Create Google Search Console property
- [ ] Verify via DNS TXT or `GOOGLE_SITE_VERIFICATION` env var
- [ ] Submit sitemap in Search Console
- [ ] (Optional) Set up email forwarding for hello@xarivlabs.com
- [ ] (Optional) Update GitHub Pages redirects to xarivlabs.com

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Vercel shows Invalid Configuration | DNS not propagated; double-check A and CNAME; remove conflicts |
| SSL pending | Wait up to 24h after DNS is correct |
| www works but apex doesn't | Missing A record on `@` |
| Old vercel.app still in Google | Submit new sitemap; set canonical domain in Search Console |
| Redirect loop | Ensure only one primary domain in Vercel |

For Vercel-specific values, always prefer the **exact DNS instructions** shown in your project’s Domains tab — they can differ slightly by region.
