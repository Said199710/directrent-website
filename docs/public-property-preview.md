# Public property rendering

Property URLs use `/properties/{id}`. The property page and `/sitemap.xml` run dynamically in the Edge runtime, fetching only the public FastAPI catalogue with `cache: no-store`. API 404 produces page HTTP 404; API failures do not become fabricated listings. Sitemap failures return 503 rather than an empty successful sitemap. The old static sitemap was replaced.

`next.config.mjs` no longer exports a static-only site. Cloudflare Pages must build with `npm run pages:build` and serve `.vercel/output/static`, including its generated `_worker.js`. `wrangler.toml` enables Node compatibility and pins the installed workerd-supported date. This is a local configuration change only; no deployment was run.

Set `PUBLIC_API_URL` at build time to the API origin reachable by the Edge runtime (defaults to NEXT_PUBLIC_API_URL, then https://api.directrent.app). It contains no credentials. Do not deploy the synthetic preview artifact: it embeds localhost. Rebuild with the intended API origin before a separate release.

## Verified synthetic preview

Backend helper: `DATABASE_URL=sqlite:////tmp/directrent-public-preview-901.sqlite .venv/bin/python -m tools.public_preview seed`, then run `uvicorn tools.public_preview:app --host 127.0.0.1 --port 8019` using the same environment and interpreter. The helper refuses databases outside `/tmp`.

Build: `PUBLIC_API_URL=http://127.0.0.1:8019 node node_modules/@cloudflare/next-on-pages/bin/index.js` (includes `npm run build`).

Preview: `./node_modules/.bin/wrangler pages dev .vercel/output/static --ip 127.0.0.1 --port 3019`.

With the final preview running, helper `reset` returned the listing to unverified; raw HTTP returned 404. Helper `approve` used the existing request_review/review_listing service and committed the transaction. HTTP returned 200; raw HTML contained the h1 title, 450,000 monthly price, canonical URL and Open Graph title. Sitemap contained the property URL. Helper `unavailable` marked it occupied; HTTP returned 404 and the sitemap excluded it. No build or preview restart occurred between these transitions.

Raw response evidence is in `/tmp/dr-before.html`, `/tmp/dr-approved.html`, `/tmp/dr-approved.xml`, `/tmp/dr-unavailable.html`, `/tmp/dr-unavailable.xml`.

These checks used Cloudflare's local Workers runtime, not a remotely deployed Cloudflare preview. Production domain, Cloudflare project settings and production database were not changed. Browser presentation and remote staging remain unchecked.

## Public experience browser review

The milestone 3 preview uses API port **8020**, because the previous fixture process on 8019 was preserved. Both `PUBLIC_API_URL` and `NEXT_PUBLIC_API_URL` must be set to `http://127.0.0.1:8020` for this synthetic build. The fixture now allows GET requests from the local browser origin `http://127.0.0.1:3019`.

Run the updated fixture with the same SQLite environment and `uvicorn tools.public_preview:app --host 127.0.0.1 --port 8020`. Restore using `reset`, then `approve` (existing review service). Working review URL: http://127.0.0.1:3019/properties/901.

Browser verification uses installed Chromium directly through CDP (`tools/check_public_cdp.py`), since the system Playwright package lacks its CLI driver. Dedicated browser command: `chromium --headless --no-sandbox --disable-gpu --remote-allow-origins='*' --remote-debugging-port=9337 --user-data-dir=/tmp/directrent-chromium-review-9337 about:blank`. Run `python3 tools/check_public_cdp.py`.

Checked viewports: 1440×1000, 390×844, 320×740. Checks cover real synthetic API search, title/location/price/verification, catalogue-to-detail navigation, viewing CTA, horizontal overflow, loading with network latency, budget no-results, network failure and successful retry, mobile menu bounds and footer contact/legal links. Screenshots: `/tmp/directrent-catalog-{width}.png` and `/tmp/directrent-property-{width}.png`. The synthetic fixture's image does not exist; its broken-photo fallback is exercised. Real owner-photo rendering still needs review with an eligible staging listing that has a working photo URL. No invented property photos or counters were added.

Final build and browser rerun passed after moving the viewing CTA above the photo and shortening the mobile hero. `npm run build`, installed Cloudflare adapter build, and `git diff --check` passed. Raw HTTP checks confirmed 200 for homepage, download, privacy, terms, careers, partnerships, property 901 and sitemap; an unavailable ID returned 404. Property 901 remains approved and available for review. The local Wrangler preview and fixture API were left running. No production deployment occurred.
