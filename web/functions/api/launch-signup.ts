// Cloudflare Pages Function — POST /api/launch-signup
//
// Receives the "Be the first to know" form on /development/ and appends it as
// a row to the launch Google Sheet, via the Apps Script web app in
// google-apps-script/launch-signup.gs. Its /exec URL is set as the
// LAUNCH_SIGNUP_SHEET_URL environment variable in Cloudflare Pages — it never
// reaches the browser.
//
// Unlike the enquiry forms (mailto, see enquiry.ts), nothing here opens the
// visitor's mail app: the sign-up is stored server-side.

interface Env {
  LAUNCH_SIGNUP_SHEET_URL?: string;
}

const BUDGETS = ["$500K – $1M", "$1M – $3M", "$3M – $5M", "$5M+"];
const INTERESTS = ["Chapter I", "Chapter II", "Both"];
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

  const row = {
    name: clean(body.name),
    email: clean(body.email),
    phone: clean(body.phone, 40),
    country: clean(body.country, 80),
    budget: clean(body.budget, 40),
    interest: clean(body.interest, 40) || "Both",
    page: clean(body.page, 120),
  };

  if (!row.name || !row.phone || !row.country) return json({ ok: false, error: "Missing fields" }, 422);
  if (!EMAIL.test(row.email)) return json({ ok: false, error: "Invalid email" }, 422);
  if (!BUDGETS.includes(row.budget)) return json({ ok: false, error: "Invalid budget" }, 422);
  if (!INTERESTS.includes(row.interest)) return json({ ok: false, error: "Invalid interest" }, 422);

  // Never claim success without storing it — a lost sign-up is worse than a retry.
  if (!env.LAUNCH_SIGNUP_SHEET_URL) return json({ ok: false, error: "Sign-up storage not configured" }, 503);

  try {
    const res = await fetch(env.LAUNCH_SIGNUP_SHEET_URL, {
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
