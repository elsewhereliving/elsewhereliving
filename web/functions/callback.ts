// Cloudflare Pages Function — GET /callback
// GitHub redirects here after login. We exchange the code for an access token
// and hand it back to the Decap editor window (its postMessage handshake).
interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

function page(status: "success" | "error", payload: unknown) {
  // Decap/Sveltia OAuth handshake: announce, wait for the editor, then send result.
  const body = `<!doctype html><html><body><script>
  (function () {
    var data = ${JSON.stringify(payload)};
    function receive(e) {
      window.opener && window.opener.postMessage('authorization:github:${status}:' + JSON.stringify(data), e.origin);
      window.removeEventListener('message', receive, false);
    }
    window.addEventListener('message', receive, false);
    window.opener && window.opener.postMessage('authorizing:github', '*');
  })();
  </script><p>Completing sign-in…</p></body></html>`;
  return new Response(body, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookie = request.headers.get("Cookie") || "";
  const csrf = /ew_csrf=([^;]+)/.exec(cookie)?.[1];

  if (!code) return page("error", { error: "Missing authorization code" });
  if (!state || !csrf || state !== csrf) return page("error", { error: "Invalid state" });

  try {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${url.origin}/callback`,
      }),
    });
    const data = (await res.json()) as { access_token?: string; error_description?: string };
    if (!data.access_token) return page("error", { error: data.error_description || "No access token" });
    return page("success", { token: data.access_token, provider: "github" });
  } catch (err) {
    return page("error", { error: (err as Error).message });
  }
};
