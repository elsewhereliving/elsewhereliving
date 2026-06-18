# How to add & edit your listings

No code. No developer. You edit in **The Listings Studio**, save to your
computer, and push with **GitHub Desktop**. Here's everything you need.

> **Use Chrome or Edge.** Saving needs a browser that can write files to a
> folder (Chrome and Edge can; Safari and Firefox can't). Open the Studio in
> Chrome or Edge.

---

## One-time setup (about 2 minutes)

You already have the site repo on your computer in **GitHub Desktop**. The Studio
saves straight into that folder, so it needs to know where it is — once.

1. Open the Studio:
   - **Locally:** run the site (`npm run dev` in the `web` folder) and go to
     **http://localhost:4321/admin**, **or**
   - **Online:** go to **elsewhere.living/admin**.
2. Top right → the account menu → **Connect repo folder**.
3. Pick your **elsewhereliving** folder (the same one GitHub Desktop uses) and
   click **Allow**.

The status dot turns **green** — the Studio can now save. You do this once per
session (if you close the browser, just click **Connect repo folder** again).

---

## Every day: adding or changing a listing

1. In the Studio, pick **For sale** or **Rentals** at the top.
2. To change one, **click its card**. To add one, click **+ Add property**
   (or **+ Add rental**).
3. Fill in the form — title, market, price, photos, description, features.
   - **Photos:** drag them in, paste an image, or upload. Drag to reorder; the
     first one is the cover. Click a photo → **Set focus** to choose which part
     stays centred when it's cropped on cards.
   - **Price:** pick the **currency** (THB, EUR, USD…) and type the amount as a
     plain number (e.g. `45000000` for ฿45,000,000). The site shows it in **USD
     automatically**, converted at the day's exchange rate — you never do the
     maths. For sale listings can tick **"From" price**. Tick **Price on
     request** to hide the number entirely.
   - **Description:** leave a blank line between paragraphs.
4. Click **Save**. The Studio writes the listing and its photos into your repo
   folder and shows "saved to your repo — review & push".

**To remove a listing** (e.g. it sold): open it and click **Delete**. That
removes its file from your folder.

### Choosing what shows on the homepage

Open the **Featured** tab. Choose **how many** to show (3, 6 or 9), **drag** the
cards into the order visitors see, and **add** any sale listing from the right.
The "Queued · not shown" divider marks the ones beyond your chosen count. Click
**Save home page**. (Removing one here never deletes the listing itself.)

You can also star a listing right on its card (★) to feature it quickly.

---

## Publishing — review, then push

Saving in the Studio writes files to your computer; it does **not** put them
online by itself. To publish:

1. Open **GitHub Desktop**. You'll see the listing files and photos you just
   saved listed as changes.
2. Glance over them, type a short summary (e.g. "Add Choeng Mon villa"), and
   click **Commit to main**.
3. Click **Push origin**.

Cloudflare sees the push and rebuilds the live site automatically — a couple of
minutes later it's live at elsewhere.living. Refresh to see it.

> Why this way? Nothing goes live until *you* push, so you can review every
> change first, and GitHub Desktop keeps a full history you can roll back.

---

## Good to know

- **Your site looks exactly the same** — this only changes how *you* manage it.
- **Photos you add are saved into the repo** alongside the listing, so they push
  and publish together.
- **Sort order:** the **Sort weight** number nudges a listing up or down — higher
  = nearer the top. Leave it alone if unsure.
- **Made a mistake?** Nothing is ever truly lost — every push is saved with a
  history in GitHub Desktop, and anything can be rolled back.
- **Maps:** fill in **Map coordinates** (like `9.421,99.983`) and the listing
  shows a little map. Leave it blank and the map is simply hidden.
- **Prices stay current by themselves** — the USD figure is recalculated at the
  day's exchange rate every time the site builds. See **DEPLOY.md → Part 3**.
