# Tosti-roulette

Een willekeurige tosti van beleg dat je waarschijnlijk al hebt. Live op https://tosti.zonarr.nl

Eén bestand, `index.html`, zonder build of dependencies. Open het in een browser.

## Wat je kunt kiezen

- **Hoe gek mag het?** Normaal (brood, kaas en vlees), Apart (met groente en een dipsaus), Chaos of Verrassing.
- **Thuis of kantoor.** Op kantoor komt alleen voor wat daar meestal ligt: jonge of oude kaas, ham, kipfilet, salami, een paar simpele sauzen en soms cherrytomaten of komkommer.
- **Dieet.** Alles, gewoon vlees of halal.
- **Kaas en vlees.** Geen kaas, kaas of meer kaas, en gewoon of extra vlees. Bij twee kazen ligt er één bovenop en één onderop.
- **Pittigheid.** Niks, een snuf chilivlokken, sambal of een extra dikke laag sambal. Sambal ligt als smeersel direct onder of boven het brood. Verrassing kiest willekeurig.
- **Uitsluiten.** Pinda, noten, melk, ei, vis, mosterd en groente komen dan niet voor.

Chaos zet extra kaas en extra vlees vast, zet pittigheid op Verrassing en laat "niks" niet toe.

Het uitsluitfilter kijkt alleen naar het beleg zelf. Sporen en wat er in brood, ham of sauzen zit controleert de eter zelf.

## Ingrediënten aanpassen

De lijsten staan bovenin het script in `index.html` (`BREAD`, `CHEESE`, `FILL`, `VEG`, `SAUCE`). Een ingrediënt is `I(naam, vegetarisch, vegan, halal, gekte)`, waarbij gekte 0 is voor Normaal, 1 voor Apart en 2 voor Chaos. Wat niet op kantoor ligt staat in `NOT_AT_OFFICE`, de allergenen staan in `ALLERGEN`, en het plaatje (emoji en kleur) in `ICON`.

## Suggesties van bezoekers

Onderaan de site kan iemand meerdere ingrediënten voorstellen, met soort en waar het ligt (thuis, kantoor of beide). Dat wordt één GitHub-issue met het label `suggestie`. De site kan dat niet zelf, dus er draait een kleine Cloudflare Worker tussen, met een Turnstile-captcha. Uitleg om die uit te rollen staat in [worker/README.md](worker/README.md). Zonder worker blijft het formulier verborgen.

## Hosten

GitHub Pages, branch `main`, map `/`. Het bestand `CNAME` bevat het domein. In Cloudflare is `tosti` een CNAME naar `patyye.github.io`. Staat de proxy (oranje wolk) aan, dan regelt Cloudflare HTTPS. Zet je hem uit, dan kan GitHub het certificaat zelf uitgeven en "Enforce HTTPS" aanzetten.
