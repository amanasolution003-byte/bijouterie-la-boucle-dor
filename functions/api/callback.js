function renderBody(status, content) {
  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head><meta charset="utf-8"></head>
    <body>
    <script>
      const receiveMessage = (message) => {
        window.opener.postMessage(
          "authorization:github:${status}:" + JSON.stringify(content),
          message.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      };
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    </script>
    </body>
    </html>
  `;
  return new Response(new Blob([html]));
}

export async function onRequest(context) {
  const { request, env } = context;
  const code = new URL(request.url).searchParams.get("code");
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept": "application/json",
      "user-agent": "cloudflare-pages-decap-oauth"
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code
    })
  });
  const result = await response.json();

  if (result.error) {
    return new Response(renderBody("error", result), { status: 401 });
  }

  return new Response(
    renderBody("success", { token: result.access_token, provider: "github" }),
    { headers: { "content-type": "text/html;charset=UTF-8" } }
  );
}