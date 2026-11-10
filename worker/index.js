// Cloudflare Worker: neemt suggesties van de site aan en maakt er één GitHub-issue van.
// Het GitHub-token en het Turnstile-geheim staan alleen hier, nooit in de site.
const CATS = ["brood", "kaas", "beleg", "groente", "saus"];
const WAAR = ["thuis", "kantoor", "beide"];
// Alleen letters, cijfers en een paar leestekens: geen @, |, [, ` of # in het issue.
const NAME = /^[\p{L}\p{N} '.,()\-]{2,40}$/u;

export default {
  async fetch(req, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    const reply = (status, msg) =>
      new Response(JSON.stringify({ msg }), { status, headers: { ...cors, "Content-Type": "application/json" } });

    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (req.method !== "POST" || req.headers.get("Origin") !== env.ALLOWED_ORIGIN) return reply(403, "Niet toegestaan");

    let b;
    try { b = await req.json(); } catch { return reply(400, "Ongeldig verzoek"); }
    if (b.website) return reply(200, "Bedankt!"); // honeypot: bots vullen dit veld in

    const items = Array.isArray(b.items) ? b.items : [];
    if (items.length < 1 || items.length > 10) return reply(400, "Geef 1 tot 10 ingrediënten op");
    for (const i of items) {
      if (typeof i?.naam !== "string" || !NAME.test(i.naam.trim()) || !CATS.includes(i.categorie) || !WAAR.includes(i.waar))
        return reply(400, "Een ingrediënt is ongeldig");
    }

    const check = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: String(b.token || ""), remoteip: req.headers.get("CF-Connecting-IP") || "" }),
    }).then((r) => r.json());
    if (!check.success) return reply(403, "Captcha mislukt, probeer het nog eens");

    const names = items.map((i) => i.naam.trim());
    const body =
      "| Ingrediënt | Categorie | Waar |\n|---|---|---|\n" +
      items.map((i, n) => `| ${names[n]} | ${i.categorie} | ${i.waar} |`).join("\n") +
      "\n\nIngestuurd via de site.";
    const res = await fetch(`https://api.github.com/repos/${env.REPO}/issues`, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.GITHUB_TOKEN}`, "User-Agent": "tosti-roulette-worker", Accept: "application/vnd.github+json" },
      body: JSON.stringify({ title: `Suggestie: ${names.join(", ").slice(0, 60)}`, body, labels: ["suggestie"] }),
    });
    return res.ok ? reply(200, "Bedankt!") : reply(502, "Opslaan mislukt");
  },
};
