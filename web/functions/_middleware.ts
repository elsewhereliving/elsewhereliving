// Edge auth gate for the Listings Studio.
//
// Protects /admin (and everything under it) with HTTP Basic Auth so only
// someone who knows the password can reach the editor. Everything else on the
// site is served normally.
//
// Set these in the Cloudflare Pages project:
//   Settings → Environment variables (Production) →
//     ADMIN_USER  = a username you pick   (e.g. "elsewhere")
//     ADMIN_PASS  = a strong password
// Until both are set, /admin is locked to everyone (fails closed).

interface Env {
  ADMIN_USER?: string;
  ADMIN_PASS?: string;
}

// Constant-time string compare to avoid leaking length/contents via timing.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const { pathname } = new URL(ctx.request.url);

  // Only guard the admin area; let the rest of the site (and other
  // Functions like /api/enquiry) pass straight through.
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  if (!isAdmin) return ctx.next();

  const user = ctx.env.ADMIN_USER || "";
  const pass = ctx.env.ADMIN_PASS || "";

  const deny = () =>
    new Response("Authentication required.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Elsewhere Living Admin", charset="UTF-8"',
        "Cache-Control": "no-store",
      },
    });

  // Fail closed if the password hasn't been configured yet.
  if (!user || !pass) return deny();

  const header = ctx.request.headers.get("Authorization") || "";
  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) return deny();

  let decoded = "";
  try {
    decoded = atob(encoded);
  } catch {
    return deny();
  }
  const idx = decoded.indexOf(":");
  const gotUser = idx >= 0 ? decoded.slice(0, idx) : "";
  const gotPass = idx >= 0 ? decoded.slice(idx + 1) : "";

  if (!safeEqual(gotUser, user) || !safeEqual(gotPass, pass)) return deny();

  return ctx.next();
};
