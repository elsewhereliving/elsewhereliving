// Cloudflare Pages Function — POST /api/invest-lead
//
// Receives "Email me this shortlist" on /invest/ and appends it as a row to
// the investor-leads Google Sheet, via the Apps Script web app in
// google-apps-script/invest-lead.gs. Its /exec URL is set as the
// INVEST_LEAD_SHEET_URL environment variable in Cloudflare Pages — it never
// reaches the browser.
//
// Like the /development launch sign-up (launch-signup.ts), nothing here opens
// the visitor's mail app: the lead is stored server-side, with every filter
// answer and the shortlist they saw, so the first reply can start from it.

interface Env {
  INVEST_LEAD_SHEET_URL?: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request body" }, 400);
  }

  // Honeypot filled in → a bot. Acknowledge so it moves on, store nothing.
  if (clean(body.company)) return json({ ok: true });

  const shortlist = Array.isArray(body.shortlist)
    ? body.shortlist.slice(0, 20).map((s) => clean(s, 300)).filter(Boolean)
    : [];
  const budget = Number(body.budget);

  const row = {
    name: clean(body.name),
    email: clean(body.email),
    whatsapp: clean(body.whatsapp, 40),
    country: clean(body.country, 80),
    budget: Number.isFinite(budget) ? Math.round(budget) : 0,
    purpose: clean(body.purpose, 120),
    strategy: clean(body.strategy, 40),
    bedrooms: clean(body.bedrooms, 60),
    ownership: clean(body.ownership, 40),
    completion: clean(body.completion, 40),
    shortlist: shortlist.join("\n"),
    source: clean(body.source, 120),
    page: clean(body.page, 200),
  };

  if (!row.name || !row.country) return json({ ok: false, error: "Missing fields" }, 422);
  if (!EMAIL.test(row.email)) return json({ ok: false, error: "Invalid email" }, 422);
  if (body.consent !== true) return json({ ok: false, error: "Consent required" }, 422);
  if (row.budget < 10_000 || row.budget > 10_000_000) return json({ ok: false, error: "Invalid budget" }, 422);

  // Never claim success without storing it — a lost lead is worse than a retry.
  if (!env.INVEST_LEAD_SHEET_URL) return json({ ok: false, error: "Lead storage not configured" }, 503);

  try {
    const res = await fetch(env.INVEST_LEAD_SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...row,
        received: new Date().toISOString(),
        ip_country: request.headers.get("cf-ipcountry") || "",
      }),
    });
    const out = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    if (!res.ok || !out?.ok) return json({ ok: false, error: `Sheet rejected the row (${res.status})` }, 502);
  } catch (err) {
    return json({ ok: false, error: `Sheet error: ${(err as Error).message}` }, 502);
  }

  return json({ ok: true });
};
