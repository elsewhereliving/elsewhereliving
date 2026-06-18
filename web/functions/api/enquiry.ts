// Cloudflare Pages Function — POST /api/enquiry
//
// Receives the contact form. If ENQUIRY_FORWARD_URL is configured (a WordPress
// REST endpoint, Formspree, a webhook, …) it forwards the payload there;
// otherwise it just acknowledges so the form works out of the box.
//
// Runs at the edge on Cloudflare Pages — no server to manage.

interface Env {
  ENQUIRY_FORWARD_URL?: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: Record<string, unknown>;
  try {
    const ct = request.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      payload = await request.json();
    } else {
      const form = await request.formData();
      payload = Object.fromEntries(form.entries());
    }
  } catch {
    return json({ ok: false, error: "Invalid request body" }, 400);
  }

  // Minimal validation — the brand asks for first name + email at least.
  if (!payload.email || typeof payload.email !== "string") {
    return json({ ok: false, error: "Email is required" }, 422);
  }

  if (env.ENQUIRY_FORWARD_URL) {
    try {
      const res = await fetch(env.ENQUIRY_FORWARD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, source: "elsewhere.living", received: new Date().toISOString() }),
      });
      if (!res.ok) return json({ ok: false, error: `Forward failed (${res.status})` }, 502);
    } catch (err) {
      return json({ ok: false, error: `Forward error: ${(err as Error).message}` }, 502);
    }
  }

  return json({ ok: true });
};
