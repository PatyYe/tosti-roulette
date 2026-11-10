# Suggesties-worker

Neemt suggesties van de site aan en maakt er één GitHub-issue van. Zonder dit staat het suggestieformulier uit.

1. Maak in Cloudflare onder Turnstile een widget voor `tosti.zonarr.nl`. Je krijgt een sitekey (publiek) en een secret.
2. Maak op GitHub een fine-grained token voor alleen deze repo met rechten *Issues: Read and write*.
3. Rol uit:
   ```
   cd worker
   npx wrangler deploy
   npx wrangler secret put GITHUB_TOKEN
   npx wrangler secret put TURNSTILE_SECRET
   ```
4. Zet bovenin het script van `index.html` bij `SUGGEST` de worker-URL en de Turnstile-sitekey. Dan verschijnt het formulier.

Het issue krijgt het label `suggestie`. Maak dat label aan in de repo als het er nog niet is.

Suggesties zijn anoniem: er wordt niets over de bezoeker opgeslagen.
