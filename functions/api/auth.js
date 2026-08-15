export async function onRequest(context) {
  const { request, env } = context;
  const clientId = env.GITHUB_CLIENT_ID;
  const url = new URL(request.url);
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", url.origin + "/api/callback");
  authorize.searchParams.set("scope", "repo user");
  authorize.searchParams.set("state", Math.random().toString(36).slice(2));
  return Response.redirect(authorize.href, 302);
}