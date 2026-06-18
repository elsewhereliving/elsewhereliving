# How to add & edit your listings

No code. No developer. Here's everything you need.

---

## Every day: adding or changing a listing

1. Go to **elsewhere.living/admin** and log in.
2. Pick **Properties for Sale** (or **Vacation Rentals**) on the left.
3. To change one, click it. To add one, click **New Property** (top right).
4. Fill in the form — title, market, price, photos, description, features.
   - **Photos:** drag them in or click to upload. The first one is the main photo.
   - **Price:** pick the **currency** (THB, EUR, USD…) and type the price as a
     plain number in that currency (e.g. `45000000` for ฿45,000,000). The site
     shows it in **USD automatically**, converted at the day's exchange rate, so
     you never have to do the maths. Leave the price blank for "Price on request".
   - **Description:** leave a blank line between paragraphs.
5. Click **Publish** → **Publish now**.

That's it. Your website updates itself in about a minute or two. Refresh the
page to see it live.

**To remove a listing** (e.g. it sold): open it and click **Delete entry**.

> Tip: you can do all of this from your phone.

### Choosing what shows on the homepage

Open any property and turn on **⭐ Feature on homepage**. Set **Homepage order**
to control the order (1 shows first, then 2, 3 …). Featured properties appear in
the row near the top of the home page. If you don't feature anything, the newest
listings show there automatically.

---

## One-time setup

The login uses your **GitHub** account. The setup is a one-time, ~5-minute task
covered in **DEPLOY.md → "Part 2 — Turn on editing"** (create a GitHub login app,
paste two values into Cloudflare). Ask me and I'll walk you through it.

Once that's done, you just go to **elsewhere.living/admin → Login with GitHub**.

---

## Good to know

- **Your site looks exactly the same** — this only changes how *you* manage it.
- **Photos** you upload are saved with your site automatically.
- **Saved/featured order:** the "Sort weight" number controls how near the top a
  listing appears — higher = closer to the top. Leave it alone if unsure.
- **Made a mistake?** Nothing is ever truly lost — every change is saved with a
  history, and a developer can roll anything back.
- **Maps:** if you fill in "Map coordinates" (like `9.421,99.983`), the listing
  shows a little map. Leave it blank and it's simply hidden.
