# Going live on Cloudflare — step by step

First time? No problem. This is two parts:

- **Part 1 — Put the site online** (~10 min). Do this first; your site goes live.
- **Part 2 — Edit your listings** — no setup needed; it works the moment the
  site is online.

You'll need two free accounts: **GitHub** (you already have one — `elsewhereliving`) and **Cloudflare** (sign up at cloudflare.com if you haven't).

---

## Part 1 — Put the site online

### 1. Push the code to GitHub
The project lives in this repo. From a terminal in the project folder:

```bash
git add .
git commit -m "Astro site ready for Cloudflare"
git push
```

(If you'd rather, ask me and I'll do this commit for you.)

### 2. Create the Cloudflare Pages project
1. Go to **dash.cloudflare.com** → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorize Cloudflare to see your GitHub, and pick the **elsewhereliving/elsewhereliving** repo.
3. On the build settings screen, enter **exactly**:
   - **Framework preset:** `Astro`
   - **Root directory (advanced):** `web`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Click **Save and Deploy**.

Cloudflare builds the site (a few minutes the first time — it's optimizing ~1,000 photos). When it's done you'll get a live URL like `elsewhere-living.pages.dev`. **That's your site online.** 🎉

### 3. Point your domain at it
1. In the Pages project → **Custom domains** → **Set up a custom domain** → enter `elsewhere.living`.
2. Cloudflare walks you through it. (If your domain's DNS is already on Cloudflare, it's basically one click. If not, it tells you exactly what to change.)
3. Add `www.elsewhere.living` too if you want; Cloudflare can redirect it.

> Once this works, you can turn off the old Netlify site whenever you're ready.

---

## Part 2 — Edit your listings (The Listings Studio)

There's **nothing to set up** here — no login app, no environment variables.
Editing happens in **The Listings Studio** at `/admin`, which saves listings
straight into your repo folder on your computer; you then push with **GitHub
Desktop** and Cloudflare republishes.

How it works, in short:

1. Open **elsewhere.living/admin** (or `http://localhost:4321/admin` when running
   the site locally) **in Chrome or Edge** — saving needs a browser that can
   write to a folder.
2. Account menu → **Connect repo folder** → pick your `elsewhereliving` folder
   (the one GitHub Desktop uses). Once per session.
3. Add/edit/feature listings, click **Save** — files land in your folder.
4. In **GitHub Desktop**, review the changes, **Commit to main**, **Push**.
   Cloudflare rebuilds and the site is live a couple of minutes later.

The full day-to-day walkthrough is in **HOW-TO-EDIT-LISTINGS.md**.

> No public login gate yet. Anyone who opens `/admin` can browse the editor, but
> they can't save anything without picking *your* repo folder on *their* machine,
> so nothing can be changed or published from someone else's computer. If you
> want `/admin` hidden from the public entirely, add a free **Cloudflare Access**
> rule on the `/admin` path (ask me and I'll set it up).

---

## Part 3 — Keep prices current (optional, ~3 min)

Prices are entered in their **real currency** (THB, EUR, USD…) and shown in **USD**, converted at the day's exchange rate. The rate is refreshed **every time the site builds** — and the site builds every time you push a change. So prices are already current whenever you publish.

To also refresh prices on **quiet days when nobody edits**, set up a once-a-day automatic rebuild:

1. Cloudflare Pages → your project → **Settings → Builds & deployments → Deploy hooks** → **Add deploy hook** (name it `daily`, branch `main`) → **copy the URL**.
2. GitHub → your repo → **Settings → Secrets and variables → Actions → New repository secret**:
   - **Name:** `CF_DEPLOY_HOOK`
   - **Secret:** paste the URL.

That's it. A scheduled job (`.github/workflows/daily-fx-rebuild.yml`) pings it daily and the site rebuilds with fresh rates. Skip this and prices still update on every edit — just not on idle days.

> Note: free exchange-rate data updates about once a day, so this is as "live" as rates realistically get without a paid feed.

---

## Good to know

- **You publish when you push.** Saving in `/admin` writes files to your repo folder; review them in GitHub Desktop and push, then Cloudflare rebuilds + republishes within a couple of minutes.
- **The contact form** opens the visitor's email/WhatsApp — there's nothing to configure and no spam inbox to manage.
- **Builds re-optimize photos** each time (the `_img` folder isn't stored in git, it's rebuilt). That's why the first deploy takes a few minutes.
- **Repo size:** the photos make the repo large (~700MB). The first `git push` may take a while on a slow connection — that's normal, and only the first time.
