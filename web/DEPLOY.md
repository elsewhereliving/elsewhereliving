# Going live on Cloudflare — step by step

First time? No problem. This is two parts:

- **Part 1 — Put the site online** (~10 min). Do this first; your site goes live.
- **Part 2 — Turn on editing** (~5 min). Makes the `/admin` login work.

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

## Part 2 — Turn on editing (the `/admin` login)

The editor logs in with GitHub. You create a small "GitHub OAuth app" once and paste two values into Cloudflare.

### 1. Create the GitHub login app
1. Go to **github.com/settings/developers** → **OAuth Apps** → **New OAuth App**.
2. Fill in:
   - **Application name:** `Elsewhere Living Admin`
   - **Homepage URL:** `https://elsewhere.living`
   - **Authorization callback URL:** `https://elsewhere.living/callback`
3. Click **Register application**.
4. Copy the **Client ID**. Click **Generate a new client secret** and copy that too.

### 2. Give them to Cloudflare
1. In your Cloudflare Pages project → **Settings → Environment variables** → **Add** (for **Production**):
   - `GITHUB_CLIENT_ID` = the Client ID
   - `GITHUB_CLIENT_SECRET` = the secret
2. Save, then **Deployments → Retry deployment** (so the new values take effect).

### 3. Log in
Go to **https://elsewhere.living/admin** → **Login with GitHub** → approve. You're in — add, edit, and feature listings, and the site updates itself.

Day-to-day editing is in **HOW-TO-EDIT-LISTINGS.md**.

---

## Part 3 — Keep prices current (optional, ~3 min)

Prices are entered in their **real currency** (THB, EUR, USD…) and shown in **USD**, converted at the day's exchange rate. The rate is refreshed **every time the site builds** — and the site builds every time you save a listing. So prices are already current whenever you edit.

To also refresh prices on **quiet days when nobody edits**, set up a once-a-day automatic rebuild:

1. Cloudflare Pages → your project → **Settings → Builds & deployments → Deploy hooks** → **Add deploy hook** (name it `daily`, branch `main`) → **copy the URL**.
2. GitHub → your repo → **Settings → Secrets and variables → Actions → New repository secret**:
   - **Name:** `CF_DEPLOY_HOOK`
   - **Secret:** paste the URL.

That's it. A scheduled job (`.github/workflows/daily-fx-rebuild.yml`) pings it daily and the site rebuilds with fresh rates. Skip this and prices still update on every edit — just not on idle days.

> Note: free exchange-rate data updates about once a day, so this is as "live" as rates realistically get without a paid feed.

---

## Good to know

- **Editing publishes automatically.** When you save in `/admin`, it commits to GitHub, and Cloudflare rebuilds + republishes within a couple of minutes.
- **The contact form** opens the visitor's email/WhatsApp — there's nothing to configure and no spam inbox to manage.
- **Builds re-optimize photos** each time (the `_img` folder isn't stored in git, it's rebuilt). That's why the first deploy takes a few minutes.
- **Repo size:** the photos make the repo large (~700MB). The first `git push` may take a while on a slow connection — that's normal, and only the first time.
